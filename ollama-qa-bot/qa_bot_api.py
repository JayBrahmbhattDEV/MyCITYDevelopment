#!/usr/bin/env python3
import os
import sys
import json
import requests
from flask import (
    Flask,
    request,
    jsonify,
    send_from_directory,
    Response,
    stream_with_context,
)
from flask_cors import CORS

# Default knowledge base file
DEFAULT_KNOWLEDGE_FILE = "knowledge_base.txt"
DEFAULT_MODEL = "qwen2.5:1.5b"


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
        self.sessions = {}  # Store session data

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

    def get_session_history(self, session_id):
        """Get conversation history for a session, creating it if it doesn't exist."""
        if session_id not in self.sessions:
            self.sessions[session_id] = []
        return self.sessions[session_id]

    def reset_session(self, session_id):
        """Reset the conversation history for a session."""
        if session_id in self.sessions:
            self.sessions[session_id] = []
        return True

    def ask(self, question, session_id):
        """
        Ask a question to the Q&A bot.

        Args:
            question (str): The question to ask
            session_id (str): Session identifier

        Returns:
            dict: Response with answer and success status
        """
        if not self.knowledge_base:
            return {"success": False, "answer": "Knowledge base not loaded"}

        # Get conversation history for this session
        conversation_history = self.get_session_history(session_id)

        # Add the user question to the conversation history
        conversation_history.append({"role": "user", "content": question})

        # Prepare the system prompt that includes the knowledge base
        system_prompt = f"""You are a Q&A assistant that only answers questions based on the knowledge provided below. 
If the question cannot be answered using the provided knowledge, say "I don't have information about that in my knowledge base."
Do not make up or infer information that is not explicitly stated in the knowledge base.

KNOWLEDGE BASE:
{self.knowledge_base}

Answer questions only based on the above knowledge base."""

        # Prepare the payload for the API request
        payload = {
            "model": self.model,
            "messages": [{"role": "system", "content": system_prompt}]
            + conversation_history,
            "stream": False,
        }

        try:
            response = requests.post(self.api_url, json=payload)

            if response.status_code == 200:
                result = response.json()
                assistant_message = result.get("message", {}).get("content", "")

                # Add the assistant's response to the conversation history
                conversation_history.append(
                    {"role": "assistant", "content": assistant_message}
                )

                return {"success": True, "answer": assistant_message}
            else:
                error_message = f"Error: {response.status_code} - {response.text}"
                print(error_message)
                return {"success": False, "answer": error_message}
        except Exception as e:
            error_message = f"Error communicating with Ollama: {str(e)}"
            print(error_message)
            return {"success": False, "answer": error_message}

    def ask_stream(self, question, session_id):
        """
        Ask a question to the Q&A bot with streaming response.

        Args:
            question (str): The question to ask
            session_id (str): Session identifier

        Returns:
            generator: Stream of response chunks
        """
        if not self.knowledge_base:
            yield json.dumps(
                {"success": False, "answer": "Knowledge base not loaded", "done": True}
            )
            return

        # Get conversation history for this session
        conversation_history = self.get_session_history(session_id)

        # Add the user question to the conversation history
        conversation_history.append({"role": "user", "content": question})

        # Prepare the system prompt that includes the knowledge base
        system_prompt = f"""You are a Q&A assistant that only answers questions based on the knowledge provided below. 
If the question cannot be answered using the provided knowledge, say "I don't have information about that in my knowledge base."
Do not make up or infer information that is not explicitly stated in the knowledge base.

KNOWLEDGE BASE:
{self.knowledge_base}

Answer questions only based on the above knowledge base."""

        # Prepare the payload for the API request
        payload = {
            "model": self.model,
            "messages": [{"role": "system", "content": system_prompt}]
            + conversation_history,
            "stream": True,
        }

        try:
            # Make streaming request to Ollama
            response = requests.post(self.api_url, json=payload, stream=True)

            if response.status_code == 200:
                full_response = ""

                for line in response.iter_lines():
                    if line:
                        try:
                            chunk = json.loads(line)
                            content = chunk.get("message", {}).get("content", "")
                            full_response += content

                            # Yield the chunk with done=False to indicate streaming is ongoing
                            yield json.dumps(
                                {"success": True, "chunk": content, "done": False}
                            ) + "\n"
                        except json.JSONDecodeError:
                            print(f"Error decoding JSON: {line}")

                # Add the complete response to conversation history
                conversation_history.append(
                    {"role": "assistant", "content": full_response}
                )

                # Yield final chunk with done=True to indicate streaming is complete
                yield json.dumps(
                    {
                        "success": True,
                        "chunk": "",
                        "done": True,
                        "full_response": full_response,
                    }
                ) + "\n"
            else:
                error_message = f"Error: {response.status_code} - {response.text}"
                print(error_message)
                yield json.dumps(
                    {"success": False, "answer": error_message, "done": True}
                ) + "\n"
        except Exception as e:
            error_message = f"Error communicating with Ollama: {str(e)}"
            print(error_message)
            yield json.dumps(
                {"success": False, "answer": error_message, "done": True}
            ) + "\n"


