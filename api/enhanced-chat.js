// Enhanced ResearchBot API with Real Functionality
// Free cloud-based research tools

const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_CONFIG, FREE_APIS } = require('../supabase-config');

// Initialize Supabase client
const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Enhanced chat endpoint with real functionality
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
        const { message, action, data, userId = 'demo-user' } = req.body;
        
        if (!message && !action) {
            return res.status(400).json({ error: 'Message or action is required' });
        }

        // Handle different actions
        if (action) {
            const result = await handleAction(action, data, userId);
            return res.json(result);
        }

        // Check if Groq API key is configured
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ 
                error: 'Groq API key not configured. Please set GROQ_API_KEY in your environment variables.' 
            });
        }

        // Enhanced AI response with real functionality
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama-3.1-8b-instant',
            messages: [
                {
                    role: 'system',
                    content: `You are ResearchBot, an AI-powered research assistant with REAL functionality. You can:

## Real Capabilities:
1. **Search Research Papers** - I can actually search arXiv, PubMed, and other free databases
2. **Manage Citations** - I can create, format, and organize citations
3. **Create Research Timelines** - I can build and track research milestones
4. **Take Notes** - I can create and organize research notes
5. **Analyze Papers** - I can summarize and analyze research papers

## Response Guidelines:
- Always format responses using **Markdown**
- Use headers (##, ###), bullet points, and **bold** text
- Provide actionable advice with specific steps
- When suggesting actions, mention that I can actually perform them
- Be encouraging and supportive while maintaining academic rigor

## Available Actions:
- "search papers [query]" - Search for research papers
- "create milestone [title]" - Create research milestone
- "add note [content]" - Add research note
- "format citation [text]" - Format citation
- "summarize paper [abstract]" - Summarize research paper

Structure your responses with clear headings and actionable steps.`
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
            timestamp: new Date().toISOString(),
            type: 'chat'
        });

    } catch (error) {
        console.error('Enhanced chat error:', error);
        res.status(500).json({ 
            error: 'Sorry, I encountered an error processing your request. Please try again.' 
        });
    }
};

// Handle different actions
async function handleAction(action, data, userId) {
    try {
        switch (action) {
            case 'search_papers':
                return await searchPapers(data.query, userId);
            
            case 'create_milestone':
                return await createMilestone(data, userId);
            
            case 'add_note':
                return await addNote(data, userId);
            
            case 'format_citation':
                return await formatCitation(data, userId);
            
            case 'get_papers':
                return await getPapers(userId);
            
            case 'get_milestones':
                return await getMilestones(userId);
            
            case 'get_notes':
                return await getNotes(userId);
            
            default:
                return { error: 'Unknown action' };
        }
    } catch (error) {
        console.error('Action error:', error);
        return { error: 'Action failed' };
    }
}

// Search papers using free APIs
async function searchPapers(query, userId) {
    try {
        // Search arXiv (free)
        const arxivResponse = await axios.get(FREE_APIS.arxiv, {
            params: {
                search_query: query,
                start: 0,
                max_results: 5,
                sortBy: 'relevance',
                sortOrder: 'descending'
            }
        });
        
        const papers = parseArxivResponse(arxivResponse.data);
        
        // Save papers to database
        for (const paper of papers) {
            await supabase
                .from('papers')
                .insert({
                    ...paper,
                    user_id: userId
                });
        }
        
        return {
            success: true,
            papers: papers,
            message: `Found ${papers.length} papers for "${query}"`
        };
    } catch (error) {
        console.error('Search papers error:', error);
        return { error: 'Failed to search papers' };
    }
}

