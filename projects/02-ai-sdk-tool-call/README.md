# AI SDK Introduction Projects

This project contains two examples demonstrating different capabilities of the AI SDK with Google Gemini.

---

## Project 1: Sentence to Type-Safe Object Generator

This example demonstrates the power of the AI SDK's `generateObject` function combined with Zod schemas and beautiful CLI prompts.

### Mission

From a simple sentence description (e.g., "a software engineer from London"), generate a fully-typed mock user object with no manual JSON parsing or type-casting required!

### Features

✨ **Step 1: Define the Output with Zod** - Create a type-safe schema that defines the structure of your User object

🎨 **Step 2: Craft the Prompt with @clack/prompts** - Beautiful, interactive CLI interface for user input

🪄 **Step 3: The Magic of generateObject** - AI SDK generates a typed object that matches your schema

📦 **Step 4: See the Result** - Get a fully-typed object with zero manual parsing!

### Running the Application

```bash
node --env-file-if-exists=.env sentence-transformer.ts
```

### How It Works

1. The application prompts you to describe a person
2. Behind the scenes, `generateObject` uses the Google Gemini model with your Zod schema
3. The AI generates a realistic user profile matching your schema
4. You get back a **fully typed** User object - no JSON.parse() needed!

### Key Takeaways

- **Type Safety**: The returned object is typed according to your Zod schema
- **No Manual Parsing**: AI SDK handles all the parsing and validation
- **Schema Validation**: Zod ensures the generated data matches your expected structure
- **Clean Code**: No need for type assertions or manual type-casting

### Example Output

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

---

## Project 2: Building a Conversational CLI Bot

This example demonstrates how to build an interactive chat loop in the terminal that remembers conversation history.

### Features

✅ **Conversation History**: Maintains a full messages array to track the entire conversation  
✅ **User and Assistant Roles**: Properly structures messages with roles for context  
✅ **Continuous Chat Loop**: Uses `while (true)` with @clack/prompts for smooth interaction  
✅ **Context Awareness**: Passes the entire conversation history to generateText for coherent responses  
✅ **Error Handling**: Gracefully handles errors and allows retry  
✅ **Beautiful UI**: Uses @clack/prompts for an enhanced terminal experience

### Key Concepts

#### Step 1: The Messages Array

```typescript
const messages: Array<{ role: "user" | "assistant"; content: string }> = [];
```

The messages array maintains the full conversation history. Each message has:

- **role**: Either "user" or "assistant" to identify who sent the message
- **content**: The actual text of the message

#### Step 2: The Chat Loop

```typescript
while (true) {
  const userMessage = await prompts.text({
    message: "You:",
    placeholder: "Type your message here...",
  });
  // ... process message
}
```

The `while (true)` loop keeps the conversation going indefinitely until the user exits.

#### Step 3: Generating Responses with generateText

```typescript
const { text } = await generateText({
  model: google("gemini-2.0-flash-exp"),
  messages: messages, // Pass the entire conversation history
  system: "You are a helpful and friendly AI assistant.",
});
```

**Key insight**: By passing the entire `messages` array, the AI model has full context of the conversation and can provide relevant, contextual responses.

After generating a response, both the user's message and the assistant's response are added to the messages array:

```typescript
// Add user message
messages.push({
  role: "user",
  content: messageText,
});

// Generate response
const { text } = await generateText({
  /* ... */
});

// Add assistant response
messages.push({
  role: "assistant",
  content: text,
});
```

### How to Run

```bash
# Run with Node.js (automatically loads .env file if it exists)
node --env-file-if-exists=.env conversing-bot.ts
```

### Usage Example

```
┌  🤖 Conversational CLI Bot
│
└  Welcome! I'm your AI assistant. Type your messages and I'll respond.
   Type "exit" or "quit" to end the conversation.

◇  You:
│  Hello! What can you help me with?
│
AI: Hello! I can help you with a variety of things, such as...

◇  You:
│  Tell me a joke
│
AI: Why don't scientists trust atoms? Because they make up everything!

◇  You:
│  That was funny! Tell me another one
│
AI: I'm glad you enjoyed it! Here's another one...
```

### Exit Commands

You can exit the conversation in three ways:

1. Type `exit`
2. Type `quit`
3. Type `bye`
4. Press `Ctrl+C`

### What Makes This a Conversational Bot?

Unlike a simple Q&A bot, this implementation:

- **Remembers context**: Each response considers all previous messages
- **Maintains continuity**: The AI can refer back to earlier parts of the conversation
- **Handles multi-turn dialogs**: You can have back-and-forth discussions naturally

### Learning Points

1. **Messages Array**: The key to maintaining conversation history
2. **Role System**: Using "user" and "assistant" roles to structure the conversation
3. **Context Window**: Passing full message history gives the AI complete context
4. **Loop Management**: Using `while (true)` with proper exit conditions
5. **UX Enhancement**: Using @clack/prompts for better terminal interaction

Try running the bot and having a multi-turn conversation. Notice how the AI remembers what you talked about earlier in the conversation!

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
