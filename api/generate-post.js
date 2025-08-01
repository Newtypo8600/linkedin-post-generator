// api/generate-post.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content, language, postType, style, trainedPosts = [], formatting = false } = req.body;
    
    // Language prompts
    const languageInstructions = {
      en: "Write in English",
      da: "Write in Danish (Dansk)",
      sv: "Write in Swedish (Svenska)",
      fi: "Write in Finnish (Suomi)"
    };

    // Post type characteristics
    const postTypeInstructions = {
      instructive: "Create an educational post that teaches something valuable. Use bullet points or numbered lists for key takeaways.",
      inspirational: "Create an uplifting post that motivates and inspires. Include a personal story or anecdote if relevant.",
      announcement: "Create an announcement post that generates excitement. Lead with the news and explain why it matters.",
      "thought-leadership": "Create a thought-provoking post that positions Newsec as an industry leader. Include insights and future predictions.",
      "case-study": "Create a case study post that showcases success. Include specific metrics and results.",
      educational: "Create an educational post that teaches something valuable about real estate or sustainability.",
      inspirational: "Create an inspirational post that motivates and uplifts the audience."
    };

    // Style instructions
    let styleInstructions = {
      professional: "Use a formal, authoritative tone. Be concise and fact-driven.",
      conversational: "Use a friendly, approachable tone. Write as if talking to a colleague.",
      custom: "Match the writing style from the uploaded examples, maintaining consistent voice and structure."
    };

    // If custom style is selected and training posts are provided
    let customStylePrompt = '';
    if (style === 'custom' && trainedPosts.length > 0) {
      const examplePosts = trainedPosts.map(p => p.content).join('\n\n---\n\n');
      customStylePrompt = `\n\nHere are example posts to match the style of:\n\n${examplePosts}\n\n
      Analyze these posts and match their:
      - Tone and voice
      - Post structure and length
      - Use of emojis and formatting
      - Hashtag patterns
      - Opening and closing style
      - Line break patterns and paragraph structure`;
    }

    // Build the system prompt with formatting instructions
    const systemPrompt = `You are a LinkedIn content expert for Newsec, a leading real estate and energy transition company in the Nordic region. 
    
    ${languageInstructions[language]}
    ${postTypeInstructions[postType]}
    ${styleInstructions[style]}
    ${customStylePrompt}
    
    Guidelines for all posts:
    - Start with an attention-grabbing hook
    - Keep between 1200-1500 characters for optimal engagement
    - Include 3-5 relevant hashtags at the end
    - Use 1-3 emojis to increase engagement
    - End with a call-to-action question to encourage comments
    - Focus on Newsec's key themes: sustainability, innovation, real estate excellence, energy transition
    - Maintain Newsec's professional yet approachable brand voice
    
    IMPORTANT LinkedIn formatting best practices:
    - Use SHORT paragraphs (2-3 sentences max)
    - Add a blank line between paragraphs for readability
    - Use line breaks before and after lists
    - Hook should be on its own line
    - CTA question should be on its own line
    - Hashtags should be on the last line
    - Break up long sections with emojis or bullet points
    
    Format the post with proper line breaks for optimal readability on LinkedIn.`;

    // Call OpenAI API
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
            content: `Create a LinkedIn post based on this content: ${content}`
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

    const generatedPost = data.choices[0].message.content;
    
    res.status(200).json({
      success: true,
      post: {
        full: generatedPost,
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
