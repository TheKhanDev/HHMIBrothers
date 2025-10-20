// ===== AI ASSISTANT MODULE =====
// This file handles the AI shopping assistant functionality
// Includes chat interface, response generation, and user interaction

// ===== DOM ELEMENTS =====
// Cache all AI assistant related DOM elements for better performance
const aiToggle = document.getElementById('aiToggle');
const aiChat = document.getElementById('aiChat');
const closeChat = document.getElementById('closeChat');
const aiMessages = document.getElementById('aiMessages');
const aiInput = document.getElementById('aiInput');
const aiSend = document.getElementById('aiSend');

// ===== STATE VARIABLES =====
let isAIChatOpen = false; // Track chat state
let conversationHistory = []; // Store conversation for context

// ===== INITIALIZATION =====
/**
 * Initializes the AI assistant when DOM is fully loaded
 * Sets up all event listeners and prepares the chat interface
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 AI Assistant initializing...');
    
    // Initialize the AI assistant
    initializeAIAssistant();
    
    // Add welcome message to chat
    addWelcomeMessage();
});

// ===== INITIALIZATION FUNCTIONS =====

/**
 * Sets up the AI assistant with all necessary event listeners
 */
function initializeAIAssistant() {
    try {
        // Set up event listeners for chat functionality
        setupAIAssistantEvents();
        
        // Load any previous conversation from localStorage
        loadConversationHistory();
        
        console.log('✅ AI Assistant initialized successfully');
    } catch (error) {
        console.error('❌ AI Assistant initialization failed:', error);
    }
}

/**
 * Sets up all event listeners for the AI assistant
 */
function setupAIAssistantEvents() {
    // Toggle chat visibility when AI button is clicked
    aiToggle.addEventListener('click', handleAIToggle);
    
    // Close chat when close button is clicked
    closeChat.addEventListener('click', handleCloseChat);
    
    // Send message when send button is clicked
    aiSend.addEventListener('click', handleSendMessage);
    
    // Send message when Enter key is pressed
    aiInput.addEventListener('keypress', handleKeyPress);
    
    // Clear input when Escape key is pressed
    aiInput.addEventListener('keydown', handleEscapeKey);
    
    console.log('🔧 AI Assistant event listeners setup complete');
}

/**
 * Adds a welcome message to the chat when first opened
 */
function addWelcomeMessage() {
    const welcomeMessage = "Hello! I'm your AI shopping assistant at HHMI Brothers. I can help you with:\n\n• Finding the perfect jacket\n• Size and fit guidance\n• Price information\n• Delivery options\n• Order placement\n• Store location\n\nHow can I assist you today? 🧥";
    addMessage(welcomeMessage, 'bot', true);
}

// ===== CHAT MANAGEMENT FUNCTIONS =====

/**
 * Handles the AI toggle button click
 * Opens or closes the chat interface
 */
function handleAIToggle() {
    if (isAIChatOpen) {
        closeAIChat();
    } else {
        openAIChat();
    }
}

/**
 * Handles the close chat button click
 */
function handleCloseChat() {
    closeAIChat();
}

/**
 * Opens the AI chat interface with animations
 */
function openAIChat() {
    aiChat.classList.add('active');
    isAIChatOpen = true;
    
    // Focus on input field after animation
    setTimeout(() => {
        aiInput.focus();
    }, 300);
    
    console.log('💬 AI Chat opened');
}

/**
 * Closes the AI chat interface
 */
function closeAIChat() {
    aiChat.classList.remove('active');
    isAIChatOpen = false;
    
    // Clear input when closing
    aiInput.value = '';
    
    console.log('💬 AI Chat closed');
}

/**
 * Handles key press events in the input field
 * @param {KeyboardEvent} e - The key press event
 */
function handleKeyPress(e) {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
}

/**
 * Handles Escape key to clear input
 * @param {KeyboardEvent} e - The key down event
 */
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        aiInput.value = '';
    }
}

// ===== MESSAGE HANDLING FUNCTIONS =====

/**
 * Handles sending a message from the user
 * Validates input and processes the message
 */
function handleSendMessage() {
    const message = aiInput.value.trim();
    
    // Validate message
    if (!validateMessage(message)) {
        return;
    }
    
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input field
    aiInput.value = '';
    
    // Generate and display AI response
    generateAIResponse(message);
}

