@echo off
echo Setting up ResearchBot...
echo.

echo Installing dependencies...
npm install

echo.
echo Creating environment file...
if not exist .env (
    echo GROQ_API_KEY=your_groq_api_key_here > .env
    echo PORT=5001 >> .env
    echo Environment file created! Please edit .env and add your Groq API key.
) else (
    echo Environment file already exists.
)

echo.
echo Setup complete!
echo.
echo To start the server, run: npm start
echo To open in browser, visit: http://localhost:5001
pause
