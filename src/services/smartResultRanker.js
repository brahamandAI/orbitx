// Smart Result Ranker - Premium Results WITHOUT API Keys!
// Improves search result quality using intelligent ranking
import { getAllWebsites } from './megaWebsiteDatabase';

class SmartResultRanker {
  constructor() {
    // Popular websites database for exact matching - 500+ WEBSITES!
    // Load ALL websites from mega database
    this.popularSites = getAllWebsites();
    
    console.log(`🌐 Smart Ranker loaded ${Object.keys(this.popularSites).length} websites!`);
    
    // Top-level domains ranking (higher = better)
    this.domainQuality = {
      '.com': 100,
      '.co': 95, // ⭐ High priority for your .co sites
      '.co.in': 95, // ⭐ High priority for .co.in sites
      '.org': 90,
      '.edu': 95,
      '.gov': 95,
      '.io': 85,
      '.net': 80,
      '.in': 85 // ⭐ India domains higher priority
    };
  }

  // Main ranking function
  rankResults(results, query) {
    console.log('🎯 Smart Ranking: Processing', results.length, 'results for:', query);
    
    // Step 1: Check if query is a website name
    const exactMatch = this.getExactWebsiteMatch(query);
    if (exactMatch) {
      console.log('✅ Exact website match found:', exactMatch.name);
      // Add official site as first result if not already present
      const hasExactMatch = results.some(r => this.normalizeUrl(r.url) === this.normalizeUrl(exactMatch.url));
      if (!hasExactMatch) {
        results.unshift({
          title: `${exactMatch.name} - Official Site`,
          url: exactMatch.url,
          description: exactMatch.description || `Official website of ${exactMatch.name}`,
          type: 'official',
          score: 1000,
          official: true
        });
      }
    }

    // Step 2: Score each result
    const scoredResults = results.map(result => ({
      ...result,
      score: this.calculateScore(result, query)
    }));

    // Step 3: Sort by score (highest first)
    scoredResults.sort((a, b) => b.score - a.score);

    console.log('✅ Smart Ranking: Top 3 results:', scoredResults.slice(0, 3).map(r => ({
      title: r.title,
      url: r.url,
      score: r.score
    })));

    return scoredResults;
  }

  // Calculate relevance score for a result
  calculateScore(result, query) {
    let score = 0;
    const url = this.normalizeUrl(result.url);
    const title = (result.title || '').toLowerCase();
    const description = (result.description || '').toLowerCase();
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/);

    // 1. Exact domain match = HIGHEST priority (500 points)
    if (url.includes(queryLower.replace(/\s+/g, ''))) {
      score += 500;
      console.log('  📌 Exact domain match:', result.url, '+500');
    }

    // 2. Query in URL = HIGH priority (300 points)
    queryWords.forEach(word => {
      if (word.length > 2 && url.includes(word)) {
        score += 100;
      }
    });

    // 3. Query in title = HIGH priority (200 points)
    if (title.includes(queryLower)) {
      score += 200;
      console.log('  📌 Query in title:', result.title, '+200');
    }

    // 4. Query words in title (50 points each)
    queryWords.forEach(word => {
      if (word.length > 2 && title.includes(word)) {
        score += 50;
      }
    });

    // 5. Query in description (50 points)
    if (description.includes(queryLower)) {
      score += 50;
    }

    // 6. Domain quality (0-100 points)
    Object.entries(this.domainQuality).forEach(([tld, points]) => {
      if (url.endsWith(tld)) {
        score += points;
        console.log('  📌 Quality domain:', tld, '+' + points);
      }
    });

    // 7. Official/verified site (200 points)
    if (result.official || result.type === 'official' || result.verified) {
      score += 200;
      console.log('  📌 Official site:', '+200');
    }

    // 8. HTTPS (10 points)
    if (url.startsWith('https://')) {
      score += 10;
    }

    // 9. Short, clean URL (50 points)
    if (url.split('/').length <= 4) {
      score += 50;
    }

    // 10. Penalize very long URLs (-20 points)
    if (url.length > 100) {
      score -= 20;
    }

    // 11. Popular site bonus
    const siteName = this.extractSiteName(url);
    if (this.popularSites[siteName]) {
      score += 150;
      console.log('  📌 Popular site:', siteName, '+150');
    }

    return Math.max(0, score); // Never negative
  }

  // Check if query matches a popular website
  getExactWebsiteMatch(query) {
    const queryNorm = query.toLowerCase().trim().replace(/\s+/g, '');
    
    // Direct match
    if (this.popularSites[queryNorm]) {
      return this.popularSites[queryNorm];
    }

    // Partial match (e.g., "face" for "facebook")
    for (const [key, site] of Object.entries(this.popularSites)) {
      if (key.startsWith(queryNorm) && queryNorm.length >= 4) {
        return site;
      }
    }

    // If query is just a single word and looks like a website name
    if (queryNorm.match(/^[a-z]{3,}$/)) {
      // Assume it's looking for sitename.com
      return {
        url: `https://www.${queryNorm}.com`,
        name: queryNorm.charAt(0).toUpperCase() + queryNorm.slice(1)
      };
    }

    return null;
  }

  // Normalize URL for comparison
  normalizeUrl(url) {
    if (!url) return '';
    return url.toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');
  }

  // Extract site name from URL
  extractSiteName(url) {
    try {
      const normalized = this.normalizeUrl(url);
      const parts = normalized.split('/')[0].split('.');
      
      // Return the main domain name
      if (parts.length >= 2) {
        return parts[parts.length - 2]; // e.g., "facebook" from "facebook.com"
      }
      return parts[0];
    } catch {
      return '';
    }
  }

  // Remove duplicate results
  deduplicateResults(results) {
    const seen = new Set();
    return results.filter(result => {
      const normalized = this.normalizeUrl(result.url);
      if (seen.has(normalized)) {
        return false;
      }
      seen.add(normalized);
      return true;
    });
  }

  // Main entry point
  improveResults(results, query) {
    console.log('🚀 Smart Result Ranker: Improving', results.length, 'results');
    
    // Remove duplicates
    let unique = this.deduplicateResults(results);
    console.log('✅ After deduplication:', unique.length, 'results');
    
    // Rank by relevance
    let ranked = this.rankResults(unique, query);
    console.log('✅ After ranking:', ranked.length, 'results');
    
    return ranked;
  }
}

const smartResultRanker = new SmartResultRanker();
export default smartResultRanker;
