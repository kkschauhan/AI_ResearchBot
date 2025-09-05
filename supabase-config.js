// Supabase Configuration for ResearchBot
// Replace these with your actual Supabase project credentials

const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL', // Get from Supabase dashboard
  anonKey: 'YOUR_SUPABASE_ANON_KEY', // Get from Supabase dashboard
  serviceKey: 'YOUR_SUPABASE_SERVICE_KEY' // Get from Supabase dashboard (for server-side)
};

// Free API endpoints for research papers
const FREE_APIS = {
  arxiv: 'http://export.arxiv.org/api/query',
  pubmed: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/',
  openalex: 'https://api.openalex.org/works',
  crossref: 'https://api.crossref.org/works'
};

// Citation formatting styles
const CITATION_STYLES = {
  APA: 'apa',
  MLA: 'mla',
  Chicago: 'chicago',
  Harvard: 'harvard',
  IEEE: 'ieee'
};

// Research paper categories
const PAPER_CATEGORIES = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Biology',
  'Chemistry',
  'Medicine',
  'Engineering',
  'Psychology',
  'Economics',
  'Other'
];

// Priority levels for milestones
const PRIORITY_LEVELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent'
};

// Project status options
const PROJECT_STATUS = {
  planning: 'Planning',
  active: 'Active',
  on_hold: 'On Hold',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

module.exports = {
  SUPABASE_CONFIG,
  FREE_APIS,
  CITATION_STYLES,
  PAPER_CATEGORIES,
  PRIORITY_LEVELS,
  PROJECT_STATUS
};
