# Ollama Q&A Bot API

A simple API for a Q&A bot that uses Ollama with the qwen2.5:1.5b model. The bot answers questions based on a knowledge base provided in a text file.

## Prerequisites

- Python 3.6+
- [Ollama](https://ollama.ai/) installed and running locally
- qwen2.5:1.5b model pulled in Ollama

## Installation

1. Clone this repository or download the files
2. Install the required dependencies:

```bash
pip install requests flask flask_cors
```

## Running the API Server

The easiest way to run the API server is to use the provided shell script:

```bash
./run_api_simple.sh
```

This script will:

- Check if Ollama is running
- Check if the qwen2.5:1.5b model is available and offer to pull it if not
- Install required Python packages if needed
- Start the API server

Alternatively, you can run the server directly:

```bash
python qa_bot_api.py
```

The API server will be available at http://localhost:5000

## API Endpoints

### 1. Ask a Question (Non-streaming)
