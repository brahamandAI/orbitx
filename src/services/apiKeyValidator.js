// API Key Validator - Check if API keys are properly configured
export class APIKeyValidator {
  static validateOpenAIKey(apiKey) {
    if (!apiKey) {
      return {
        valid: false,
        error: 'API key is missing',
        suggestion: 'Add REACT_APP_OPENAI_API_KEY to your .env file'
      };
    }

    if (typeof apiKey !== 'string') {
      return {
        valid: false,
        error: 'API key must be a string',
        suggestion: 'Check your .env file format'
      };
    }

    if (apiKey.includes(' ')) {
      return {
        valid: false,
        error: 'API key contains spaces',
        suggestion: 'Remove extra spaces from your API key in .env file'
      };
    }

    if (!apiKey.startsWith('sk-')) {
      return {
        valid: false,
        error: 'Invalid OpenAI API key format',
        suggestion: 'OpenAI API keys should start with "sk-"'
      };
    }

    if (apiKey.length < 40) {
      return {
        valid: false,
        error: 'API key too short',
        suggestion: 'Check if you copied the complete API key'
      };
    }

    return {
      valid: true,
      message: 'API key format is valid'
    };
  }

  static async testOpenAIConnection(apiKey) {
    console.log('🧪 Testing OpenAI API connection...');
    
    const validation = this.validateOpenAIKey(apiKey);
    if (!validation.valid) {
      console.error('❌ API key validation failed:', validation.error);
      return validation;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        return {
          valid: false,
          error: 'Invalid API key',
          suggestion: 'Your OpenAI API key is not valid. Generate a new one from https://platform.openai.com/api-keys'
        };
      }

      if (response.status === 429) {
        return {
          valid: false,
          error: 'Rate limit exceeded',
          suggestion: 'Too many requests. Wait a moment or check your OpenAI usage limits.'
        };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          valid: false,
          error: `API error: ${response.status}`,
          suggestion: errorData.error?.message || 'Check your OpenAI account status'
        };
      }

      console.log('✅ OpenAI API connection successful');
      return {
        valid: true,
        message: 'OpenAI API is working correctly'
      };

    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return {
        valid: false,
        error: 'Network error',
        suggestion: 'Check your internet connection or try again later'
      };
    }
  }

  static getDebugInfo() {
    const openaiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const brahamandKey = process.env.REACT_APP_BRAHAMAND_AI_API_KEY;

    return {
      openai: {
        configured: !!openaiKey,
        length: openaiKey ? openaiKey.length : 0,
        startsWithSk: openaiKey ? openaiKey.startsWith('sk-') : false,
        hasSpaces: openaiKey ? openaiKey.includes(' ') : false
      },
      brahamand: {
        configured: !!brahamandKey,
        length: brahamandKey ? brahamandKey.length : 0
      },
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasEnvFile: true // If we're reading these, .env exists
      }
    };
  }
}

export default APIKeyValidator;