/**
 * Validates the user message before sending
 * @param {string} message - The message to validate
 * @returns {boolean} True if message is valid
 */
function validateMessage(message) {
    if (message === '') {
        showInputError('Please type a message');
        return false;
    }
    
    if (message.length > 500) {
        showInputError('Message is too long (max 500 characters)');
        return false;
    }
    
    return true;
}

/**
 * Shows an input error message
 * @param {string} error - The error message to display
 */
function showInputError(error) {
    // Temporary visual feedback for input error
    aiInput.style.borderColor = '#e74c3c';
    setTimeout(() => {
        aiInput.style.borderColor = '';
    }, 2000);
    
    console.warn('Input validation error:', error);
}

/**
 * Adds a user message to the chat
 * @param {string} message - The user's message
 */
function addUserMessage(message) {
    addMessage(message, 'user');
    
    // Add to conversation history
    conversationHistory.push({
        type: 'user',
        content: message,
        timestamp: new Date().toISOString()
    });
    
    // Save conversation to localStorage
    saveConversationHistory();
    
    console.log('👤 User message added:', message);
}

/**
 * Adds a bot message to the chat
 * @param {string} message - The bot's response
 */
function addBotMessage(message) {
    addMessage(message, 'bot');
    
    // Add to conversation history
    conversationHistory.push({
        type: 'bot',
        content: message,
        timestamp: new Date().toISOString()
    });
    
    // Save conversation to localStorage
    saveConversationHistory();
    
    console.log('🤖 Bot response added:', message.substring(0, 50) + '...');
}

// ===== MESSAGE DISPLAY FUNCTIONS =====

/**
 * Adds a message to the chat interface
 * @param {string} text - The message text
 * @param {string} sender - 'user' or 'bot'
 * @param {boolean} isWelcome - Whether this is a welcome message
 */
function addMessage(text, sender, isWelcome = false) {
    // Create message container
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    // Add typing indicator for bot messages (except welcome)
    if (sender === 'bot' && !isWelcome) {
        showTypingIndicator();
    }
    
    // Use setTimeout to simulate typing for bot messages
    setTimeout(() => {
        if (sender === 'bot' && !isWelcome) {
            hideTypingIndicator();
        }
        
        // Set message content
        messageDiv.textContent = text;
        
        // Add to messages container
        aiMessages.appendChild(messageDiv);
        
        // Scroll to bottom to show latest message
        scrollToBottom();
        
    }, sender === 'bot' && !isWelcome ? 1000 : 0);
}

/**
 * Shows typing indicator in the chat
 */
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '🤖 AI is typing<span class="typing-dots"></span>';
    aiMessages.appendChild(typingDiv);
    scrollToBottom();
}

/**
 * Hides the typing indicator
 */
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Scrolls the chat to the bottom
 */
function scrollToBottom() {
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

// ===== AI RESPONSE GENERATION =====

/**
 * Generates an AI response based on user message
 * @param {string} userMessage - The user's message
 */
function generateAIResponse(userMessage) {
    console.log('🧠 Generating AI response for:', userMessage);
    
    // Simulate AI processing time
    const processingTime = Math.random() * 1000 + 500; // 500-1500ms
    
    setTimeout(() => {
        try {
            const response = createAIResponse(userMessage);
            addBotMessage(response);
        } catch (error) {
            console.error('Error generating AI response:', error);
            addBotMessage("I apologize, but I'm having trouble processing your request. Please try again or contact our customer service directly.");
        }
    }, processingTime);
}

/**
 * Creates an appropriate response based on user message
 * @param {string} message - User's message
 * @returns {string} AI response
 */
function createAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Product and catalog queries
    if (lowerMessage.includes('jacket') || lowerMessage.includes('product') || lowerMessage.includes('collection')) {
        return handleProductQuery(lowerMessage);
    }
    
    // Price and cost queries
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
        return handlePriceQuery(lowerMessage);
    }
    
    // Size and fit queries
    if (lowerMessage.includes('size') || lowerMessage.includes('fit') || lowerMessage.includes('measure')) {
        return handleSizeQuery(lowerMessage);
    }
    
    // Order and purchase queries
    if (lowerMessage.includes('order') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
        return handleOrderQuery(lowerMessage);
    }
    
    // Delivery and shipping queries
    if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping') || lowerMessage.includes('dispatch')) {
        return handleDeliveryQuery(lowerMessage);
    }
    
    // Contact and location queries
    if (lowerMessage.includes('contact') || lowerMessage.includes('location') || lowerMessage.includes('address')) {
        return handleContactQuery(lowerMessage);
    }
    
    // Material and quality queries
    if (lowerMessage.includes('material') || lowerMessage.includes('fabric') || lowerMessage.includes('quality')) {
        return handleMaterialQuery(lowerMessage);
    }
    
    // Return and exchange queries
    if (lowerMessage.includes('return') || lowerMessage.includes('exchange') || lowerMessage.includes('refund')) {
        return handleReturnQuery(lowerMessage);
    }
    
    // Weather specific queries
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('winter') || lowerMessage.includes('cold')) {
        return handleWeatherQuery(lowerMessage);
    }
    
    // Greeting and general help
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
        return handleGreetingQuery(lowerMessage);
    }
    
    // Default response for unrecognized queries
    return handleDefaultQuery(lowerMessage);
}

