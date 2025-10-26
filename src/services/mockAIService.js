// Mock AI Service - No API Keys Required
// This service provides AI-like responses without external API dependencies

class MockAIService {
  constructor() {
    this.responses = {
      greetings: [
        "नमस्ते! I'm ब्रह्मांड AI, your cosmic assistant. How can I help you explore the digital universe today?",
        "Hello! I'm here to help you with your questions and provide assistance.",
        "Hi there! What can I help you with today?",
        "Greetings! I'm your AI assistant, ready to help you with any questions."
      ],
      search: [
        "I can help you find the best resources about your topic. Try searching for specific keywords related to what you're looking for.",
        "For better search results, try using more specific terms or phrases that describe exactly what you need.",
        "Let me help you refine your search. What specific aspect of this topic interests you most?",
        "I suggest searching for tutorials, documentation, or examples related to your topic for comprehensive results."
      ],
      summarize: [
        "I can provide a quick summary of any topic. What would you like me to summarize for you?",
        "Let me break down the key points of this topic in simple terms.",
        "Here's a concise overview of what we're discussing.",
        "I'll give you the main highlights and important details."
      ],
      translate: [
        "I can help you translate text between different languages. What would you like me to translate?",
        "Translation assistance is available! Just let me know what text you need translated and to which language.",
        "I'm here to help with translations. What language would you like me to translate to?",
        "Need help with translation? I can assist you with that."
      ],
      explain: [
        "I'll explain this topic in simple terms that anyone can understand.",
        "Let me break this down into easy-to-understand concepts for you.",
        "I'll provide a clear and simple explanation of this topic.",
        "Here's a straightforward explanation that should help clarify things."
      ],
      default: [
        "That's an interesting question! Let me help you with that.",
        "I understand what you're asking. Here's what I can tell you about that.",
        "Great question! Let me provide you with some helpful information.",
        "I'd be happy to help you with that. Here's what I know about this topic."
      ]
    };

    this.technicalTopics = {
      'javascript': 'JavaScript is a versatile programming language used for web development. It enables interactive websites and can run on both client and server sides.',
      'react': 'React is a popular JavaScript library for building user interfaces. It uses components and a virtual DOM for efficient rendering.',
      'python': 'Python is a high-level programming language known for its simplicity and readability. It\'s widely used in web development, data science, and AI.',
      'css': 'CSS (Cascading Style Sheets) is used to style and layout web pages. It controls the visual presentation of HTML elements.',
      'html': 'HTML (HyperText Markup Language) is the standard markup language for creating web pages and web applications.',
      'node': 'Node.js is a JavaScript runtime that allows you to run JavaScript on the server side, enabling full-stack JavaScript development.',
      'api': 'An API (Application Programming Interface) allows different software applications to communicate with each other.',
      'database': 'A database is an organized collection of data that can be easily accessed, managed, and updated.',
      'git': 'Git is a distributed version control system used for tracking changes in source code during software development.',
      'programming': 'Programming is the process of creating instructions for computers to follow. It involves writing code in various programming languages.',
      'web development': 'Web development involves creating websites and web applications using technologies like HTML, CSS, JavaScript, and various frameworks.',
      'coding': 'Coding is the process of writing instructions in a programming language that a computer can understand and execute.',
      'tutorial': 'A tutorial is a step-by-step guide that teaches you how to do something, often with examples and exercises.',
      'learning': 'Learning programming involves understanding concepts, practicing with code, and building projects to gain hands-on experience.'
    };
  }

  // Check if AI service is available (always true for mock)
  async checkAvailability() {
    return true;
  }

  // Generate chat response
  async chat(message, conversationHistory = []) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const messageLower = message.toLowerCase();
    
    // Determine response type based on message content
    let responseType = 'default';
    
    if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('नमस्ते')) {
      responseType = 'greetings';
    } else if (messageLower.includes('search') || messageLower.includes('find') || messageLower.includes('look for')) {
      responseType = 'search';
    } else if (messageLower.includes('summarize') || messageLower.includes('summary') || messageLower.includes('overview')) {
      responseType = 'summarize';
    } else if (messageLower.includes('translate') || messageLower.includes('translation')) {
      responseType = 'translate';
    } else if (messageLower.includes('explain') || messageLower.includes('what is') || messageLower.includes('how does')) {
      responseType = 'explain';
    }

    // Generate contextual response
    let response = this.generateContextualResponse(message, responseType);
    
    return {
      content: response,
      role: 'assistant',
      timestamp: new Date()
    };
  }

  // Generate contextual response
  generateContextualResponse(message, responseType) {
    const messageLower = message.toLowerCase();
    
    // Check for technical topics
    for (const [topic, explanation] of Object.entries(this.technicalTopics)) {
      if (messageLower.includes(topic)) {
        return this.generateTechnicalResponse(topic, explanation, message);
      }
    }

    // Generate response based on type
    const responses = this.responses[responseType] || this.responses.default;
    const baseResponse = responses[Math.floor(Math.random() * responses.length)];

    // Add some contextual information
    if (responseType === 'explain' && messageLower.includes('?')) {
      return `${baseResponse}\n\nBased on your question, I can provide more specific information if you tell me what particular aspect you'd like to know more about.`;
    }

    if (responseType === 'search') {
      return `${baseResponse}\n\nYou can also try searching for related terms or browse through different categories to find exactly what you're looking for.`;
    }

    return baseResponse;
  }

  // Generate technical response
  generateTechnicalResponse(topic, explanation, originalMessage) {
    const responses = [
      `${explanation}\n\nWould you like me to explain any specific aspect of ${topic} in more detail?`,
      `${explanation}\n\nI can help you with tutorials, examples, or best practices related to ${topic}. What would you like to know more about?`,
      `${explanation}\n\nIf you're looking to learn ${topic}, I can suggest some great resources and learning paths. What's your current level with ${topic}?`,
      `${explanation}\n\nI can provide more detailed information about ${topic} or help you with specific questions you might have.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Generate search insights
  async generateSearchInsights(query, results) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const insights = {
      summary: `Found ${results.length} relevant results for "${query}". Here are the key findings:`,
      keyPoints: results.slice(0, 3).map(r => r.title),
      confidence: 'medium',
      suggestions: [
        `Try searching for "${query} tutorial" for step-by-step guides`,
        `Look for "${query} examples" to see practical implementations`,
        `Search for "${query} best practices" for professional tips`
      ]
    };

    return insights;
  }

  // Generate quick actions
  getQuickActions() {
    return [
      {
        id: 'smart-search',
        title: 'Smart Search',
        description: 'Get search suggestions',
        icon: '🔍'
      },
      {
        id: 'summarize',
        title: 'Summarize',
        description: 'Quick summary of content',
        icon: '📝'
      },
      {
        id: 'translate',
        title: 'Translate',
        description: 'Translate text',
        icon: '🌐'
      },
      {
        id: 'explain',
        title: 'Explain',
        description: 'Simple explanations',
        icon: '💡'
      }
    ];
  }

  // Check if service is configured (always true for mock)
  isConfigured() {
    return true;
  }

  // Get service status
  getStatus() {
    return {
      configured: true,
      mode: 'Mock AI (Demo Mode)',
      available: true,
      service: 'Mock AI'
    };
  }
}

const mockAIService = new MockAIService();
export default mockAIService;
