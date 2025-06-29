// api/parse-linkedin.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    
    if (!url || !url.includes('linkedin.com')) {
      return res.status(400).json({ 
        error: 'Invalid LinkedIn URL' 
      });
    }

    // Note: Direct LinkedIn scraping is challenging due to their anti-bot measures
    // In production, you might want to use:
    // 1. LinkedIn API (requires OAuth and user permissions)
    // 2. A service like Bright Data or ScrapingBee
    // 3. Puppeteer with stealth plugins
    
    // For now, we'll try a simple fetch and parse approach
    // This might not work reliably due to LinkedIn's protections
    
    try {
      // Attempt to fetch the page
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn page');
      }

      const html = await response.text();
      
      // Try to extract post content using various patterns
      // LinkedIn's HTML structure changes frequently
      let postContent = '';
      
      // Pattern 1: Look for post content in meta tags
      const ogDescMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
      if (ogDescMatch) {
        postContent = ogDescMatch[1];
      }
      
      // Pattern 2: Look for structured data
      const structuredDataMatch = html.match(/<script\s+type="application\/ld\+json">([^<]+)<\/script>/i);
      if (structuredDataMatch && !postContent) {
        try {
          const data = JSON.parse(structuredDataMatch[1]);
          if (data.description) {
            postContent = data.description;
          }
        } catch (e) {
          // Invalid JSON
        }
      }
      
      // Pattern 3: Look for specific LinkedIn content patterns
      const contentPatterns = [
        /<div[^>]*class="[^"]*feed-shared-text[^"]*"[^>]*>([^<]+)</i,
        /<span[^>]*class="[^"]*break-words[^"]*"[^>]*>([^<]+)</i,
        /<div[^>]*data-test-id="main-feed-activity-content"[^>]*>([^<]+)</i
      ];
      
      for (const pattern of contentPatterns) {
        const match = html.match(pattern);
        if (match && !postContent) {
          postContent = match[1];
          break;
        }
      }
      
      // Clean up the extracted content
      if (postContent) {
        postContent = postContent
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&#x27;/g, "'")
          .replace(/\s+/g, ' ')
          .trim();
        
        // If content is too short, it might be truncated
        if (postContent.length < 50) {
          throw new Error('Extracted content seems incomplete');
        }
        
        return res.status(200).json({
          success: true,
          postContent: postContent,
          source: url
        });
      } else {
        throw new Error('Could not extract post content');
      }
      
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      
      // Fallback: Provide instructions for manual extraction
      return res.status(200).json({
        success: false,
        error: 'Could not automatically extract post content',
        instructions: 'Please copy the post text manually from LinkedIn',
        alternativeMethod: true
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to parse LinkedIn post',
      message: error.message,
      instructions: 'Please use the text input method instead'
    });
  }
}

// Helper function to extract content from LinkedIn's JSON-LD data
function extractFromJsonLd(html) {
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/s);
  if (jsonLdMatch) {
    try {
      const data = JSON.parse(jsonLdMatch[1]);
      
      // LinkedIn sometimes puts post content in articleBody or description
      if (data.articleBody) return data.articleBody;
      if (data.description) return data.description;
      
      // Check for nested structures
      if (data['@graph']) {
        for (const item of data['@graph']) {
          if (item.articleBody) return item.articleBody;
          if (item.description) return item.description;
        }
      }
    } catch (e) {
      console.error('JSON-LD parse error:', e);
    }
  }
  return null;
}
