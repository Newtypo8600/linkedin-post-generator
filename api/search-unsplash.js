// api/search-unsplash.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query = 'office building' } = req.body;
    
    // Comprehensive image library with diverse options
    const allImages = [
      // Modern Office Buildings
      { 
        id: '1',
        urls: { 
          small: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300', 
          regular: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800' 
        },
        alt: 'Modern glass office building',
        tags: ['office', 'building', 'modern', 'glass', 'architecture', 'corporate']
      },
      { 
        id: '2',
        urls: { 
          small: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300', 
          regular: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800' 
        },
        alt: 'Modern minimalist house',
        tags: ['modern', 'house', 'minimalist', 'architecture', 'residential']
      },
      { 
        id: '3',
        urls: { 
          small: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300', 
          regular: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800' 
        },
        alt: 'Corporate office complex',
        tags: ['office', 'corporate', 'building', 'business', 'commercial']
      },
      
      // Office Interiors
      { 
        id: '4',
        urls: { 
          small: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300', 
          regular: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800' 
        },
        alt: 'Contemporary office interior',
        tags: ['office', 'interior', 'modern', 'workspace', 'design']
      },
      { 
        id: '5',
        urls: { 
          small: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300', 
          regular: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800' 
        },
        alt: 'Modern office lounge',
        tags: ['office', 'lounge', 'interior', 'modern', 'furniture']
      },
      { 
        id: '6',
        urls: { 
          small: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=300', 
          regular: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800' 
        },
        alt: 'Open office workspace',
        tags: ['office', 'workspace', 'open', 'modern', 'collaborative']
      },
      
      // Team & Collaboration
      { 
        id: '7',
        urls: { 
          small: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=300', 
          regular: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800' 
        },
        alt: 'Business team meeting',
        tags: ['team', 'meeting', 'collaboration', 'people', 'business']
      },
      { 
        id: '8',
        urls: { 
          small: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300', 
          regular: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800' 
        },
        alt: 'Team collaboration',
        tags: ['team', 'collaboration', 'startup', 'people', 'working']
      },
      { 
        id: '9',
        urls: { 
          small: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300', 
          regular: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800' 
        },
        alt: 'Remote team meeting',
        tags: ['team', 'remote', 'meeting', 'video', 'collaboration']
      },
      
      // Sustainability & Green
      { 
        id: '10',
        urls: { 
          small: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=300', 
          regular: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800' 
        },
        alt: 'Sustainable green building',
        tags: ['sustainable', 'green', 'eco', 'building', 'environment']
      },
      { 
        id: '11',
        urls: { 
          small: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=300', 
          regular: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800' 
        },
        alt: 'Modern home with solar panels',
        tags: ['sustainable', 'solar', 'green', 'energy', 'eco']
      },
      { 
        id: '12',
        urls: { 
          small: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300', 
          regular: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800' 
        },
        alt: 'Sustainable modern house',
        tags: ['sustainable', 'house', 'modern', 'green', 'residential']
      },
      
      // City & Urban
      { 
        id: '13',
        urls: { 
          small: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300', 
          regular: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800' 
        },
        alt: 'City skyline at sunset',
        tags: ['city', 'skyline', 'urban', 'buildings', 'sunset']
      },
      { 
        id: '14',
        urls: { 
          small: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=300', 
          regular: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800' 
        },
        alt: 'Modern urban development',
        tags: ['urban', 'development', 'city', 'modern', 'buildings']
      },
      { 
        id: '15',
        urls: { 
          small: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=300', 
          regular: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800' 
        },
        alt: 'City buildings at night',
        tags: ['city', 'night', 'buildings', 'urban', 'lights']
      },
      
      // Innovation & Technology
      { 
        id: '16',
        urls: { 
          small: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300', 
          regular: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800' 
        },
        alt: 'Technology and innovation',
        tags: ['technology', 'innovation', 'digital', 'future', 'tech']
      },
      { 
        id: '17',
        urls: { 
          small: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300', 
          regular: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800' 
        },
        alt: 'Competitive business environment',
        tags: ['business', 'competition', 'success', 'growth', 'corporate']
      },
      { 
        id: '18',
        urls: { 
          small: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300', 
          regular: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800' 
        },
        alt: 'Digital innovation workspace',
        tags: ['innovation', 'digital', 'workspace', 'technology', 'modern']
      },
      
      // Architecture & Design
      { 
        id: '19',
        urls: { 
          small: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=300', 
          regular: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800' 
        },
        alt: 'Modern architecture exterior',
        tags: ['architecture', 'modern', 'building', 'exterior', 'design']
      },
      { 
        id: '20',
        urls: { 
          small: 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=300', 
          regular: 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=800' 
        },
        alt: 'Office building at dusk',
        tags: ['office', 'building', 'evening', 'architecture', 'dusk']
      },
      { 
        id: '21',
        urls: { 
          small: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=300', 
          regular: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800' 
        },
        alt: 'Architectural details',
        tags: ['architecture', 'details', 'building', 'design', 'modern']
      },
      
      // Real Estate & Property
      { 
        id: '22',
        urls: { 
          small: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300', 
          regular: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800' 
        },
        alt: 'Real estate property',
        tags: ['real estate', 'property', 'house', 'residential', 'home']
      },
      { 
        id: '23',
        urls: { 
          small: 'https://images.unsplash.com/photo-1565402170291-8491f14678db?w=300', 
          regular: 'https://images.unsplash.com/photo-1565402170291-8491f14678db?w=800' 
        },
        alt: 'Commercial real estate',
        tags: ['commercial', 'real estate', 'building', 'property', 'business']
      },
      { 
        id: '24',
        urls: { 
          small: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=300', 
          regular: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800' 
        },
        alt: 'Property investment',
        tags: ['property', 'investment', 'real estate', 'finance', 'business']
      }
    ];
    
    // Smart filtering based on search query
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    // Score each image based on relevance
    const scoredImages = allImages.map(image => {
      const searchableText = `${image.alt} ${image.tags.join(' ')}`.toLowerCase();
      let score = 0;
      
      searchTerms.forEach(term => {
        if (searchableText.includes(term)) {
          score += 2; // Exact match
        } else if (searchableText.includes(term.substring(0, 3))) {
          score += 1; // Partial match
        }
      });
      
      return { ...image, score };
    });
    
    // Sort by relevance and filter out zero scores
    let results = scoredImages
      .filter(img => img.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ score, ...image }) => image);
    
    // If no matches, show varied default images
    if (results.length === 0) {
      // Show a diverse selection
      results = [
        allImages[0],  // Modern office
        allImages[7],  // Team meeting
        allImages[10], // Sustainable
        allImages[13], // City skyline
        allImages[16], // Innovation
        allImages[19], // Architecture
      ];
    }
    
    // Ensure we don't show the same 4 thumbnail images
    // Filter out the default thumbnail IDs if there are other options
    const thumbnailIds = ['1', '4', '6', '7'];
    if (results.length > 6) {
      const nonThumbnails = results.filter(img => !thumbnailIds.includes(img.id));
      if (nonThumbnails.length >= 6) {
        results = nonThumbnails;
      }
    }
    
    // Limit to 12 results
    results = results.slice(0, 12);
    
    res.status(200).json({
      success: true,
      results: results,
      query: query // For debugging
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
