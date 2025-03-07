from typing import Dict, Any, Optional
import json
import requests


class OllamaModel:
    def __init__(
        self,
        model_name: str = "qwen2.5:1.5b",
        base_url: str = "http://localhost:11434",
        temperature: float = 0.7,
        top_p: float = 0.9,
        top_k: int = 40,
        repeat_penalty: float = 1.1,
        max_tokens: int = 2000,
    ):
        """
        Initialize the Ollama model with configuration.

        Args:
            model_name (str): Name of the model to use
            base_url (str): Base URL for Ollama API
            temperature (float): Controls randomness in generation (0.0 to 1.0)
            top_p (float): Nucleus sampling threshold (0.0 to 1.0)
            top_k (int): Number of tokens to consider for sampling
            repeat_penalty (float): Penalty for repeating tokens
            max_tokens (int): Maximum number of tokens to generate
        """
        self.model_name = model_name
        self.base_url = base_url.rstrip("/")
        self.chat_url = f"{self.base_url}/api/chat"

        # Model parameters
        self.config = {
            "temperature": temperature,
            "top_p": top_p,
            "top_k": top_k,
            "repeat_penalty": repeat_penalty,
            "max_tokens": max_tokens,
        }

        # Verify connection and model availability
        self._verify_connection()

    def _verify_connection(self) -> None:
        """Verify connection to Ollama and model availability."""
        try:
            # Check API connection
            version_response = requests.get(f"{self.base_url}/api/version")
            if version_response.status_code != 200:
                raise ConnectionError("Failed to connect to Ollama API")

            # Check model availability
            models_response = requests.get(f"{self.base_url}/api/tags")
            if models_response.status_code != 200:
                raise ConnectionError("Failed to get model list")

            models = models_response.json().get("models", [])
            available_models = [model["name"] for model in models]

            if self.model_name not in available_models:
                print(
                    f"Warning: Model '{self.model_name}' not found in available models"
                )
                print(f"Available models: {', '.join(available_models)}")
                print(
                    f"You may need to pull the model first: ollama pull {self.model_name}"
                )

        except requests.exceptions.ConnectionError:
            raise ConnectionError(f"Could not connect to Ollama at {self.base_url}")

    def update_config(self, **kwargs) -> None:
        """
        Update model configuration parameters.

        Args:
            **kwargs: Configuration parameters to update
        """
        valid_params = self.config.keys()
        for param, value in kwargs.items():
            if param in valid_params:
                self.config[param] = value
                print(f"Updated {param} to {value}")
            else:
                print(f"Warning: Invalid parameter '{param}'")

    def get_config(self) -> Dict[str, Any]:
        """Get current model configuration."""
        return self.config.copy()

    def generate_response(self, messages: list, stream: bool = False) -> Any:
        """
        Generate a response using the model.

        Args:
            messages (list): List of message dictionaries with 'role' and 'content'
            stream (bool): Whether to stream the response

        Returns:
            dict or generator: Model response
        """
        payload = {
            "model": self.model_name,
            "messages": messages,
            "stream": stream,
            **self.config,
        }

        try:
            if stream:
                return self._stream_response(payload)
            else:
                response = requests.post(self.chat_url, json=payload)
                if response.status_code == 200:
                    return response.json()
                else:
                    raise Exception(f"Error: {response.status_code} - {response.text}")

        except Exception as e:
            raise Exception(f"Error generating response: {str(e)}")

    def _stream_response(self, payload: Dict[str, Any]):
        """
        Stream response from the model.

        Args:
            payload (dict): Request payload

        Yields:
            dict: Response chunks
        """
        try:
            with requests.post(self.chat_url, json=payload, stream=True) as response:
                if response.status_code != 200:
                    yield {
                        "error": f"Error: {response.status_code} - {response.text}",
                        "done": True,
                        "success": False,
                    }
                    return

                for line in response.iter_lines():
                    if line:
                        try:
                            chunk_data = json.loads(line.decode("utf-8"))
                            if (
                                "message" in chunk_data
                                and "content" in chunk_data["message"]
                            ):
                                yield {
                                    "chunk": chunk_data["message"]["content"],
                                    "done": False,
                                    "success": True,
                                }
                        except json.JSONDecodeError:
                            continue

                # Send final chunk
                yield {"chunk": "", "done": True, "success": True}

        except Exception as e:
            yield {
                "error": f"Error streaming response: {str(e)}",
                "done": True,
                "success": False,
            }

    def create_chat_prompt(self, system_prompt: str, user_query: str) -> list:
        """
        Create a formatted chat prompt.

        Args:
            system_prompt (str): System instructions
            user_query (str): User's question

        Returns:
            list: Formatted messages for the chat
        """
        return [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_query},
        ]
