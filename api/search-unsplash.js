// api/search-unsplash.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query = 'office building' } = req.body;
    
    // For now, let's use enhanced mock data that responds to searches
    // This will work immediately while we debug the Unsplash API
    
    const allImages = [
      // Office/Building images
      { 
        id: '1',
        urls: { 
          small: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300', 
          regular: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800' 
        },
        alt: 'Modern glass office building',
        tags: ['office', 'building', 'modern', 'glass', 'architecture']
      },
      { 
        id: '2',
        urls: { 
          small: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300', 
          regular: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800' 
        },
        alt: 'Contemporary office interior',
        tags: ['office', 'interior', 'modern', 'workspace']
      },
      // Team/Meeting images
      { 
        id: '3',
        urls: { 
          small: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=300', 
          regular: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800' 
        },
        alt: 'Business team meeting',
        tags: ['team', 'meeting', 'collaboration', 'people']
      },
      { 
        id: '4',
        urls: { 
          small: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=300', 
          regular: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800' 
        },
        alt: 'Open office workspace',
        tags: ['office', 'workspace', 'open', 'modern']
      },
      // Architecture images
      { 
        id: '5',
        urls: { 
          small: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=300', 
          regular: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800' 
        },
        alt: 'Modern architecture exterior',
        tags: ['architecture', 'modern', 'building', 'exterior']
      },
      { 
        id: '6',
        urls: { 
          small: 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=300', 
          regular: 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=800' 
        },
        alt: 'Office building at dusk',
        tags: ['office', 'building', 'evening', 'architecture']
      },
      // Sustainability/Green images
      { 
        id: '7',
        urls: { 
          small: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=300', 
          regular: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800' 
        },
        alt: 'Sustainable green building',
        tags: ['sustainable', 'green', 'eco', 'building']
      },
      { 
        id: '8',
        urls: { 
          small: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=300', 
          regular: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800' 
        },
        alt: 'Modern home with solar panels',
        tags: ['sustainable', 'solar', 'green', 'energy']
      },
      // City/Urban images
      { 
        id: '9',
        urls: { 
          small: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300', 
          regular: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800' 
        },
        alt: 'City skyline',
        tags: ['city', 'skyline', 'urban', 'buildings']
      },
      { 
        id: '10',
        urls: { 
          small: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=300', 
          regular: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800' 
        },
        alt: 'Modern urban development',
        tags: ['urban', 'development', 'city', 'modern']
      },
      // Innovation/Tech images
      { 
        id: '11',
        urls: { 
          small: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300', 
          regular: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800' 
        },
        alt: 'Technology and innovation',
        tags: ['technology', 'innovation', 'digital', 'future']
      },
      { 
        id: '12',
        urls: { 
          small: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300', 
          regular: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800' 
        },
        alt: 'Competitive business environment',
        tags: ['business', 'competition', 'success', 'growth']
      }
    ];
    
    // Smart filtering based on search query
    const searchTerms = query.toLowerCase().split(' ');
    
    let filteredImages = allImages.filter(image => {
      const searchableText = `${image.alt} ${image.tags.join(' ')}`.toLowerCase();
      return searchTerms.some(term => searchableText.includes(term));
    });
    
    // If no matches, return some default images
    if (filteredImages.length === 0) {
      filteredImages = allImages.slice(0, 6);
    }
    
    // Limit to 12 results
    const results = filteredImages.slice(0, 12);
    
    res.status(200).json({
      success: true,
      results: results
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to search images',
      message: error.message 
    });
  }
}
