// Brahamand AI Service - Real AI Integration
// This service provides real AI responses using Brahamand AI API

import { API_KEYS } from '../config/apiKeys';

class BrahamandAIService {
  constructor() {
    this.baseURL = API_KEYS.BRAHAMAND_AI_BASE_URL;
    this.apiKey = API_KEYS.BRAHAMAND_AI_API_KEY;
    this.openaiKey = process.env.REACT_APP_OPENAI_API_KEY;
    // Enable demo mode if OpenAI key is available but Brahamand key is not
    this.demoMode = !this.apiKey && this.openaiKey;
    this.isConfigured = (this.apiKey && this.apiKey.length > 0) || this.demoMode;
  }

  // Check if Brahamand AI service is available
  async checkAvailability() {
    // Demo mode always available if OpenAI is configured
    if (this.demoMode) {
      console.log('✅ ब्रह्मांड AI Demo Mode active (powered by OpenAI)');
      return true;
    }
    
    if (!this.apiKey) {
      console.log('⚠️ Brahamand AI not configured - API key missing');
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('❌ Brahamand AI health check failed:', error);
      // Fallback to demo mode if API fails but OpenAI is available
      if (this.openaiKey) {
        console.log('🔄 Switching to Brahamand AI Demo Mode');
        this.demoMode = true;
        return true;
      }
      return false;
    }
  }

  // Generate chat response using Brahamand AI
  async chat(message, conversationHistory = []) {
    if (!this.isConfigured) {
      throw new Error('Brahamand AI API key not configured');
    }

    // Demo mode: Use OpenAI with Brahamand AI personality
    if (this.demoMode) {
      console.log('🌟 Using ब्रह्मांड AI Demo Mode (OpenAI backend)');
      return await this.chatWithOpenAI(message, conversationHistory);
    }

    // Real Brahamand AI mode
    try {
      const response = await fetch(`${this.baseURL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'brahamand-ai-v1',
          messages: [
            {
              role: 'system',
              content: 'You are ब्रह्मांड AI, a cosmic assistant created by STARTUP ROBUSTRIX. You help users explore the digital universe with wisdom, creativity, and technical expertise. Respond in a friendly, helpful manner, mixing English and Hindi naturally. You are knowledgeable about technology, programming, web development, and digital innovation.'
            },
            ...conversationHistory.slice(-10), // Keep last 10 messages for context
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Brahamand AI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        content: data.choices[0].message.content,
        role: 'assistant',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Brahamand AI chat error:', error);
      // Fallback to demo mode
      if (this.openaiKey) {
        console.log('🔄 Falling back to ब्रह्मांड AI Demo Mode');
        this.demoMode = true;
        return await this.chatWithOpenAI(message, conversationHistory);
      }
      throw error;
    }
  }
  
  // Demo mode chat using OpenAI with Brahmand AI personality
  async chatWithOpenAI(message, conversationHistory = []) {
    console.log('🌟 ब्रह्मांड AI Demo Mode - Starting chat...');
    console.log('🔑 API Key available:', !!this.openaiKey);
    console.log('📝 Message:', message);
    
    if (!this.openaiKey) {
      throw new Error('OpenAI API key not configured. Please add REACT_APP_OPENAI_API_KEY to your .env file.');
    }
    
    try {
      console.log('📡 Calling OpenAI API...');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are ब्रह्मांड AI (Brahmand AI), a cosmic digital assistant created by STARTUP ROBUSTRIX. You embody the vastness and wisdom of the universe (ब्रह्मांड means "universe" in Hindi). You help users explore technology, programming, web development, and digital innovation with a unique blend of cosmic wisdom and practical expertise. Speak naturally mixing English and Hindi (Hinglish) when appropriate. Be friendly, insightful, and helpful. Add occasional cosmic/space metaphors to make interactions more engaging. You are part of the OrbitX Browser ecosystem.'
            },
            ...conversationHistory.slice(-10).map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 1000,
          temperature: 0.8, // Slightly higher for more creative responses
          presence_penalty: 0.6,
          frequency_penalty: 0.3
        })
      });

      console.log('📡 OpenAI Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
        console.error('❌ OpenAI API Error:', errorData);
        throw new Error(`OpenAI API error: ${response.status} - ${errorMessage}`);
      }

      const data = await response.json();
      console.log('✅ OpenAI response received successfully');
      
      return {
        content: data.choices[0].message.content,
        role: 'assistant',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ ब्रह्मांड AI Demo Mode error:', error);
      console.error('❌ Error type:', error.name);
      console.error('❌ Error message:', error.message);
      
      // Provide more specific error messages
      if (error.message.includes('401')) {
        throw new Error('Invalid OpenAI API key. Please check your .env file.');
      } else if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  // Generate search insights using Brahamand AI
  async generateSearchInsights(query, results) {
    if (!this.isConfigured) {
      return this.generateFallbackInsights(query, results);
    }

    // Demo mode: Use OpenAI with Brahamand AI style
    if (this.demoMode) {
      console.log('🌟 Using ब्रह्मांड AI Demo Mode for search insights');
      return await this.generateSearchInsightsWithOpenAI(query, results);
    }

    // Real Brahamand AI mode
    try {
      const response = await fetch(`${this.baseURL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'brahamand-ai-v1',
          messages: [
            {
              role: 'system',
              content: 'You are ब्रह्मांड AI, a search analysis expert. Analyze search results and provide insights, summaries, and suggestions to help users find what they need.'
            },
            {
              role: 'user',
              content: `Analyze these search results for query "${query}": ${JSON.stringify(results.slice(0, 5))}. Provide a summary, key points, and suggestions.`
            }
          ],
          max_tokens: 500,
          temperature: 0.5
        })
      });

