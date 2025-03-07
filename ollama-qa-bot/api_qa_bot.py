#!/usr/bin/env python3
import os
import sys
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

# Default knowledge base file
DEFAULT_KNOWLEDGE_FILE = "knowledge_base.txt"
DEFAULT_MODEL = "mycity-qa"


class QABotAPI:
    def __init__(self, model=DEFAULT_MODEL, base_url="http://localhost:11434"):
        """
        Initialize the Q&A bot with the specified model.

        Args:
            model (str): The model to use (default: qwen2.5:1.5b)
            base_url (str): The base URL for the Ollama API
        """
        self.model = model
        self.base_url = base_url
        self.api_url = f"{base_url}/api/chat"
        self.knowledge_base = None
        self.conversation_histories = {}  # Store conversations by session ID

        # Check if Ollama is running
        try:
            response = requests.get(f"{base_url}/api/version")
            if response.status_code == 200:
                print(f"Connected to Ollama version: {response.json().get('version')}")
            else:
                print("Warning: Could not verify Ollama version")
        except requests.exceptions.ConnectionError:
            print(
                "Error: Could not connect to Ollama. Make sure it's running at",
                base_url,
            )
            sys.exit(1)

    def load_knowledge_base(self, filepath=DEFAULT_KNOWLEDGE_FILE):
        """
        Load the knowledge base from a file.

        Args:
            filepath (str): Path to the knowledge base file

        Returns:
            bool: True if successful, False otherwise
        """
        try:
            with open(filepath, "r") as file:
                self.knowledge_base = file.read().strip()
            print(f"Knowledge base loaded from {filepath}")
            return True
        except Exception as e:
            print(f"Error loading knowledge base: {str(e)}")
            return False

    def ask(self, question, session_id="default", stream=False):
        """
        Ask a question to the Q&A bot.

        Args:
            question (str): The question to ask
            session_id (str): Session ID to maintain conversation history
            stream (bool): Whether to stream the response

        Returns:
            dict or generator: The bot's answer and conversation history, or a generator for streaming
        """
        if not self.knowledge_base:
            return {
                "answer": "Error: Knowledge base not loaded. Please load a knowledge base first.",
                "success": False,
            }

        # Initialize conversation history for this session if it doesn't exist
        if session_id not in self.conversation_histories:
            self.conversation_histories[session_id] = []

        # Get the conversation history for this session
        conversation_history = self.conversation_histories[session_id]

        # Add the user question to the conversation history
        conversation_history.append({"role": "user", "content": question})

        # Prepare the system prompt that includes the knowledge base
        system_prompt = f"""You are a Q&A assistant specifically designed to answer questions about the MyCITY app. You can ONLY answer the following questions:

1. "Is this a free service?"
2. "Can I edit or cancel a raised issue?"
3. "What happens after submitting an issue?"
4. "What if I can't find the right category?"

If a user asks any question that is not exactly or very closely related to these topics, respond with:
"I can only help you with the following questions about the MyCITY app:
- Questions about the app being free
- Questions about editing or canceling issues
- Questions about issue status and submission process
- Questions about finding the right category

Please rephrase your question to match one of these topics or ask me one of these questions directly."

Here are the exact answers I should provide for the supported questions:

For questions about the service being free:
"Yes! Our app is completely free to download without any charges or subscriptions."

For questions about editing/canceling issues:
"No, once an issue has been raised you can't edit or cancel it. If it is a mistake then you can contact the support team via email."

For questions about issue status:
"The status for the newly created issue will be Pending and will show up in yellow. Once taken into action the status will change to In-progress and blue. After resolution is met it will change to Closed and green."

For questions about categories:
"If you can not find the category you are looking for, you can add it under the Other category type and add a description as well."

Remember: Only provide these specific answers to these specific questions. For any other questions, provide the guidance message about what questions I can answer."""

        # Prepare the payload for the API request
        payload = {
            "model": self.model,
            "messages": [{"role": "system", "content": system_prompt}]
            + conversation_history,
            "stream": stream,
        }

        try:
            if stream:
                # For streaming, return a generator
                return self._stream_response(payload, conversation_history, session_id)
            else:
                # For non-streaming, return the complete response
                response = requests.post(self.api_url, json=payload)

                if response.status_code == 200:
                    result = response.json()
                    assistant_message = result.get("message", {}).get("content", "")

                    # Add the assistant's response to the conversation history
                    conversation_history.append(
                        {"role": "assistant", "content": assistant_message}
                    )

                    # Update the conversation history for this session
                    self.conversation_histories[session_id] = conversation_history

                    return {
                        "answer": assistant_message,
                        "conversation": conversation_history,
                        "success": True,
                    }
                else:
                    error_message = f"Error: {response.status_code} - {response.text}"
                    print(error_message)
                    return {"answer": error_message, "success": False}
        except Exception as e:
            error_message = f"Error communicating with Ollama: {str(e)}"
            print(error_message)
            return {"answer": error_message, "success": False}

    def _stream_response(self, payload, conversation_history, session_id):
        """
        Stream the response from the Ollama API.

        Args:
            payload (dict): The payload for the API request
            conversation_history (list): The conversation history
            session_id (str): The session ID

        Yields:
            dict: Chunks of the response
        """
        full_response = ""

        try:
            with requests.post(self.api_url, json=payload, stream=True) as response:
                if response.status_code != 200:
                    error_message = f"Error: {response.status_code} - {response.text}"
                    yield {"chunk": error_message, "done": True, "success": False}
                    return

                for line in response.iter_lines():
                    if line:
                        try:
                            chunk_data = json.loads(line.decode("utf-8"))
                            if (
                                "message" in chunk_data
                                and "content" in chunk_data["message"]
                            ):
                                chunk = chunk_data["message"]["content"]
                                full_response += chunk
                                yield {"chunk": chunk, "done": False, "success": True}
                        except json.JSONDecodeError:
                            continue

                # After streaming is complete, update the conversation history
                conversation_history.append(
                    {"role": "assistant", "content": full_response}
                )
                self.conversation_histories[session_id] = conversation_history

                # Send a final chunk indicating completion
                yield {
                    "chunk": "",
                    "done": True,
                    "full_response": full_response,
                    "success": True,
                }

        except Exception as e:
            error_message = f"Error streaming response: {str(e)}"
            print(error_message)
            yield {"chunk": error_message, "done": True, "success": False}

    def reset_conversation(self, session_id="default"):
        """
        Reset the conversation history for a specific session.

        Args:
            session_id (str): Session ID to reset

        Returns:
            bool: True if successful, False if session doesn't exist
        """
        if session_id in self.conversation_histories:
            self.conversation_histories[session_id] = []
            return True
        return False


# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the Q&A bot
qa_bot = QABotAPI()

# Load the knowledge base on startup
if not os.path.exists(DEFAULT_KNOWLEDGE_FILE):
    print(f"Knowledge base file '{DEFAULT_KNOWLEDGE_FILE}' not found.")
    print("Creating a sample knowledge base file...")

    sample_knowledge = """# Sample Knowledge Base

## Company Information
Our company, TechSolutions Inc., was founded in 2010 by Jane Smith and John Doe.
We specialize in providing software solutions for small to medium-sized businesses.
Our headquarters is located in San Francisco, California.

## Products
1. **CloudManager**: A cloud-based solution for managing IT infrastructure.
2. **DataAnalyzer**: A data analytics platform for business intelligence.
3. **SecureConnect**: An enterprise-grade security solution.

## Pricing
- CloudManager: $99/month per user
- DataAnalyzer: $149/month per user
- SecureConnect: $199/month per user

## Contact Information
- Customer Support: support@techsolutions.example.com
- Sales Inquiries: sales@techsolutions.example.com
- Phone: (555) 123-4567
- Hours of Operation: Monday to Friday, 9 AM to 5 PM PST

## FAQ
Q: Do you offer discounts for non-profit organizations?
A: Yes, we offer a 20% discount for verified non-profit organizations.

Q: What payment methods do you accept?
A: We accept all major credit cards, PayPal, and bank transfers.

Q: Do you offer a free trial?
A: Yes, we offer a 30-day free trial for all our products.
"""

    try:
        with open(DEFAULT_KNOWLEDGE_FILE, "w") as file:
            file.write(sample_knowledge)
        print(f"Sample knowledge base created at '{DEFAULT_KNOWLEDGE_FILE}'")
    except Exception as e:
        print(f"Error creating sample knowledge base: {str(e)}")
        sys.exit(1)

