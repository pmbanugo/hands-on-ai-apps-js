import { Experimental_Agent as Agent, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import * as prompts from "@clack/prompts";

// We'll use stepCountIs to limit the agent to a maximum number of steps
// This prevents runaway loops and controls costs
const MAX_AGENT_STEPS = 10;

const searchAgent = new Agent({
  model: google("gemini-2.5-flash"),

  system: `You are an expert research assistant. When users ask questions:
  
1. Search the web to find relevant, recent information
2. Read the most promising sources using the url_context tool
3. Synthesise information from multiple sources
4. Provide a comprehensive answer with proper citations

Always aim to verify claims across multiple sources before presenting them as fact.
Keep your responses clear and well-structured.`,

  tools: {
    google_search: google.tools.googleSearch({}),
    url_context: google.tools.urlContext({}),
  },

  stopWhen: stepCountIs(MAX_AGENT_STEPS),
});

async function main() {
  prompts.intro("🔍 AI Search and Article Summariser");

  console.log("\nAsk me anything, and I'll search the web for answers!");
  console.log('Type "exit" to quit.\n');

  while (true) {
    const userQuery = await prompts.text({
      message: "Your question:",
      placeholder: "e.g., What are the latest AI breakthroughs?",
      validate: (value) => {
        if (!value) return "Please enter a question";
      },
    });

    if (prompts.isCancel(userQuery)) {
      prompts.cancel("Search cancelled.");
      process.exit(0);
    }

    if (userQuery === "exit") {
      prompts.outro("👋 Thanks for using AI Search!");
      break;
    }

    const spinner = prompts.spinner();
    spinner.start("Researching your question...");

    try {
      const result = await searchAgent.generate({
        prompt: userQuery,
      });

      spinner.stop("Research complete!");

      // Display the agent's response
      prompts.note(result.text, "Answer");

      // Show some transparency about what the agent did
      console.log(
        `\n💡 Research process: ${result.steps.length} steps taken\n`
      );
    } catch (error) {
      spinner.stop("Error occurred");
      console.error("\n❌ Failed to process your question:", error);
      console.log("Let's try again...\n");
    }
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
