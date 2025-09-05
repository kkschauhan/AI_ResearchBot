-- ResearchBot Database Schema (Free Supabase)
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Papers table
CREATE TABLE papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT[],
  abstract TEXT,
  doi TEXT,
  arxiv_id TEXT,
  pdf_url TEXT,
  summary TEXT,
  keywords TEXT[],
  publication_date DATE,
  journal TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Citations table
CREATE TABLE citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID REFERENCES papers(id) ON DELETE CASCADE,
  citation_text TEXT NOT NULL,
  citation_style TEXT DEFAULT 'APA',
  formatted_citation TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  paper_id UUID REFERENCES papers(id) ON DELETE SET NULL,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Research timeline milestones
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Research projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Link papers to projects
CREATE TABLE project_papers (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  paper_id UUID REFERENCES papers(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, paper_id)
);

-- Create indexes for better performance
CREATE INDEX idx_papers_user_id ON papers(user_id);
CREATE INDEX idx_papers_title ON papers USING gin(to_tsvector('english', title));
CREATE INDEX idx_papers_abstract ON papers USING gin(to_tsvector('english', abstract));
CREATE INDEX idx_papers_keywords ON papers USING gin(keywords);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_paper_id ON notes(paper_id);
CREATE INDEX idx_citations_user_id ON citations(user_id);
CREATE INDEX idx_milestones_user_id ON milestones(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);

-- Enable Row Level Security
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_papers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can only see their own data)
CREATE POLICY "Users can view own papers" ON papers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own papers" ON papers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own papers" ON papers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own papers" ON papers FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own citations" ON citations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own citations" ON citations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own citations" ON citations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own citations" ON citations FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notes" ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON notes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own milestones" ON milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own milestones" ON milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own milestones" ON milestones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own milestones" ON milestones FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own project_papers" ON project_papers FOR SELECT USING (auth.uid() IN (SELECT user_id FROM projects WHERE id = project_id));
CREATE POLICY "Users can insert own project_papers" ON project_papers FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM projects WHERE id = project_id));
CREATE POLICY "Users can delete own project_papers" ON project_papers FOR DELETE USING (auth.uid() IN (SELECT user_id FROM projects WHERE id = project_id));
