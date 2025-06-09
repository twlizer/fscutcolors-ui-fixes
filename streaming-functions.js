// Enhanced UI - Streaming Response Functions
// This adds streaming capability to enhanced modes

// Store original sendMessage function
const originalSendMessage = RealAIChat.prototype.sendMessage;

// Override sendMessage for enhanced modes
RealAIChat.prototype.sendMessage = async function() {
    const message = this.inputElement.value.trim();
    if (!message) return;

    this.addMessage(message, "user");
    this.inputElement.value = "";
    this.sendButton.disabled = true;

    const isEnhancedMode = this.currentAI.includes('-enhanced');
    
    if (isEnhancedMode) {
        await this.handleEnhancedModeStreaming(message);
    } else {
        // Use original function for regular modes
        await this.handleRegularMode(message);
    }
    
    this.sendButton.disabled = false;
};

// Enhanced mode streaming handler
RealAIChat.prototype.handleEnhancedModeStreaming = async function(message) {
    const container = this.createEnhancedContainer();
    const responsesDiv = container.querySelector('.ai-responses');
    const progressDiv = container.querySelector('.progress-indicator');
    
    try {
        if (this.currentAI === 'combined-enhanced') {
            // Enhanced Sequential
            progressDiv.textContent = 'Claude AI analyzing...';
            const claudeSection = this.createResponseSection('Claude AI', '🎯 Initial Analysis');
            responsesDiv.appendChild(claudeSection);
            
            const claudeResult = await this.callSingleAI('claude', `Analyze: "${message}". ChatGPT will build upon your response.`);
            this.updateResponseSection(claudeSection, claudeResult.response);
            
            progressDiv.textContent = 'ChatGPT building upon analysis...';
            const chatgptSection = this.createResponseSection('ChatGPT', '🔬 Complementary Analysis');
            responsesDiv.appendChild(chatgptSection);
            
            const chatgptResult = await this.callSingleAI('openai', `Claude analyzed: "${claudeResult.response}". Add your complementary perspective on: "${message}"`);
            this.updateResponseSection(chatgptSection, chatgptResult.response);
            
            progressDiv.textContent = '✅ Enhanced Sequential Complete';
            
        } else if (this.currentAI === 'debate-enhanced') {
            // Enhanced Debate
            progressDiv.textContent = 'Claude AI preparing PRO arguments...';
            const claudeSection = this.createResponseSection('Claude AI', '💪 PRO Position');
            responsesDiv.appendChild(claudeSection);
            
            const claudeResult = await this.callSingleAI('claude', `Take the PRO/SUPPORTING position on: "${message}". Present strong arguments.`);
            this.updateResponseSection(claudeSection, claudeResult.response);
            
            progressDiv.textContent = 'ChatGPT preparing CON arguments...';
            const chatgptSection = this.createResponseSection('ChatGPT', '⚔️ CON Position');
            responsesDiv.appendChild(chatgptSection);
            
            const chatgptResult = await this.callSingleAI('openai', `Take the CON/OPPOSING position on: "${message}". Claude's PRO arguments: "${claudeResult.response}". Challenge their points.`);
            this.updateResponseSection(chatgptSection, chatgptResult.response);
            
            progressDiv.textContent = '🏆 Enhanced Debate Complete';
            
        } else if (this.currentAI === 'synthesis-enhanced') {
            // Enhanced Synthesis
            progressDiv.textContent = 'Claude AI providing analysis...';
            const claudeSection = this.createResponseSection('Claude AI', '🎯 Initial Analysis');
            responsesDiv.appendChild(claudeSection);
            
            const claudeResult = await this.callSingleAI('claude', `Provide comprehensive analysis on: "${message}". ChatGPT will add complementary insights.`);
            this.updateResponseSection(claudeSection, claudeResult.response);
            
            progressDiv.textContent = 'ChatGPT adding insights...';
            const chatgptSection = this.createResponseSection('ChatGPT', '🔬 Complementary Insights');
            responsesDiv.appendChild(chatgptSection);
            
            const chatgptResult = await this.callSingleAI('openai', `Review Claude's analysis: "${claudeResult.response}". Add complementary insights for: "${message}"`);
            this.updateResponseSection(chatgptSection, chatgptResult.response);
            
            progressDiv.textContent = '💎 Enhanced Synthesis Complete';
        }
    } catch (error) {
        progressDiv.textContent = '❌ Error occurred';
        this.addErrorMessage(`Enhanced mode error: ${error.message}`);
    }
};

// Helper functions
RealAIChat.prototype.createEnhancedContainer = function() {
    const container = document.createElement('div');
    container.className = 'enhanced-conversation';
    container.innerHTML = `
        <div class="enhanced-header">
            <h3>⚡ Enhanced AI Collaboration</h3>
            <div class="progress-indicator">Starting...</div>
        </div>
        <div class="ai-responses"></div>
    `;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message ai-message enhanced-mode';
    messageElement.appendChild(container);
    this.messagesContainer.appendChild(messageElement);
    this.scrollToBottom();
    
    return container;
};

RealAIChat.prototype.createResponseSection = function(aiName, title) {
    const section = document.createElement('div');
    section.className = 'ai-response-section';
    section.innerHTML = `
        <div class="ai-response-header">
            <strong>${aiName}</strong> - ${title}
            <div class="loading-spinner">⏳ Thinking...</div>
        </div>
        <div class="ai-response-content">
            <div class="typing-indicator">💭 Generating response...</div>
        </div>
    `;
    this.scrollToBottom();
    return section;
};

RealAIChat.prototype.updateResponseSection = function(section, response) {
    const contentDiv = section.querySelector('.ai-response-content');
    const spinner = section.querySelector('.loading-spinner');
    
    spinner.style.display = 'none';
    contentDiv.innerHTML = `<div class="response-text">${response}</div>`;
    this.scrollToBottom();
};

RealAIChat.prototype.callSingleAI = async function(aiType, prompt) {
    const endpoint = aiType === 'claude' ? '/api/claude/chat' : '/api/openai/chat';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt })
        });
        
        const result = await response.json();
        return {
            success: true,
            response: result.response || 'No response received'
        };
    } catch (error) {
        return {
            success: false,
            response: `${aiType} error: ${error.message}`
        };
    }
};
