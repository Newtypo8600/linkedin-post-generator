// api/refine-post.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { post, instruction, language } = req.body;

    // Language instructions
    const languageMap = {
      en: "English",
      da: "Danish (Dansk)",
      sv: "Swedish (Svenska)",
      fi: "Finnish (Suomi)"
    };

    const systemPrompt = `You are a LinkedIn content refinement assistant for Newsec. 
    Your job is to modify existing LinkedIn posts based on user instructions while maintaining:
    - Newsec's professional brand voice
    - The original message's core meaning
    - Proper LinkedIn formatting
    - Engagement best practices
    - The ${languageMap[language] || 'English'} language (IMPORTANT: Always respond in ${languageMap[language] || 'English'})
    
    Common refinements include:
    - Making posts shorter/longer
    - Adding/removing hashtags
    - Changing tone (more formal/casual)
    - Adding emojis
    - Making more engaging
    - Adding statistics or data points
    - Improving call-to-action
    
    CRITICAL: The refined post MUST be in ${languageMap[language] || 'English'}, regardless of what language the instruction is in.
    Always preserve any HTML formatting tags in the post.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Current post: ${post}\n\nInstruction: ${instruction}\n\nRemember to keep the response in ${languageMap[language] || 'English'}.`
          }
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    const refinedPost = data.choices[0].message.content;
    
    res.status(200).json({
      success: true,
      refinedPost: refinedPost
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to refine post',
      message: error.message 
    });
  }
}
