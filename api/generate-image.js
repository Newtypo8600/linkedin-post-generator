// api/generate-image.js
import sharp from 'sharp';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, n = 1 } = req.body;

    // Enhance prompt with Newsec brand guidelines
    const enhancedPrompt = `${prompt}, professional photography, modern Nordic architecture style, 
    clean minimalist design, blue color palette (#0047AB Newsec blue), bright natural lighting, 
    sustainable building features, Scandinavian aesthetic, high-end commercial real estate`;

    // Call DALL-E API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1, // DALL-E 3 only supports n=1
        size: '1024x1024',
        quality: 'hd',
        style: 'natural'
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'DALL-E API error');
    }

    // For multiple images, we'll generate them sequentially
    const images = [];
    
    for (let i = 0; i < Math.min(n, 4); i++) {
      if (i > 0) {
        // Generate additional variations
        const varResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: enhancedPrompt + ` variation ${i + 1}`,
            n: 1,
            size: '1024x1024',
            quality: 'hd',
            style: 'natural'
          })
        });
        
        const varData = await varResponse.json();
        if (varData.data && varData.data[0]) {
          images.push(await addNewsecBranding(varData.data[0].url));
        }
      } else {
        images.push(await addNewsecBranding(data.data[0].url));
      }
    }

    res.status(200).json({
      success: true,
      images: images
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate images',
      message: error.message 
    });
  }
}

// Add Newsec logo watermark to generated images
async function addNewsecBranding(imageUrl) {
  try {
    // Fetch the generated image
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();
    
    // Create Newsec logo SVG
    const logoSvg = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="100" height="100" fill="#0047AB" rx="10"/>
        <text x="50" y="65" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">N</text>
      </svg>
    `;
    
    // Add logo as watermark using sharp
    const logoBuffer = Buffer.from(logoSvg);
    
    const processedImage = await sharp(imageBuffer)
      .composite([
        {
          input: logoBuffer,
          top: 20,
          left: 20,
          blend: 'over'
        }
      ])
      .toBuffer();
    
    // Convert to base64 for direct use
    const base64Image = `data:image/png;base64,${processedImage.toString('base64')}`;
    
    return base64Image;
    
  } catch (error) {
    console.error('Error adding branding:', error);
    // Return original URL if processing fails
    return imageUrl;
  }
}