# Load the knowledge base
if not qa_bot.load_knowledge_base():
    print("Failed to load knowledge base. Exiting.")
    sys.exit(1)


@app.route("/api/ask", methods=["POST"])
def ask_question():
    """API endpoint to ask a question to the Q&A bot."""
    data = request.json

    if not data or "question" not in data:
        return (
            jsonify(
                {"error": "Missing required parameter: question", "success": False}
            ),
            400,
        )

    question = data["question"]
    session_id = data.get("session_id", "default")
    stream = data.get("stream", False)

    if stream:

        def generate():
            for chunk in qa_bot.ask(question, session_id, stream=True):
                yield f"data: {json.dumps(chunk)}\n\n"

        return app.response_class(
            generate(),
            mimetype="text/event-stream",
            headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
        )
    else:
        result = qa_bot.ask(question, session_id)
        return jsonify(result)


@app.route("/api/ask_stream", methods=["POST"])
def ask_question_stream():
    """API endpoint to ask a question to the Q&A bot with streaming response."""
    data = request.json

    if not data or "question" not in data:
        return (
            jsonify(
                {"error": "Missing required parameter: question", "success": False}
            ),
            400,
        )

    question = data["question"]
    session_id = data.get("session_id", "default")

    def generate():
        for chunk in qa_bot.ask(question, session_id, stream=True):
            yield f"data: {json.dumps(chunk)}\n\n"

    return app.response_class(
        generate(),
        mimetype="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.route("/api/reset", methods=["POST"])
def reset_conversation():
    """API endpoint to reset a conversation."""
    data = request.json
    session_id = data.get("session_id", "default")

    success = qa_bot.reset_conversation(session_id)
    return jsonify(
        {
            "message": (
                f"Conversation for session {session_id} has been reset"
                if success
                else f"Session {session_id} not found"
            ),
            "success": success,
        }
    )


@app.route("/api/health", methods=["GET"])
def health_check():
    """API endpoint to check if the service is running."""
    return jsonify(
        {
            "status": "ok",
            "model": qa_bot.model,
            "knowledge_base": os.path.abspath(DEFAULT_KNOWLEDGE_FILE),
            "success": True,
        }
    )


@app.route("/api/reload", methods=["POST"])
def reload_knowledge_base():
    """API endpoint to reload the knowledge base."""
    success = qa_bot.load_knowledge_base()
    return jsonify(
        {
            "message": (
                "Knowledge base reloaded successfully"
                if success
                else "Failed to reload knowledge base"
            ),
            "success": success,
        }
    )


if __name__ == "__main__":
    # Parse command line arguments
    import argparse

    parser = argparse.ArgumentParser(description="Q&A Bot API")
    parser.add_argument(
        "--host", default="0.0.0.0", help="Host to run the API server on"
    )
    parser.add_argument(
        "--port", type=int, default=5000, help="Port to run the API server on"
    )
    parser.add_argument("--debug", action="store_true", help="Run in debug mode")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Model to use")
    parser.add_argument(
        "--knowledge",
        default=DEFAULT_KNOWLEDGE_FILE,
        help="Path to the knowledge base file",
    )

    args = parser.parse_args()

    # Update model if specified
    if args.model != DEFAULT_MODEL:
        qa_bot.model = args.model
        print(f"Using model: {qa_bot.model}")

    # Load custom knowledge base if specified
    if args.knowledge != DEFAULT_KNOWLEDGE_FILE:
        if not qa_bot.load_knowledge_base(args.knowledge):
            print("Failed to load custom knowledge base. Exiting.")
            sys.exit(1)

    print(f"Starting API server on http://{args.host}:{args.port}")
    app.run(host=args.host, port=args.port, debug=args.debug)
