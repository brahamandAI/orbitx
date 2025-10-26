// OpenAI Service for AI-powered search insights and responses
class OpenAIService {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  // Check if API key is configured
  isConfigured() {
    return this.apiKey !== 'YOUR_OPENAI_API_KEY_HERE';
  }

  // Generate AI search insights
  async generateSearchInsights(query, searchResults) {
    if (!this.isConfigured()) {
      return this.getFallbackInsight(query);
    }

    try {
      const prompt = `Based on the search query "${query}" and these search results, provide a helpful AI insight:

Search Results:
${searchResults.map((result, index) => `${index + 1}. ${result.title}: ${result.description}`).join('\n')}

Please provide:
1. A brief summary of what the user is looking for
2. Key insights from the search results
3. Related topics they might want to explore
4. Practical advice or recommendations

Keep the response concise and helpful (2-3 sentences).`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant that provides insightful search summaries and recommendations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.choices[0].message.content.trim();
      
      return {
        summary: aiContent,
        content: aiContent, // For backward compatibility
        title: `AI Insight about ${query}`,
        source: 'OpenAI GPT-3.5',
        keyPoints: searchResults.slice(0, 3).map(r => r.title),
        confidence: 'high',
        suggestions: [
          `Try "${query} tutorial" for learning resources`,
          `Search "${query} examples" for practical demos`,
          `Look for "${query} best practices" for expert tips`
        ]
      };

    } catch (error) {
      console.error('OpenAI Error:', error);
      return this.getFallbackInsight(query);
    }
  }

  // Generate related search suggestions
  async generateRelatedSearches(query) {
    if (!this.isConfigured()) {
      return this.getFallbackRelatedSearches(query);
    }

    try {
      const prompt = `Generate 4 related search terms for "${query}". Make them specific and useful for someone researching this topic. Return only the search terms, one per line.`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 100,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.status}`);
      }

      const data = await response.json();
      const suggestions = data.choices[0].message.content
        .trim()
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.?\s*/, '').trim())
        .slice(0, 4);

      return suggestions;

    } catch (error) {
      console.error('OpenAI Related Searches Error:', error);
      return this.getFallbackRelatedSearches(query);
    }
  }

  // Chat with AI about search results
  async chatAboutResults(query, searchResults, userQuestion) {
    if (!this.isConfigured()) {
      return "OpenAI API key not configured. Please add your API key to use AI chat features.";
    }

    try {
      const context = `User searched for: "${query}"
Search Results:
${searchResults.map((result, index) => `${index + 1}. ${result.title}: ${result.description}`).join('\n')}

User Question: ${userQuestion}`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant. Answer the user\'s question based on the search results provided. Be helpful, accurate, and concise.'
            },
            {
              role: 'user',
              content: context
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();

    } catch (error) {
      console.error('OpenAI Chat Error:', error);
      return "Sorry, I couldn't process your question right now. Please try again.";
    }
  }

  // Fallback insight when OpenAI is not available
  getFallbackInsight(query, searchResults = []) {
    const content = `Based on your search for "${query}", here are some related topics you might find interesting: ${query} applications, ${query} tutorials, and ${query} best practices.`;
    
    return {
      summary: content,
      content: content,
      title: `AI Insight about ${query}`,
      source: 'Fallback AI',
      keyPoints: searchResults.slice(0, 3).map(r => r.title || r),
      confidence: 'medium',
      suggestions: [
        `${query} tutorial`,
        `${query} guide`,
        `${query} examples`
      ]
    };
  }

  // Fallback related searches
  getFallbackRelatedSearches(query) {
    return [
      `${query} tutorial`,
      `${query} examples`,
      `${query} guide`,
      `${query} tips`
    ];
  }

  // Check if OpenAI is available
  async checkAvailability() {
    return this.isConfigured();
  }

  // Chat with AI (general conversation)
  async chat(userMessage, conversationHistory = []) {
    if (!this.isConfigured()) {
      return "🔑 OpenAI API key not configured. Please add your API key in the .env file to use AI chat features.";
    }

    try {
      // Build conversation messages
      const messages = [
        {
          role: 'system',
          content: 'You are ब्रह्मांड AI (Brahmand AI), a helpful and friendly cosmic assistant. You help users with their questions about technology, programming, web development, and general knowledge. Be concise, helpful, and engaging.'
        },
        ...conversationHistory.slice(-5).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API Error:', errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();

    } catch (error) {
      console.error('OpenAI Chat Error:', error);
      return `❌ Error: ${error.message}\n\nPlease check:\n1. Your API key is valid\n2. You have credits in your OpenAI account\n3. Your internet connection is working`;
    }
  }

  // Test OpenAI connection
  async testConnection() {
    if (!this.isConfigured()) {
      return { success: false, message: 'OpenAI API key not configured' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return { success: true, message: 'OpenAI API connected successfully!' };

    } catch (error) {
      console.error('OpenAI Test Error:', error);
      return { success: false, message: `Connection failed: ${error.message}` };
    }
  }
}

const openaiService = new OpenAIService();
export default openaiService;