// Parse arXiv response
function parseArxivResponse(xmlData) {
    const papers = [];
    const entries = xmlData.match(/<entry>[\s\S]*?<\/entry>/g) || [];
    
    entries.forEach(entry => {
        const title = extractXmlValue(entry, 'title');
        const authors = extractXmlValues(entry, 'author');
        const abstract = extractXmlValue(entry, 'summary');
        const published = extractXmlValue(entry, 'published');
        const id = extractXmlValue(entry, 'id');
        const arxivId = id ? id.split('/').pop() : null;
        
        if (title && authors.length > 0) {
            papers.push({
                title: title.replace(/\n/g, ' ').trim(),
                authors: authors.map(author => author.replace(/\n/g, ' ').trim()),
                abstract: abstract.replace(/\n/g, ' ').trim(),
                publication_date: published ? new Date(published).toISOString().split('T')[0] : null,
                arxiv_id: arxivId,
                source: 'arXiv',
                doi: null,
                journal: 'arXiv preprint'
            });
        }
    });
    
    return papers;
}

// Extract value from XML
function extractXmlValue(xml, tag) {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1].trim() : '';
}

// Extract multiple values from XML
function extractXmlValues(xml, tag) {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
    const matches = xml.match(regex) || [];
    return matches.map(match => {
        const value = match.replace(new RegExp(`<${tag}[^>]*>`, 'i'), '').replace(new RegExp(`<\\/${tag}>`, 'i'), '');
        return value.trim();
    });
}

// Create milestone
async function createMilestone(data, userId) {
    try {
        const { data: milestone, error } = await supabase
            .from('milestones')
            .insert({
                title: data.title,
                description: data.description || '',
                due_date: data.due_date || null,
                priority: data.priority || 'medium',
                user_id: userId
            })
            .select()
            .single();
        
        if (error) throw error;
        
        return {
            success: true,
            milestone: milestone,
            message: 'Milestone created successfully'
        };
    } catch (error) {
        console.error('Create milestone error:', error);
        return { error: 'Failed to create milestone' };
    }
}

// Add note
async function addNote(data, userId) {
    try {
        const { data: note, error } = await supabase
            .from('notes')
            .insert({
                title: data.title,
                content: data.content,
                paper_id: data.paper_id || null,
                tags: data.tags || [],
                user_id: userId
            })
            .select()
            .single();
        
        if (error) throw error;
        
        return {
            success: true,
            note: note,
            message: 'Note added successfully'
        };
    } catch (error) {
        console.error('Add note error:', error);
        return { error: 'Failed to add note' };
    }
}

// Format citation
async function formatCitation(data, userId) {
    try {
        const { data: citation, error } = await supabase
            .from('citations')
            .insert({
                paper_id: data.paper_id || null,
                citation_text: data.citation_text,
                citation_style: data.style || 'APA',
                formatted_citation: formatCitationText(data.citation_text, data.style || 'APA'),
                user_id: userId
            })
            .select()
            .single();
        
        if (error) throw error;
        
        return {
            success: true,
            citation: citation,
            message: 'Citation formatted and saved'
        };
    } catch (error) {
        console.error('Format citation error:', error);
        return { error: 'Failed to format citation' };
    }
}

// Format citation text
function formatCitationText(text, style) {
    switch (style) {
        case 'APA':
            return `(${text})`;
        case 'MLA':
            return `[${text}]`;
        case 'Chicago':
            return `¹${text}`;
        default:
            return text;
    }
}

// Get papers
async function getPapers(userId) {
    try {
        const { data: papers, error } = await supabase
            .from('papers')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return {
            success: true,
            papers: papers || []
        };
    } catch (error) {
        console.error('Get papers error:', error);
        return { error: 'Failed to get papers' };
    }
}

// Get milestones
async function getMilestones(userId) {
    try {
        const { data: milestones, error } = await supabase
            .from('milestones')
            .select('*')
            .eq('user_id', userId)
            .order('due_date', { ascending: true });
        
        if (error) throw error;
        
        return {
            success: true,
            milestones: milestones || []
        };
    } catch (error) {
        console.error('Get milestones error:', error);
        return { error: 'Failed to get milestones' };
    }
}

// Get notes
async function getNotes(userId) {
    try {
        const { data: notes, error } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return {
            success: true,
            notes: notes || []
        };
    } catch (error) {
        console.error('Get notes error:', error);
        return { error: 'Failed to get notes' };
    }
}
