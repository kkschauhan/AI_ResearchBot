# ResearchBot Deployment Guide - Vercel + Supabase

## 🚀 **Quick Deployment (10 minutes)**

### **Step 1: Set up Supabase Database**

1. **Create Supabase Account:**
   - Go to [supabase.com](https://supabase.com)
   - Sign up with GitHub
   - Create new project

2. **Set up Database:**
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `supabase-setup.sql`
   - Paste and run the SQL script

3. **Get API Keys:**
   - Go to Settings → API
   - Copy: Project URL, anon key, service key

### **Step 2: Get Groq API Key**

1. **Create Groq Account:**
   - Go to [console.groq.com](https://console.groq.com)
   - Sign up for free
   - Get API key from dashboard

### **Step 3: Deploy to Vercel**

1. **Connect GitHub:**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Add Environment Variables:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add these variables:
     ```
     GROQ_API_KEY=your_groq_key
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_KEY=your_supabase_service_key
     ```

3. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your ResearchBot is live!

## 🎯 **What You Get:**

### **Real Research Tools:**
- ✅ **PDF Upload & Processing** (Supabase Storage)
- ✅ **Research Paper Search** (arXiv, PubMed, OpenAlex)
- ✅ **Citation Management** (PostgreSQL database)
- ✅ **Research Timeline** (Interactive charts)
- ✅ **Note-taking System** (Rich text editor)
- ✅ **AI Summarization** (Groq API)
- ✅ **User Authentication** (Supabase Auth)
- ✅ **Real-time Collaboration** (Supabase Realtime)

### **Free Limits:**
- **Supabase**: 500MB database + 1GB storage
- **Groq API**: 14,400 requests/day
- **Vercel**: 100GB bandwidth/month

## 💰 **Total Cost: $0**

No paid services required!

## 🔧 **Troubleshooting:**

### **Common Issues:**
1. **Database connection error**: Check Supabase API keys
2. **Groq API error**: Verify API key
3. **Deployment error**: Check environment variables

### **Support:**
- Check GitHub issues
- Review Supabase docs
- Check Groq API docs

## 🎉 **You're Ready!**

Your ResearchBot is now a **world-class research platform** with real functionality, completely free!

**Next Steps:**
1. Upload research papers
2. Create research timeline
3. Start taking notes
4. Search for papers
5. Manage citations

**Happy Researching!** 🚀
