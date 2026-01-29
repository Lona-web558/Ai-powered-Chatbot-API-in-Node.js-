// AI-Powered Chatbot API
// Traditional JavaScript with var and function declarations

var http = require('http');
var url = require('url');

// Configuration
var PORT = 3000;
var HOST = 'localhost';

// Simple in-memory conversation storage
var conversations = {};

// AI Response Generator (simulated AI logic)
function generateAIResponse(userMessage, conversationId) {
    var message = userMessage.toLowerCase().trim();
    
    // Get conversation history
    if (!conversations[conversationId]) {
        conversations[conversationId] = [];
    }
    
    var history = conversations[conversationId];
    
    // Add user message to history
    history.push({
        role: 'user',
        message: userMessage,
        timestamp: new Date().toISOString()
    });
    
    // Simple AI logic with pattern matching
    var response = '';
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        response = 'Hello! How can I assist you today?';
    } else if (message.includes('how are you')) {
        response = 'I\'m doing great, thank you for asking! How can I help you?';
    } else if (message.includes('weather')) {
        response = 'I can help you with weather information. What location are you interested in?';
    } else if (message.includes('time')) {
        var currentTime = new Date().toLocaleTimeString();
        response = 'The current time is ' + currentTime;
    } else if (message.includes('date')) {
        var currentDate = new Date().toLocaleDateString();
        response = 'Today\'s date is ' + currentDate;
    } else if (message.includes('help')) {
        response = 'I can help you with various tasks. Try asking me about the time, date, weather, or just have a conversation!';
    } else if (message.includes('bye') || message.includes('goodbye')) {
        response = 'Goodbye! Have a great day!';
    } else if (message.includes('thank')) {
        response = 'You\'re welcome! Is there anything else I can help you with?';
    } else if (message.includes('name')) {
        response = 'I\'m an AI-powered chatbot created to assist you. You can call me ChatBot!';
    } else if (message.includes('joke')) {
        var jokes = [
            'Why don\'t programmers like nature? It has too many bugs!',
            'Why do programmers prefer dark mode? Because light attracts bugs!',
            'How many programmers does it take to change a light bulb? None, that\'s a hardware problem!'
        ];
        var randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        response = randomJoke;
    } else {
        // Default responses for unrecognized input
        var defaultResponses = [
            'That\'s interesting! Tell me more.',
            'I understand. How can I assist you further?',
            'I\'m here to help! Could you provide more details?',
            'I see. What would you like to know about that?'
        ];
        response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    // Add AI response to history
    history.push({
        role: 'assistant',
        message: response,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 20 messages
    if (history.length > 20) {
        conversations[conversationId] = history.slice(-20);
    }
    
    return response;
}

// Parse JSON request body
function parseRequestBody(request, callback) {
    var body = '';
    
    request.on('data', function(chunk) {
        body += chunk.toString();
    });
    
    request.on('end', function() {
        try {
            var parsedBody = JSON.parse(body);
            callback(null, parsedBody);
        } catch (error) {
            callback(error, null);
        }
    });
}

// Send JSON response
function sendJSONResponse(response, statusCode, data) {
    response.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    response.end(JSON.stringify(data));
}

// Handle chat endpoint
function handleChatEndpoint(request, response) {
    if (request.method === 'OPTIONS') {
        sendJSONResponse(response, 200, {});
        return;
    }
    
    if (request.method !== 'POST') {
        sendJSONResponse(response, 405, {
            error: 'Method not allowed',
            message: 'Only POST requests are accepted'
        });
        return;
    }
    
    parseRequestBody(request, function(error, body) {
        if (error) {
            sendJSONResponse(response, 400, {
                error: 'Invalid JSON',
                message: 'Request body must be valid JSON'
            });
            return;
        }
        
        var message = body.message;
        var conversationId = body.conversationId || 'default';
        
        if (!message) {
            sendJSONResponse(response, 400, {
                error: 'Missing message',
                message: 'Request body must include a "message" field'
            });
            return;
        }
        
        // Generate AI response
        var aiResponse = generateAIResponse(message, conversationId);
        
        sendJSONResponse(response, 200, {
            success: true,
            response: aiResponse,
            conversationId: conversationId,
            timestamp: new Date().toISOString()
        });
    });
}

// Handle conversation history endpoint
function handleHistoryEndpoint(request, response, parsedUrl) {
    if (request.method === 'OPTIONS') {
        sendJSONResponse(response, 200, {});
        return;
    }
    
    if (request.method !== 'GET') {
        sendJSONResponse(response, 405, {
            error: 'Method not allowed',
            message: 'Only GET requests are accepted'
        });
        return;
    }
    
    var query = parsedUrl.query;
    var conversationId = query.conversationId || 'default';
    
    var history = conversations[conversationId] || [];
    
    sendJSONResponse(response, 200, {
        success: true,
        conversationId: conversationId,
        history: history,
        messageCount: history.length
    });
}

// Handle clear conversation endpoint
function handleClearEndpoint(request, response) {
    if (request.method === 'OPTIONS') {
        sendJSONResponse(response, 200, {});
        return;
    }
    
    if (request.method !== 'POST') {
        sendJSONResponse(response, 405, {
            error: 'Method not allowed',
            message: 'Only POST requests are accepted'
        });
        return;
    }
    
    parseRequestBody(request, function(error, body) {
        if (error) {
            sendJSONResponse(response, 400, {
                error: 'Invalid JSON',
                message: 'Request body must be valid JSON'
            });
            return;
        }
        
        var conversationId = body.conversationId || 'default';
        
        if (conversations[conversationId]) {
            delete conversations[conversationId];
        }
        
        sendJSONResponse(response, 200, {
            success: true,
            message: 'Conversation cleared',
            conversationId: conversationId
        });
    });
}

// Handle health check endpoint
function handleHealthEndpoint(request, response) {
    sendJSONResponse(response, 200, {
        status: 'healthy',
        message: 'Chatbot API is running',
        timestamp: new Date().toISOString(),
        activeConversations: Object.keys(conversations).length
    });
}

// Main request handler
function requestHandler(request, response) {
    var parsedUrl = url.parse(request.url, true);
    var pathname = parsedUrl.pathname;
    
    console.log('[' + new Date().toISOString() + '] ' + request.method + ' ' + pathname);
    
    if (pathname === '/') {
        sendJSONResponse(response, 200, {
            message: 'Welcome to AI Chatbot API',
            endpoints: {
                '/chat': 'POST - Send a message to the chatbot',
                '/history': 'GET - Get conversation history',
                '/clear': 'POST - Clear conversation history',
                '/health': 'GET - Check API health'
            }
        });
    } else if (pathname === '/chat') {
        handleChatEndpoint(request, response);
    } else if (pathname === '/history') {
        handleHistoryEndpoint(request, response, parsedUrl);
    } else if (pathname === '/clear') {
        handleClearEndpoint(request, response);
    } else if (pathname === '/health') {
        handleHealthEndpoint(request, response);
    } else {
        sendJSONResponse(response, 404, {
            error: 'Not found',
            message: 'Endpoint does not exist'
        });
    }
}

// Create and start server
var server = http.createServer(requestHandler);

server.listen(PORT, HOST, function() {
    console.log('=================================');
    console.log('AI Chatbot API Server Started');
    console.log('=================================');
    console.log('Host: ' + HOST);
    console.log('Port: ' + PORT);
    console.log('URL: http://' + HOST + ':' + PORT);
    console.log('=================================');
    console.log('Available Endpoints:');
    console.log('  GET  / - API information');
    console.log('  POST /chat - Send message');
    console.log('  GET  /history - Get history');
    console.log('  POST /clear - Clear history');
    console.log('  GET  /health - Health check');
    console.log('=================================');
});

// Handle server errors
server.on('error', function(error) {
    console.error('Server error:', error);
});

// Graceful shutdown
process.on('SIGINT', function() {
    console.log('\nShutting down server...');
    server.close(function() {
        console.log('Server closed');
        process.exit(0);
    });
});
