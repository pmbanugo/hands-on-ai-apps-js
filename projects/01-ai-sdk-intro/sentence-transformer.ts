/**
 * Mission: From a Sentence to a Type-Safe Object
 *
 * This script takes a simple description and generates a fully-typed mock user object.
 * It demonstrates the power of generateObject with Zod schemas and @clack/prompts.
 */

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import * as prompts from "@clack/prompts";

// Step 1: Define the Output with Zod
// This schema defines the structure of our User object
const UserSchema = z.object({
  name: z.string().describe("The full name of the person"),
  age: z.number().int().positive().describe("The age of the person in years"),
  occupation: z.string().describe("The person's job or profession"),
  location: z.string().describe("The city or location where the person lives"),
  email: z.email().describe("The person's email address"),
  interests: z.array(z.string()).describe("A list of hobbies or interests"),
});

// TypeScript type derived from the Zod schema
type User = z.infer<typeof UserSchema>;

async function main() {
  console.clear();

  // Step 2: Craft the Prompt with @clack/prompts
  // Beautiful CLI interface to gather user input
  prompts.intro("✨ Sentence to Type-Safe Object Generator ✨");

  const description = await prompts.text({
    message: 'Describe a person (e.g., "a software engineer from London"):',
    placeholder:
      "a software engineer from London who likes to ski and read sci-fi novels",
    validate: (value) => {
      if (!value || value.length < 3) {
        return "Please provide a meaningful description";
      }
    },
  });

  // Handle cancellation
  if (prompts.isCancel(description)) {
    prompts.cancel("Operation cancelled.");
    return;
  }

  // Show a spinner while generating
  const spinner = prompts.spinner();
  spinner.start("🤖 Generating type-safe user object...");

  try {
    // Step 3: The Magic of generateObject
    // This is where the AI SDK shines - it takes a model, schema, and prompt
    // and returns a TYPED object that matches our Zod schema
    const { object: user } = await generateObject({
      model: google("gemini-2.5-flash-lite"),
      schema: UserSchema,
      prompt: `Generate a realistic mock user profile based on this description: "${description}". 
               Make sure all fields are filled with believable, creative data.`,
    });

    spinner.stop("✅ Generated successfully!");

    // Step 4: Display the Result
    // Notice: No manual JSON parsing, no type-casting needed!
    // The 'user' variable is already typed as User
    prompts.note(
      `Name: ${user.name}
Age: ${user.age} years old
Occupation: ${user.occupation}
Location: ${user.location}
Email: ${user.email}
Interests: ${user.interests.join(", ")}`,
      "Generated User Profile"
    );

    prompts.outro("✨ Done! ✨");

    // Show the raw object
    console.log("\n📦 Full Object (TypeScript knows this is a User type!):\n");
    console.log(JSON.stringify(user, null, 2));
  } catch (error) {
    spinner.stop("❌ Generation failed");
    prompts.log.error(
      `Error: ${error instanceof Error ? error.message : error}`
    );
    return;
  }
}

// Run the application
main().catch(console.error);