      if (!response.ok) {
        throw new Error(`Brahamand AI API error: ${response.status}`);
      }

      const data = await response.json();
      const analysis = data.choices[0].message.content;

      return {
        summary: analysis,
        keyPoints: results.slice(0, 3).map(r => r.title),
        confidence: 'high',
        suggestions: [
          `Try searching for "${query} tutorial" for step-by-step guides`,
          `Look for "${query} examples" to see practical implementations`,
          `Search for "${query} best practices" for professional tips`
        ]
      };
    } catch (error) {
      console.error('❌ Brahamand AI search insights error:', error);
      // Fallback to demo mode
      if (this.demoMode || this.openaiKey) {
        return await this.generateSearchInsightsWithOpenAI(query, results);
      }
      return this.generateFallbackInsights(query, results);
    }
  }
  
  // Generate search insights using OpenAI (demo mode)
  async generateSearchInsightsWithOpenAI(query, results) {
    try {
      const resultsContext = results.slice(0, 5).map((r, i) => 
        `${i + 1}. ${r.title}: ${r.description}`
      ).join('\n');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are ब्रह्मांड AI, a cosmic search analysis expert from STARTUP ROBUSTRIX. Analyze search results with wisdom and provide helpful insights. Be concise but insightful. Mix English and Hindi naturally when appropriate.'
            },
            {
              role: 'user',
              content: `Analyze these search results for query "${query}":\n\n${resultsContext}\n\nProvide a brief, insightful summary (2-3 sentences) about what the user will find in these results.`
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const analysis = data.choices[0].message.content;

      return {
        summary: analysis,
        keyPoints: results.slice(0, 3).map(r => r.title),
        confidence: 'high',
        suggestions: [
          `${query} tutorial - for step-by-step guides`,
          `${query} examples - for practical implementations`,
          `${query} best practices - for professional tips`
        ]
      };
    } catch (error) {
      console.error('❌ OpenAI search insights error:', error);
      return this.generateFallbackInsights(query, results);
    }
  }

  // Fallback insights when API is not available
  generateFallbackInsights(query, results) {
    return {
      summary: `Found ${results.length} relevant results for "${query}". Here are the key findings:`,
      keyPoints: results.slice(0, 3).map(r => r.title),
      confidence: 'medium',
      suggestions: [
        `Try searching for "${query} tutorial" for step-by-step guides`,
        `Look for "${query} examples" to see practical implementations`,
        `Search for "${query} best practices" for professional tips`
      ]
    };
  }

  // Get quick actions for AI panel
  getQuickActions() {
    return [
      {
        id: 'smart-search',
        title: 'Smart Search',
        description: 'Get intelligent search suggestions',
        icon: '🔍'
      },
      {
        id: 'summarize',
        title: 'Summarize',
        description: 'AI-powered content summary',
        icon: '📝'
      },
      {
        id: 'translate',
        title: 'Translate',
        description: 'Multi-language translation',
        icon: '🌐'
      },
      {
        id: 'explain',
        title: 'Explain',
        description: 'Detailed explanations',
        icon: '💡'
      },
      {
        id: 'code-help',
        title: 'Code Help',
        description: 'Programming assistance',
        icon: '💻'
      },
      {
        id: 'creative-writing',
        title: 'Creative Writing',
        description: 'Content creation help',
        icon: '✍️'
      }
    ];
  }

  // Note: isConfigured is a property set in constructor, not a method

  // Get service status
  getStatus() {
    return {
      configured: this.isConfigured,
      demoMode: this.demoMode,
      baseURL: this.baseURL,
      hasApiKey: !!this.apiKey,
      hasOpenAI: !!this.openaiKey,
      mode: this.demoMode ? 'Demo Mode (OpenAI Backend)' : (this.apiKey ? 'Real API' : 'Not Configured')
    };
  }
}

const brahamandAIService = new BrahamandAIService();
export default brahamandAIService;
