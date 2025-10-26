// Hybrid AI Service - Smart AI Integration
// This service automatically chooses between Brahamand AI, OpenAI, and mock service based on availability

import brahamandAIService from './brahamandAIService';
import openaiService from './openaiService';
import mockAIService from './mockAIService';

class HybridAIService {
  constructor() {
    this.brahamandAI = brahamandAIService;
    this.openAI = openaiService;
    this.mockAI = mockAIService;
    this.preferredService = null;
    this.lastHealthCheck = null;
    this.healthCheckInterval = 5 * 60 * 1000; // 5 minutes
  }

  // Determine which AI service to use
  async getPreferredService() {
    const now = Date.now();
    
    console.log('🔍 Selecting AI service...');
    
    // Use cached result if recent
    if (this.preferredService && this.lastHealthCheck && (now - this.lastHealthCheck) < this.healthCheckInterval) {
      console.log('✅ Using cached service:', this.preferredService.constructor.name);
      return this.preferredService;
    }

    // Check Brahamand AI first (highest priority)
    console.log('1️⃣ Checking Brahmand AI...');
    console.log('   - isConfigured:', this.brahamandAI.isConfigured);
    
    if (this.brahamandAI.isConfigured) {
      try {
        console.log('   - Calling checkAvailability()...');
        const isAvailable = await this.brahamandAI.checkAvailability();
        console.log('   - Available:', isAvailable);
        
        if (isAvailable) {
          this.preferredService = this.brahamandAI;
          this.lastHealthCheck = now;
          console.log('✅ Using Brahamand AI service');
          return this.brahamandAI;
        }
      } catch (error) {
        console.log('❌ Brahamand AI error:', error.message);
        console.log('⚠️ Brahamand AI unavailable, trying OpenAI...');
      }
    } else {
      console.log('   - Not configured, skipping...');
    }

    // Check OpenAI second (medium priority)
    console.log('2️⃣ Checking OpenAI...');
    console.log('   - isConfigured:', this.openAI.isConfigured());
    
    if (this.openAI.isConfigured()) {
      try {
        console.log('   - Calling checkAvailability()...');
        const isAvailable = await this.openAI.checkAvailability();
        console.log('   - Available:', isAvailable);
        
        if (isAvailable) {
          this.preferredService = this.openAI;
          this.lastHealthCheck = now;
          console.log('✅ Using OpenAI service');
          return this.openAI;
        }
      } catch (error) {
        console.log('❌ OpenAI error:', error.message);
        console.log('⚠️ OpenAI unavailable, falling back to mock service');
      }
    } else {
      console.log('   - Not configured, skipping...');
    }

    // Fallback to mock service (lowest priority, always works)
    console.log('3️⃣ Using Mock AI (fallback)');
    this.preferredService = this.mockAI;
    this.lastHealthCheck = now;
    console.log('🔄 Using mock AI service (fallback)');
    return this.mockAI;
  }

  // Generate chat response
  async chat(message, conversationHistory = []) {
    const service = await this.getPreferredService();
    return await service.chat(message, conversationHistory);
  }

  // Generate search insights
  async generateSearchInsights(query, results) {
    const service = await this.getPreferredService();
    return await service.generateSearchInsights(query, results);
  }

  // Get quick actions
  getQuickActions() {
    // Always return enhanced actions from Brahamand AI if configured
    if (this.brahamandAI.isConfigured) {
      return this.brahamandAI.getQuickActions();
    }
    return this.mockAI.getQuickActions();
  }

  // Check service availability
  async checkAvailability() {
    const service = await this.getPreferredService();
    return service.checkAvailability();
  }

  // Get service status
  getStatus() {
    return {
      brahamandAI: this.brahamandAI.getStatus(),
      openAI: {
        configured: this.openAI.isConfigured(),
        hasApiKey: !!process.env.REACT_APP_OPENAI_API_KEY
      },
      mockAI: this.mockAI.getStatus ? this.mockAI.getStatus() : { configured: true, mode: 'Mock AI' },
      preferredService: this.preferredService?.constructor.name || 'None',
      lastHealthCheck: this.lastHealthCheck
    };
  }

  // Force refresh of service selection
  async refreshService() {
    this.preferredService = null;
    this.lastHealthCheck = null;
    return await this.getPreferredService();
  }

  // Check if Brahamand AI is configured
  isBrahamandAIConfigured() {
    return this.brahamandAI.isConfigured;
  }

  // Check if OpenAI is configured
  isOpenAIConfigured() {
    return this.openAI.isConfigured();
  }

  // Get configuration instructions
  getConfigurationInstructions() {
    const brahamandStatus = this.brahamandAI.getStatus();
    
    if (brahamandStatus.configured && brahamandStatus.demoMode) {
      return {
        status: 'configured',
        message: 'ब्रह्मांड AI is active in Demo Mode!',
        service: 'ब्रह्मांड AI (Demo)',
        instructions: 'Using OpenAI backend with Brahmand AI personality. Full features active!'
      };
    } else if (this.brahamandAI.isConfigured && !brahamandStatus.demoMode) {
      return {
        status: 'configured',
        message: 'ब्रह्मांड AI is configured and ready!',
        service: 'ब्रह्मांड AI',
        instructions: 'Your Brahamand AI API key is set up correctly.'
      };
    } else if (this.openAI.isConfigured()) {
      return {
        status: 'configured',
        message: 'OpenAI is configured and ready!',
        service: 'OpenAI GPT-3.5',
        instructions: 'Your OpenAI API key is active. Real AI features are now working!'
      };
    } else {
      return {
        status: 'not_configured',
        message: 'No AI API configured - Using demo mode',
        service: 'Mock AI (Demo)',
        instructions: 'Add OpenAI API key (REACT_APP_OPENAI_API_KEY) or Brahamand AI key (REACT_APP_BRAHAMAND_AI_API_KEY) in .env file for real AI features.'
      };
    }
  }
}

const aiService = new HybridAIService();
export default aiService;
