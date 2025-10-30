import { generateText, stepCountIs, tool } from "ai";
import type { UserModelMessage, AssistantModelMessage } from "ai";
import { google } from "@ai-sdk/google";
import * as prompts from "@clack/prompts";
import process from "node:process";

// Tool 1: Your custom tool
const timeTool = tool({
  description: "Get the current time to answer user questions about time.",
  inputSchema: undefined,
  execute: async () => {
    const now = new Date();

    return `The current time is ${now.toLocaleTimeString()}.`;
  },
});

const messages: Array<UserModelMessage | AssistantModelMessage> = [];

async function main() {
  prompts.intro("🤖 Conversational CLI Bot with Tools");

  console.log(
    "\nWelcome! I'm your AI assistant. Type your messages and I'll respond."
  );
  console.log('Type "exit" or "quit" to end the conversation.\n');

  while (true) {
    const userMessage = await prompts.text({
      message: "You:",
      placeholder: "Type your message here...",
      validate: (value) => {
        if (!value) return "Please enter a message";
      },
    });

    if (prompts.isCancel(userMessage)) {
      prompts.cancel("Conversation ended.");
      process.exit(0);
    }

    const messageText = userMessage;
    if (
      messageText === "exit" ||
      messageText === "quit" ||
      messageText === "bye"
    ) {
      prompts.outro("👋 Goodbye! Thanks for chatting!");
      break;
    }

    messages.push({
      role: "user",
      content: messageText,
    });

    const spinner = prompts.spinner();
    spinner.start("AI is thinking...");

    try {
      // STEP 1: Update the 'tools' object
      const { text } = await generateText({
        model: google("gemini-2.5-flash-lite"),
        messages: messages,
        stopWhen: stepCountIs(5), // allows multi-step tool use. used to be called maxSteps in AI SDK v4.
        system:
          "You are a helpful and friendly AI assistant who uses the tools to help the user achieve various task beyond the tools capability. Keep your responses concise and conversational.",
        tools: {
          // getCurrentTime: timeTool,
          // Add the provider-native url_context tool
          url_context: google.tools.urlContext({}),
        },
      });

      spinner.stop("AI response received");
      prompts.note(text, "AI Response");

      messages.push({
        role: "assistant",
        content: text,
      });
    } catch (error) {
      spinner.stop("Error occurred");
      console.error("\n❌ Error generating response:", error);
      console.log("Let's try again...\n");
      messages.pop();
    }
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
