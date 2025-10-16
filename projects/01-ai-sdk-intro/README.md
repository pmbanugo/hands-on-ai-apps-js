# Sentence to Type-Safe Object Generator

This project demonstrates the power of the AI SDK's `generateObject` function combined with Zod schemas and beautiful CLI prompts.

## Mission

From a simple sentence description (e.g., "a software engineer from London"), generate a fully-typed mock user object with no manual JSON parsing or type-casting required!

## Features

✨ **Step 1: Define the Output with Zod** - Create a type-safe schema that defines the structure of your User object

🎨 **Step 2: Craft the Prompt with @clack/prompts** - Beautiful, interactive CLI interface for user input

🪄 **Step 3: The Magic of generateObject** - AI SDK generates a typed object that matches your schema

📦 **Step 4: See the Result** - Get a fully-typed object with zero manual parsing!

## Setup

1. Make sure you have a `.env` file with your Google API key:

   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```

2. Install dependencies (if not already done):
   ```bash
   pnpm install
   ```

## Running the Application

```bash
node --env-file-if-exists=.env sentence-transformer.ts
```

## How It Works

1. The application prompts you to describe a person
2. Behind the scenes, `generateObject` uses the Google Gemini model with your Zod schema
3. The AI generates a realistic user profile matching your schema
4. You get back a **fully typed** User object - no JSON.parse() needed!

## Key Takeaways

- **Type Safety**: The returned object is typed according to your Zod schema
- **No Manual Parsing**: AI SDK handles all the parsing and validation
- **Schema Validation**: Zod ensures the generated data matches your expected structure
- **Clean Code**: No need for type assertions or manual type-casting

## Example Output

```
Describe a person: a software engineer from London

✅ Generated successfully!

┌  Generated User Profile
│
│  Name: James Anderson
│  Age: 32 years old
│  Occupation: Senior Software Engineer
│  Location: London, UK
│  Email: james.anderson@techmail.com
│  Interests: Coding, Chess, Hiking, Photography
│
└

📦 Full Object (TypeScript knows this is a User type!):
{
  "name": "James Anderson",
  "age": 32,
  "occupation": "Senior Software Engineer",
  "location": "London, UK",
  "email": "james.anderson@techmail.com",
  "interests": ["Coding", "Chess", "Hiking", "Photography"]
}
```
