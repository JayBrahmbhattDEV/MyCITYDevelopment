import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer
from datasets import load_dataset
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
import os
from typing import Dict, Sequence

# Configuration
MODEL_NAME = "Qwen/Qwen2.5-1.5B"
OUTPUT_DIR = "./qwen_finetuned_mycity"
DATASET_PATH = "dataset.jsonl"


def prepare_dataset(dataset):
    """Prepare the dataset for training."""
    prompt_template = """### Instruction: {instruction}

### Response: {output}

### End"""

    def format_prompt(example):
        """Format each example with the prompt template."""
        return {
            "text": prompt_template.format(
                instruction=example["instruction"], output=example["output"]
            )
        }

    # Format all examples
    formatted_dataset = dataset.map(format_prompt)

    # Tokenize the dataset
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)
    tokenizer.pad_token = tokenizer.eos_token

    def tokenize(example):
        return tokenizer(
            example["text"], truncation=True, max_length=512, padding="max_length"
        )

    tokenized_dataset = formatted_dataset.map(
        tokenize, remove_columns=formatted_dataset.column_names
    )

    return tokenized_dataset


def main():
    # Load dataset
    print("Loading dataset...")
    dataset = load_dataset("json", data_files=DATASET_PATH)

    # Prepare dataset
    print("Preparing dataset...")
    processed_dataset = prepare_dataset(dataset["train"])

    # Load model and tokenizer
    print("Loading model and tokenizer...")
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME, torch_dtype=torch.float16, trust_remote_code=True, device_map="auto"
    )
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)
    tokenizer.pad_token = tokenizer.eos_token

    # Configure LoRA
    print("Configuring LoRA...")
    lora_config = LoraConfig(
        r=8,  # Rank
        lora_alpha=32,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
    )

    # Prepare model for training
    print("Preparing model for training...")
    model = prepare_model_for_kbit_training(model)
    model = get_peft_model(model, lora_config)

    # Training arguments
    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        num_train_epochs=3,
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,
        warmup_steps=2,
        learning_rate=2e-4,
        fp16=True,
        logging_steps=1,
        save_strategy="epoch",
        save_total_limit=3,
        remove_unused_columns=False,
    )

    # Initialize trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=processed_dataset,
        data_collator=lambda data: {
            "input_ids": torch.stack([f["input_ids"] for f in data]),
            "attention_mask": torch.stack([f["attention_mask"] for f in data]),
        },
    )

    # Train
    print("Starting training...")
    trainer.train()

    # Save the model
    print("Saving model...")
    trainer.save_model(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)


if __name__ == "__main__":
    main()
