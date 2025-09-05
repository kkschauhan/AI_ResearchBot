// ResearchBot API with Real Functionality
// Free cloud-based research tools

const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_CONFIG, FREE_APIS, CITATION_STYLES } = require('../supabase-config');

// Initialize Supabase client
const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.serviceKey);

// Free research paper search using arXiv API
async function searchArxivPapers(query, maxResults = 10) {
  try {
    const response = await axios.get(FREE_APIS.arxiv, {
      params: {
        search_query: query,
        start: 0,
        max_results: maxResults,
        sortBy: 'relevance',
        sortOrder: 'descending'
      }
    });
    
    const papers = parseArxivResponse(response.data);
    return papers;
  } catch (error) {
    console.error('Error searching arXiv:', error);
    return [];
  }
}

// Parse arXiv XML response
function parseArxivResponse(xmlData) {
  // Simple XML parsing (in production, use a proper XML parser)
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

// Save paper to database
async function savePaper(paper, userId) {
  try {
    const { data, error } = await supabase
      .from('papers')
      .insert({
        ...paper,
        user_id: userId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving paper:', error);
    throw error;
  }
}

// Get user's papers
async function getUserPapers(userId, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('papers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching papers:', error);
    return [];
  }
}

// Create citation
async function createCitation(paperId, citationText, style = 'APA', userId) {
  try {
    const { data, error } = await supabase
      .from('citations')
      .insert({
        paper_id: paperId,
        citation_text: citationText,
        citation_style: style,
        formatted_citation: formatCitation(citationText, style),
        user_id: userId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating citation:', error);
    throw error;
  }
}

// Format citation (simple implementation)
function formatCitation(citationText, style) {
  // This is a simplified formatter
  // In production, use a proper citation formatting library
  switch (style) {
    case 'APA':
      return `(${citationText})`;
    case 'MLA':
      return `[${citationText}]`;
    case 'Chicago':
      return `¹${citationText}`;
    default:
      return citationText;
  }
}

// Create milestone
async function createMilestone(milestone, userId) {
  try {
    const { data, error } = await supabase
      .from('milestones')
      .insert({
        ...milestone,
        user_id: userId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }
}

// Get user's milestones
async function getUserMilestones(userId) {
  try {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return [];
  }
}

// Create note
async function createNote(note, userId) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert({
        ...note,
        user_id: userId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
}

// Get user's notes
async function getUserNotes(userId, paperId = null) {
  try {
    let query = supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (paperId) {
      query = query.eq('paper_id', paperId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
}

// AI-powered paper summarization using Groq
async function summarizePaper(abstract, title) {
  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are a research assistant. Summarize research papers in 2-3 sentences, highlighting key findings and methodology.'
        },
        {
          role: 'user',
          content: `Title: ${title}\n\nAbstract: ${abstract}\n\nProvide a concise summary:`
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error summarizing paper:', error);
    return 'Summary not available';
  }
}

// Search papers in database
async function searchUserPapers(userId, query) {
  try {
    const { data, error } = await supabase
      .from('papers')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,abstract.ilike.%${query}%,keywords.cs.{${query}}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching papers:', error);
    return [];
  }
}

module.exports = {
  searchArxivPapers,
  savePaper,
  getUserPapers,
  createCitation,
  createMilestone,
  getUserMilestones,
  createNote,
  getUserNotes,
  summarizePaper,
  searchUserPapers
};