// ===== SPECIALIZED RESPONSE HANDLERS =====

/**
 * Handles product-related queries
 */
function handleProductQuery(message) {
    const responses = [
        "We have a fantastic collection of jackets! 🧥 We offer:\n\n• Winter Parkas - Perfect for cold weather\n• Leather Jackets - Classic and stylish\n• Denim Jackets - Casual and comfortable\n• Puffer Jackets - Lightweight warmth\n• Bomber Jackets - Sporty and versatile\n• Trench Coats - Elegant and formal\n\nWhich type are you interested in?",
        
        "Our jacket collection includes various styles for different occasions. We have everything from cozy winter parkas to stylish leather jackets. You can browse our products above or use the search feature to find specific types!",
        
        "Looking for something specific? We have jackets for all seasons and occasions. Winter jackets for warmth, rain jackets for protection, and fashion jackets for style. What kind of jacket are you looking for?"
    ];
    return getRandomResponse(responses);
}

/**
 * Handles price-related queries
 */
function handlePriceQuery(message) {
    return "Our jackets are priced between PKR 3,299 and PKR 5,999, offering great value for premium quality. 💰\n\n• Budget-friendly options start at PKR 3,299\n• Mid-range jackets: PKR 3,999 - PKR 4,799\n• Premium jackets: PKR 4,799 - PKR 5,999\n\nYou can sort products by price using the 'Sort by' feature above!";
}

/**
 * Handles size-related queries
 */
function handleSizeQuery(message) {
    return "We offer a comprehensive size range to ensure perfect fit: 📏\n\n• S (Small) - Chest: 36-38″\n• M (Medium) - Chest: 38-40″\n• L (Large) - Chest: 40-42″\n• XL (Extra Large) - Chest: 42-44″\n• XXL (Double Extra Large) - Chest: 44-46″\n\nAll our jackets are true to size with comfortable fits. When you place an order, you can select your preferred size!";
}

/**
 * Handles order-related queries
 */
function handleOrderQuery(message) {
    return "Ordering is easy! Here's how: 🛒\n\n1. Browse our jacket collection\n2. Click 'Buy Now' on your chosen product\n3. Fill out the order form with your details\n4. Choose WhatsApp or Email to confirm\n5. We'll contact you within 24 hours\n\nWe offer cash on delivery in Peshawar and various payment options for other cities!";
}

/**
 * Handles delivery-related queries
 */
function handleDeliveryQuery(message) {
    return "Delivery Information: 🚚\n\n• Peshawar: 1-2 business days\n• Other major cities: 2-3 business days\n• Remote areas: 3-5 business days\n• Free delivery on orders above PKR 10,000\n• We use reliable courier services\n• Tracking information provided for all orders\n\nYour jacket will arrive safely packaged and ready to wear!";
}

/**
 * Handles contact-related queries
 */
function handleContactQuery(message) {
    return "Contact HHMI Brothers: 📞\n\n📍 Store Location: Saddar Bazar, Peshawar\n📞 Phone/WhatsApp: +92 3429438436\n📧 Email: hhmibrothers@gmail.com\n🕒 Business Hours: 10:00 AM - 9:00 PM\n\nVisit our store to try jackets or message us for assistance!";
}

