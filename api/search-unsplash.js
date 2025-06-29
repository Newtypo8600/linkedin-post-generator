// api/search-unsplash.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query = 'office building', page = 1 } = req.body;
    
    // Use the environment variable you set in Vercel
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
    
    // Log for debugging (remove in production)
    console.log('Unsplash key exists:', !!UNSPLASH_ACCESS_KEY);
    console.log('Query:', query);
    
    if (!UNSPLASH_ACCESS_KEY) {
      console.error('Unsplash access key not configured');
      // Return mock data if no API key
      return res.status(200).json({
        success: true,
        results: getMockImages(query)
      });
    }

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&page=${page}&orientation=landscape`;
    console.log('Fetching from:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    // Log the response status
    console.log('Unsplash response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Unsplash API error:', response.status, errorText);
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the response to only include what we need
    const results = data.results.map(photo => ({
      id: photo.id,
      urls: {
        small: photo.urls.small,
        regular: photo.urls.regular
      },
      alt: photo.alt_description || photo.description || query
    }));

    console.log('Returning', results.length, 'results');
    
    res.status(200).json({
      success: true,
      results: results
    });

  } catch (error) {
    console.error('Unsplash search error:', error.message);
    
    // Return mock data on error instead of failing
    res.status(200).json({
      success: true,
      results: getMockImages(req.body.query || 'office building'),
      error: error.message // Include error for debugging
    });
  }
}

function getMockImages(query) {
  // Mock images for demo/fallback
  const baseImages = [
    { 
      id: '1',
      urls: { 
        small: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300', 
        regular: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800' 
      },
      alt: 'Modern office building'
    },
    { 
      id: '2',
      urls: { 
        small: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300', 
        regular: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800' 
      },
      alt: 'Office interior'
    },
    { 
      id: '3',
      urls: { 
        small: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=300', 
        regular: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800' 
      },
      alt: 'Team meeting'
    },
    { 
      id: '4',
      urls: { 
        small: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=300', 
        regular: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800' 
      },
      alt: 'Office workspace'
    },
    { 
      id: '5',
      urls: { 
        small: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=300', 
        regular: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800' 
      },
      alt: 'Modern architecture'
    },
    { 
      id: '6',
      urls: { 
        small: 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=300', 
        regular: 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=800' 
      },
      alt: 'Office building exterior'
    }
  ];
  
  // Simple filtering based on query
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('green') || lowerQuery.includes('sustain')) {
    return baseImages.slice(0, 3);
  } else if (lowerQuery.includes('team') || lowerQuery.includes('meeting')) {
    return baseImages.slice(2, 5);
  } else if (lowerQuery.includes('modern') || lowerQuery.includes('architect')) {
    return baseImages.slice(4, 6);
  }
  
  return baseImages;
}
