import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import * as prompts from "@clack/prompts";
import process from "node:process";

// Mission: Building a Conversational CLI Bot
// This bot maintains conversation history and allows continuous interaction

// Step 1: Initialize the messages array to maintain conversation history
// The messages array stores both user and assistant messages
const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

async function main() {
  prompts.intro("🤖 Conversational CLI Bot");

  console.log(
    "\nWelcome! I'm your AI assistant. Type your messages and I'll respond."
  );
  console.log('Type "exit" or "quit" to end the conversation.\n');

  // Step 2: The Chat Loop
  // Using while (true) for continuous conversation until user exits
  while (true) {
    // Get user input using @clack/prompts
    const userMessage = await prompts.text({
      message: "You:",
      placeholder: "Type your message here...",
      validate: (value) => {
        if (!value) return "Please enter a message";
      },
    });

    // Handle user cancellation (Ctrl+C)
    if (prompts.isCancel(userMessage)) {
      prompts.cancel("Conversation ended.");
      process.exit(0);
    }

    // Check for exit commands
    const messageText = String(userMessage);
    if (
      messageText === "exit" ||
      messageText === "quit" ||
      messageText === "bye"
    ) {
      prompts.outro("👋 Goodbye! Thanks for chatting!");
      break;
    }

    // Add the user's message to the conversation history
    messages.push({
      role: "user",
      content: messageText,
    });

    // Show a spinner while generating the response
    const spinner = prompts.spinner();
    spinner.start("AI is thinking...");

    try {
      // Step 3: Generate a Response with generateText
      // Pass the entire messages history to maintain context
      const { text } = await generateText({
        model: google("gemini-2.0-flash-exp"),
        messages: messages, // Send the full conversation history
        system:
          "You are a helpful and friendly AI assistant. Keep your responses concise and conversational.",
      });

      spinner.stop("AI response received");

      // Display the assistant's response
      console.log(`\nAI: ${text}\n`);

      // Add the assistant's response to the conversation history
      messages.push({
        role: "assistant",
        content: text,
      });
    } catch (error) {
      spinner.stop("Error occurred");
      console.error("\n❌ Error generating response:", error);
      console.log("Let's try again...\n");
      // Remove the last user message since we couldn't generate a response
      messages.pop();
    }
  }
}

// Start the conversational bot
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
