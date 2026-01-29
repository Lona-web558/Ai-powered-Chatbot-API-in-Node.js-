# Ai-powered-Chatbot-API-in-Node.js-
Ai powered Chatbot API in Node.js 

# AI-Powered Chatbot API

A simple Node.js chatbot API built with traditional JavaScript syntax (no arrow functions, using `var` declarations).

## Features

- RESTful API endpoints
- Conversation history tracking
- Multiple conversation support
- Pattern-based AI responses
- CORS enabled
- Health check endpoint

## Requirements

- Node.js (version 8 or higher)

## Installation

No additional packages required! This API uses only Node.js core modules:
- `http` - HTTP server
- `url` - URL parsing

## Running the Server

```bash
node chatbot-api.js
```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. Root Endpoint
**GET /** - Get API information

**Response:**
```json
{
  "message": "Welcome to AI Chatbot API",
  "endpoints": {
    "/chat": "POST - Send a message to the chatbot",
    "/history": "GET - Get conversation history",
    "/clear": "POST - Clear conversation history",
    "/health": "GET - Check API health"
  }
}
```

### 2. Chat Endpoint
**POST /chat** - Send a message to the chatbot

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "conversationId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Hello! How can I assist you today?",
  "conversationId": "user123",
  "timestamp": "2026-01-30T10:30:00.000Z"
}
```

### 3. History Endpoint
**GET /history?conversationId=user123** - Get conversation history

**Response:**
```json
{
  "success": true,
  "conversationId": "user123",
  "history": [
    {
      "role": "user",
      "message": "Hello",
      "timestamp": "2026-01-30T10:30:00.000Z"
    },
    {
      "role": "assistant",
      "message": "Hello! How can I assist you today?",
      "timestamp": "2026-01-30T10:30:01.000Z"
    }
  ],
  "messageCount": 2
}
```

### 4. Clear Endpoint
**POST /clear** - Clear conversation history

**Request Body:**
```json
{
  "conversationId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Conversation cleared",
  "conversationId": "user123"
}
```

### 5. Health Endpoint
**GET /health** - Check API health status

**Response:**
```json
{
  "status": "healthy",
  "message": "Chatbot API is running",
  "timestamp": "2026-01-30T10:30:00.000Z",
  "activeConversations": 3
}
```

## Testing with cURL

### Send a chat message:
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "conversationId": "test123"}'
```

### Get conversation history:
```bash
curl http://localhost:3000/history?conversationId=test123
```

### Clear conversation:
```bash
curl -X POST http://localhost:3000/clear \
  -H "Content-Type: application/json" \
  -d '{"conversationId": "test123"}'
```

### Check health:
```bash
curl http://localhost:3000/health
```

## Chatbot Capabilities

The AI chatbot can respond to:
- Greetings (hello, hi, hey)
- Time queries (what time is it?)
- Date queries (what's the date?)
- Weather questions
- Jokes
- Help requests
- Farewells
- General conversation

## Configuration

You can modify these variables in `chatbot-api.js`:
- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: localhost)

## Architecture

- **In-memory storage**: Conversations are stored in memory
- **Pattern matching**: Simple keyword-based AI responses
- **Conversation tracking**: Each conversation is identified by `conversationId`
- **History limit**: Keeps last 20 messages per conversation

## Stopping the Server

Press `Ctrl+C` to gracefully shut down the server.

## Notes

- This is a basic AI chatbot for demonstration purposes
- Conversations are stored in memory and will be lost when the server restarts
- For production use, consider adding a database for persistent storage
- The AI logic uses simple pattern matching; for advanced AI, integrate with external APIs like OpenAI or Anthropic

