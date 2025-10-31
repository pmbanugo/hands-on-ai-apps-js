# AI SDK Introduction Projects

---

## Setup

1. Make sure you have a `.env` file with your Google API key:

   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```

   Get your API key from: https://aistudio.google.com/app/apikey

2. Install dependencies (if not already done):
   ```bash
   pnpm install
   ```
3. Navigate to this project directory:
   ```bash
   cd projects/03-ai-sdk-agent
   ```
4. Run the program:
   ```bash
   node --env-file=.env search-agent.ts
   ```
   OR
   ```bash
    node --env-file=.env search-agent_completed.ts
   ```