# Create a sample knowledge base if it doesn't exist
def create_sample_knowledge_base():
    if not os.path.exists(DEFAULT_KNOWLEDGE_FILE):
        print(f"Knowledge base file '{DEFAULT_KNOWLEDGE_FILE}' not found.")
        print("Creating a sample knowledge base file...")

        # Use the provided FAQ content
        sample_knowledge = """Is this a free service?
Yes! Our app is completely free to download without any charges or subscriptions.

Can I edit or cancel a raised issue?
No, once an issue has been raised you can't edit or cancel it. If it is a mistake then you can contact the support team via email

What happens after submitting an issue?
The status for the newly created issue will be Pending and will show up in yellow. Once taken into action the status will change to In-progress and blue. After resolution is met it will change to Closed and green

What if I can't find the right category?
If you can not find the category you are looking for, you can add it under the Other category type and add a description as well.
"""

        try:
            with open(DEFAULT_KNOWLEDGE_FILE, "w") as file:
                file.write(sample_knowledge)
            print(f"Sample knowledge base created at '{DEFAULT_KNOWLEDGE_FILE}'")
        except Exception as e:
            print(f"Error creating sample knowledge base: {str(e)}")
            sys.exit(1)


# Initialize Flask app
app = Flask(__name__, static_folder="static")
CORS(app)  # Enable CORS for all routes

# Initialize the Q&A bot
qa_bot = QABotAPI()

# Create sample knowledge base if needed
create_sample_knowledge_base()

# Load the knowledge base
if not qa_bot.load_knowledge_base():
    print("Failed to load knowledge base. Exiting.")
    sys.exit(1)


@app.route("/")
def index():
    return send_from_directory("static", "index.html")


@app.route("/api/ask", methods=["POST"])
def api_ask():
    data = request.json
    if not data or "question" not in data:
        return jsonify({"success": False, "answer": "No question provided"}), 400

    question = data["question"]
    session_id = data.get("session_id", "default")

    result = qa_bot.ask(question, session_id)
    return jsonify(result)


@app.route("/api/ask_stream", methods=["POST"])
def api_ask_stream():
    data = request.json
    if not data or "question" not in data:
        return jsonify({"success": False, "answer": "No question provided"}), 400

    question = data["question"]
    session_id = data.get("session_id", "default")

    return Response(
        stream_with_context(qa_bot.ask_stream(question, session_id)),
        content_type="text/event-stream",
    )


@app.route("/api/reset", methods=["POST"])
def api_reset():
    data = request.json
    session_id = data.get("session_id", "default")

    success = qa_bot.reset_session(session_id)
    return jsonify(
        {
            "success": success,
            "message": (
                "Conversation reset successfully"
                if success
                else "Failed to reset conversation"
            ),
        }
    )


@app.route("/api/health", methods=["GET"])
def api_health():
    return jsonify(
        {
            "success": True,
            "model": qa_bot.model,
            "knowledge_base_file": DEFAULT_KNOWLEDGE_FILE,
        }
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
