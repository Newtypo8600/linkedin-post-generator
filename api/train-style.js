// api/train-style.js
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({ multiples: true });
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const uploadedFiles = Array.isArray(files.posts) ? files.posts : [files.posts];
    const extractedPosts = [];

    // Extract text from uploaded files
    for (const file of uploadedFiles) {
      if (file) {
        const content = await fs.readFile(file.filepath, 'utf-8');
        extractedPosts.push(content);
      }
    }

    if (extractedPosts.length < 5) {
      return res.status(400).json({ 
        error: 'Please upload at least 5 posts for effective style training' 
      });
    }

    // Analyze writing style
    const styleAnalysis = await analyzeWritingStyle(extractedPosts);
    
    // Store style profile (in production, this would be saved to a database)
    const styleId = generateStyleId();
    
    // For now, we'll return the analysis to be stored client-side
    res.status(200).json({
      success: true,
      styleId: styleId,
      styleProfile: styleAnalysis,
      postsAnalyzed: extractedPosts.length
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to process style training',
      message: error.message 
    });
  }
}

async function analyzeWritingStyle(posts) {
  const joinedPosts = posts.join('\n\n---\n\n');
  
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
          content: `Analyze the writing style of these LinkedIn posts and create a detailed style profile. Focus on:
          
          1. Tone and voice characteristics
          2. Common opening patterns
          3. Typical post structure
          4. Use of emojis and hashtags
          5. Average post length
          6. Common themes and topics
          7. Call-to-action patterns
          8. Language complexity and vocabulary
          9. Punctuation and formatting preferences
          10. Unique phrases or expressions
          
          Return a comprehensive style guide that can be used to replicate this writing style.`
        },
        {
          role: 'user',
          content: `Analyze these LinkedIn posts:\n\n${joinedPosts}`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'OpenAI API error');
  }

  return data.choices[0].message.content;
}

function generateStyleId() {
  return 'style_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
