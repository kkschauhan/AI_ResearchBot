const axios = require('axios');

// Chat endpoint for Vercel serverless function
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Check if Groq API key is configured
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ 
                error: 'Groq API key not configured. Please set GROQ_API_KEY in your environment variables.' 
            });
        }

        // Call Groq API
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama-3.1-8b-instant',
            messages: [
                {
                    role: 'system',
                    content: `You are ResearchBot, an AI-powered research assistant specifically designed for PhD students and academic researchers. Your role is to help with:

1. Literature Management: Finding relevant papers, summarizing research, extracting key concepts
2. Writing Assistance: Academic writing, thesis help, paper drafting, grammar checking
3. Research Planning: Timeline management, task organization, methodology guidance
4. Collaboration: Team communication, knowledge sharing, peer review support

Always provide accurate, well-researched information and cite sources when possible. Be encouraging and supportive while maintaining academic rigor.`
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 1000,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const aiResponse = response.data.choices[0].message.content;
        
        res.json({ 
            response: aiResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ 
            error: 'Sorry, I encountered an error processing your request. Please try again.' 
        });
    }
};