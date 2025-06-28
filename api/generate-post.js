export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content } = req.body;
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a LinkedIn post expert for Newsec, a leading real estate company in the Nordics. Create engaging LinkedIn posts that:
            - Start with an attention-grabbing hook
            - Are 1200-1500 characters
            - Include 3-5 relevant hashtags
            - End with a call-to-action question
            - Use professional but conversational tone
            - Include 1-2 relevant emojis
            - Focus on sustainability, innovation, and real estate excellence`
          },
          {
            role: 'user',
            content: `Transform this email content into a LinkedIn post: ${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    const generatedPost = data.choices[0].message.content;
    
    // Parse the post into sections
    const lines = generatedPost.split('\n').filter(line => line.trim());
    const hook = lines[0] || '';
    const hashtags = generatedPost.match(/#\w+/g)?.join(' ') || '#RealEstate #Newsec #Sustainability';
    
    res.status(200).json({
      success: true,
      post: {
        full: generatedPost,
        hook: hook,
        hashtags: hashtags,
        characterCount: generatedPost.length
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate post',
      message: error.message 
    });
  }
}