/**
 * Handles material-related queries
 */
function handleMaterialQuery(message) {
    return "Quality Materials: 🧵\n\nOur jackets feature premium materials:\n• Genuine Leather - Durable and stylish\n• Premium Denim - Comfortable and long-lasting\n• Polyester Blends - Water-resistant and lightweight\n• Wool Blends - Warm and breathable\n• Cotton - Soft and comfortable\n\nAll materials are carefully selected for quality and comfort!";
}

/**
 * Handles return-related queries
 */
function handleReturnQuery(message) {
    return "Return & Exchange Policy: 🔄\n\n• 7-day return window\n• Items must be unworn with tags\n• Original packaging required\n• Exchanges subject to availability\n• Refunds processed within 3-5 days\n• Contact us for return authorization\n\nWe want you to be completely satisfied with your purchase!";
}

/**
 * Handles weather-related queries
 */
function handleWeatherQuery(message) {
    if (message.includes('rain') || message.includes('water')) {
        return "For rainy weather, I recommend our waterproof trench coats and rain jackets. They provide excellent protection while maintaining style. Look for jackets with water-resistant coatings! ☔";
    } else if (message.includes('winter') || message.includes('cold')) {
        return "For cold weather, our winter parkas and puffer jackets are perfect! They offer excellent insulation with hoods and multiple pockets for functionality. Stay warm and stylish! ❄️";
    } else {
        return "We have jackets for all weather conditions! Lightweight options for mild weather, insulated jackets for cold, and waterproof options for rain. What weather conditions are you preparing for?";
    }
}

/**
 * Handles greeting and general help queries
 */
function handleGreetingQuery(message) {
    const responses = [
        "Hello! 👋 I'm your AI shopping assistant at HHMI Brothers. I can help you find the perfect jacket, check sizes, compare prices, or guide you through ordering. What would you like to know?",
        
        "Hi there! 🧥 Welcome to HHMI Brothers. I'm here to help you with any questions about our jacket collection, sizes, prices, or delivery. How can I assist you today?",
        
        "Greetings! I'm your personal shopping assistant. I can provide information about our products, help with sizing, explain our delivery process, or assist with ordering. What would you like help with?"
    ];
    return getRandomResponse(responses);
}

/**
 * Handles unrecognized queries with helpful suggestions
 */
function handleDefaultQuery(message) {
    return "I'm not sure I understand. 🤔 I can help you with:\n\n• Finding specific types of jackets\n• Size and fit guidance\n• Price information and comparisons\n• Delivery options and timing\n• Order process explanation\n• Store location and contact details\n\nCould you rephrase your question or ask about one of these topics?";
}

// ===== UTILITY FUNCTIONS =====

/**
 * Returns a random response from an array
 * @param {Array} responses - Array of possible responses
 * @returns {string} Random response
 */
function getRandomResponse(responses) {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
}

/**
 * Saves conversation history to localStorage
 */
function saveConversationHistory() {
    try {
        // Keep only last 20 messages to prevent storage overload
        if (conversationHistory.length > 20) {
            conversationHistory = conversationHistory.slice(-20);
        }
        
        localStorage.setItem('hhmi-ai-conversation', JSON.stringify(conversationHistory));
    } catch (error) {
        console.warn('Could not save conversation history:', error);
    }
}

/**
 * Loads conversation history from localStorage
 */
function loadConversationHistory() {
    try {
        const saved = localStorage.getItem('hhmi-ai-conversation');
        if (saved) {
            conversationHistory = JSON.parse(saved);
            console.log('📚 Loaded conversation history:', conversationHistory.length, 'messages');
        }
    } catch (error) {
        console.warn('Could not load conversation history:', error);
        conversationHistory = [];
    }
}

/**
 * Clears the conversation history
 */
function clearConversationHistory() {
    conversationHistory = [];
    localStorage.removeItem('hhmi-ai-conversation');
    console.log('🗑️ Conversation history cleared');
}

// ===== PUBLIC API =====
// Expose useful functions for other scripts if needed
window.AIAssistant = {
    openChat: openAIChat,
    closeChat: closeAIChat,
    clearHistory: clearConversationHistory,
    sendMessage: handleSendMessage
};

console.log('🎉 AI Assistant module loaded successfully and ready to help!');