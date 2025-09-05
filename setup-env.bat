@echo off
echo Setting up ResearchBot Environment Variables...
echo.

echo Please fill in your Supabase and Groq API keys:
echo.

set /p SUPABASE_URL="Enter your Supabase Project URL: "
set /p SUPABASE_ANON_KEY="Enter your Supabase Anon Key: "
set /p SUPABASE_SERVICE_KEY="Enter your Supabase Service Key: "
set /p GROQ_API_KEY="Enter your Groq API Key: "

echo.
echo Creating .env file...

(
echo # ResearchBot Environment Variables
echo GROQ_API_KEY=%GROQ_API_KEY%
echo SUPABASE_URL=%SUPABASE_URL%
echo SUPABASE_ANON_KEY=%SUPABASE_ANON_KEY%
echo SUPABASE_SERVICE_KEY=%SUPABASE_SERVICE_KEY%
echo PORT=5001
) > .env

echo.
echo ✅ Environment variables configured!
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Deploy to Vercel
echo.
pause
