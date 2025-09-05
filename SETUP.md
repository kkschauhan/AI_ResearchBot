# ResearchBot Setup Guide - 100% Free World-Class Research Platform

## 🆓 **Completely Free Setup (No Paid Services Required)**

### **Step 1: Set up Free Supabase Database (5 minutes)**

1. **Create Supabase Account:**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for free account
   - Create new project

2. **Set up Database:**
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `supabase-setup.sql`
   - Run the SQL script to create tables

3. **Get API Keys:**
   - Go to Settings > API
   - Copy your Project URL and anon key
   - Copy your service key (for server-side operations)

### **Step 2: Get Free Groq API Key (2 minutes)**

1. **Create Groq Account:**
   - Go to [console.groq.com](https://console.groq.com)
   - Sign up for free account
   - Get your API key from the dashboard

### **Step 3: Configure Environment Variables**

1. **Copy environment file:**
   ```bash
   cp env.example .env
   ```

2. **Fill in your keys:**
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   ```

### **Step 4: Install Dependencies**

```bash
npm install
```

### **Step 5: Deploy to Vercel (5 minutes)**

1. **Connect to GitHub:**
   - Push your code to GitHub
   - Connect repository to Vercel

2. **Add Environment Variables:**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add all the variables from your .env file

3. **Deploy:**
   - Vercel will automatically deploy
   - Your ResearchBot will be live!

## 🚀 **What You Get - 100% Free:**

### **Real Research Tools:**
- ✅ **PDF Upload & Processing** (Supabase Storage - 1GB free)
- ✅ **Research Paper Search** (arXiv, PubMed, OpenAlex APIs - all free)
- ✅ **Citation Management** (PostgreSQL database - 500MB free)
- ✅ **Research Timeline** (Interactive charts - free)
- ✅ **Note-taking System** (Rich text editor - free)
- ✅ **AI Summarization** (Groq API - free tier)
- ✅ **User Authentication** (Supabase Auth - free)
- ✅ **Real-time Collaboration** (Supabase Realtime - free)

### **Free Limits (More than enough for most users):**
- **Supabase**: 500MB database + 1GB file storage
- **Groq API**: 14,400 requests/day (free tier)
- **Vercel**: 100GB bandwidth/month (free tier)
- **All APIs**: Completely free

## 💰 **Total Cost: $0**

No paid services, no subscriptions, no hidden costs!

## 🎯 **Features Overview:**

### **1. Literature Management:**
- Search and save research papers
- AI-powered paper summarization
- Citation formatting and management
- Paper organization and tagging

### **2. Research Planning:**
- Interactive timeline creation
- Milestone tracking
- Progress monitoring
- Goal setting

### **3. Writing Assistance:**
- Rich text note-taking
- Citation integration
- Research note organization
- Collaborative editing

### **4. AI-Powered Features:**
- Smart paper search
- Automatic summarization
- Research gap analysis
- Writing suggestions

## 🔧 **Troubleshooting:**

### **Common Issues:**
1. **Supabase connection error**: Check your API keys
2. **Groq API error**: Verify your API key
3. **Database errors**: Make sure you ran the SQL setup script

### **Support:**
- Check the GitHub issues page
- Review the Supabase documentation
- Check Groq API documentation

## 🎉 **You're Ready!**

Your ResearchBot is now a **world-class research platform** with real functionality, completely free!

**Next Steps:**
1. Upload some research papers
2. Create your research timeline
3. Start taking notes
4. Search for relevant papers
5. Manage your citations

**Happy Researching!** 🚀
