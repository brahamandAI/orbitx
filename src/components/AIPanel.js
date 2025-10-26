import React, { useState, useRef, useEffect } from 'react';
import aiService from '../services/aiService';
import APIKeyValidator from '../services/apiKeyValidator';

const AIPanel = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'नमस्ते! I am ब्रह्मांड AI, your cosmic assistant. How can I help you explore the digital universe today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check AI service status on mount
  useEffect(() => {
    const checkAIStatus = async () => {
      try {
        // Get debug info
        const debugInfo = APIKeyValidator.getDebugInfo();
        console.log('🔍 API Key Debug Info:', debugInfo);
        
        // Validate OpenAI key if available
        if (debugInfo.openai.configured) {
          const validation = APIKeyValidator.validateOpenAIKey(process.env.REACT_APP_OPENAI_API_KEY);
          console.log('✅ OpenAI Key Validation:', validation);
          
          if (!validation.valid) {
            console.warn('⚠️ API Key Issue:', validation.error);
            console.warn('💡 Suggestion:', validation.suggestion);
          }
        }
        
        const status = aiService.getStatus();
        const config = aiService.getConfigurationInstructions();
        setAiStatus({ ...status, config });
        
        console.log('🤖 AI Service Status:', status);
        console.log('⚙️ Configuration:', config);
      } catch (error) {
        console.error('Failed to get AI status:', error);
      }
    };
    
    checkAIStatus();
  }, []);

  const handleQuickAction = async (action) => {
    let prompt = '';
    
    switch(action) {
      case 'smart-search':
        prompt = 'Help me find the best resources about my current topic. What should I search for to get the most relevant results?';
        break;
      case 'summarize':
        prompt = 'Can you provide a quick summary of the current page or topic I\'m viewing?';
        break;
      case 'translate':
        prompt = 'I need help translating text. What would you like me to translate?';
        break;
      case 'explain':
        prompt = 'Can you explain this topic in simple terms that anyone can understand?';
        break;
      case 'code-help':
        prompt = 'I need help with programming. Can you assist me with code, debugging, or technical questions?';
        break;
      case 'creative-writing':
        prompt = 'I need help with creative writing, content creation, or brainstorming ideas. Can you assist me?';
        break;
      default:
        prompt = action;
    }
    
    setInputMessage(prompt);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get AI response from hybrid service (Brahamand AI or fallback)
      console.log('🤖 Sending message to AI service:', inputMessage);
      const response = await aiService.chat(inputMessage, messages);
      console.log('✅ AI response received:', response);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('❌ AI Error Details:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      // Determine error type and show helpful message
      let errorContent = '';
      
      if (error.message && error.message.includes('API')) {
        errorContent = `❌ API Error: ${error.message}\n\n💡 Tip: Check your OpenAI API key in .env file. Make sure it's valid and has credits.`;
      } else if (error.message && error.message.includes('401')) {
        errorContent = '❌ Authentication Error: Your API key is invalid.\n\n💡 Please check your OpenAI API key in the .env file.';
      } else if (error.message && error.message.includes('429')) {
        errorContent = '❌ Rate Limit: Too many requests.\n\n💡 Please wait a moment and try again.';
      } else if ((error.message && error.message.includes('network')) || (error.message && error.message.includes('fetch'))) {
        errorContent = '❌ Network Error: Unable to connect to AI service.\n\n💡 Check your internet connection.';
      } else {
        errorContent = `❌ Error: ${error.message || 'Something went wrong'}\n\n💡 Using fallback AI mode. Try refreshing the page.`;
      }
      
      const errorMessage = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998] lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* AI Panel */}
      <div className={`
        ai-panel fixed top-0 right-0 h-full w-96 
        transform transition-all duration-500 ease-out z-[9999]
        ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        shadow-cosmic
      `}>
        {/* Panel Header */}
        <div className="glass-panel border-b border-white/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center glass-panel border border-neon-purple/30 shadow-neon floating-element">
              <img 
                src="/brahamand-ai.gif" 
                alt="ब्रह्मांड AI Logo" 
                className="w-full h-full object-cover"
              />
            </div>
              <div className="flex flex-col">
              <h2 className="aurora-text text-xl font-bold">ब्रह्मांड AI</h2>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-neon-purple/70 font-medium">Cosmic Assistant</span>
                {aiStatus && (
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      aiStatus.config?.status === 'configured' 
                        ? 'bg-green-400 animate-pulse' 
                        : 'bg-yellow-400'
                    }`}></div>
                    <span className="text-xs text-gray-400" title={aiStatus.config?.instructions}>
                      {aiStatus.config?.service || (aiStatus.config?.status === 'configured' ? 'Live' : 'Demo')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="btn-glass p-3 rounded-xl hover:shadow-neon transition-all duration-300 group"
            title="Close AI Panel"
          >
            <svg className="w-5 h-5 text-gray-300 group-hover:text-neon-pink transition-all duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Panel Content */}
        <div className="h-full overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neon-blue/80 uppercase tracking-wider flex items-center space-x-2">
                <span>⚡</span>
                <span>Quick Actions</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {aiService.getQuickActions().map((action, index) => {
                  const colors = ['neon-blue', 'neon-purple', 'neon-pink', 'neon-green', 'neon-cyan', 'neon-orange'];
                  const colorClass = colors[index % colors.length];
                  
                  return (
                    <button 
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      className="btn-glass p-4 rounded-xl text-left transition-all duration-300 group hover:shadow-neon hover:scale-105 active:scale-95"
                    >
                      <div className={`text-${colorClass} mb-2 text-lg group-hover:scale-110 transition-transform duration-300`}>{action.icon}</div>
                      <div className="text-sm font-semibold text-white mb-1">{action.title}</div>
                      <div className="text-xs text-gray-300">{action.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Chat Interface */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neon-purple/80 uppercase tracking-wider flex items-center space-x-2">
                <span>🤖</span>
                <span>ब्रह्मांड AI Chat</span>
              </h3>
              {/* Chat Messages */}
              <div className="glass-panel rounded-2xl p-4 h-96 overflow-y-auto space-y-4 mb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-800 border border-gray-700 text-gray-200'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">🤖</span>
                          <span className="text-xs text-purple-400 font-medium">ब्रह्मांड AI</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-50 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-400">ब्रह्मांड AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="glass-panel rounded-2xl p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 rounded-2xl"></div>
                <div className="relative z-10 flex items-center space-x-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask ब्रह्मांड AI anything..."
                    disabled={isLoading}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
                    title="Send Message"
                  >
                    {isLoading ? (
                      <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  {aiStatus?.config?.service 
                    ? `Powered by ${aiStatus.config.service} • Press Enter to send`
                    : 'ब्रह्मांड AI • Press Enter to send'
                  }
                </p>
              </div>
            </div>
            
            {/* Recent Activity Placeholder */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neon-green/80 uppercase tracking-wider flex items-center space-x-2">
                <span>📊</span>
                <span>Recent Activity</span>
              </h3>
              <div className="space-y-3">
                <div className="btn-glass p-4 rounded-xl hover:shadow-neon transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-white group-hover:text-neon-blue transition-colors duration-300">Summarized article about AI</div>
                    <span className="text-xs text-neon-blue/70">✨</span>
                  </div>
                  <div className="text-xs text-gray-400">2 minutes ago</div>
                </div>
                <div className="btn-glass p-4 rounded-xl hover:shadow-neon transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-white group-hover:text-neon-purple transition-colors duration-300">Translated page to Spanish</div>
                    <span className="text-xs text-neon-purple/70">🌐</span>
                  </div>
                  <div className="text-xs text-gray-400">5 minutes ago</div>
                </div>
                <div className="btn-glass p-4 rounded-xl hover:shadow-neon transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-white group-hover:text-neon-pink transition-colors duration-300">Explained quantum computing</div>
                    <span className="text-xs text-neon-pink/70">💡</span>
                  </div>
                  <div className="text-xs text-gray-400">10 minutes ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIPanel;
