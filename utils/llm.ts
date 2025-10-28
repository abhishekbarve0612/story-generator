import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

import openai, { MODEL_NAME } from "./ai";
import type {
  AIMessage,
  AIResponse,
  CharacterProfile,
  ResponseParserMessage,
} from "@/utils/types";
import {
  CHARACTER_GENERATION_PROMPT,
  LORE_GENERATION_PROMPT,
  MESSAGE_IMPROVEMENT_PROMPT,
  SCENARIO_GENERATION_PROMPT,
  STORY_DIRECTION_PROMPT,
  STORY_PROGRESSION_PROMPT,
  STORY_SUMMARIZATION_PROMPT,
  WRITING_INSTRUCTIONS_PROMPT,
} from "./prompts";
import { getCharacterNames, getCharacterProfile } from "./characterData";
import { storyTools } from "./tools";
import { handleToolCalls } from "./toolHandler";
import type { ChatCompletionMessageParam } from "openai/resources";

export async function generateText(
  messages: AIMessage[],
  useTools: boolean = false,
  responseFormat: { schema: any; name: string } | null = null
): Promise<AIResponse> {
  const requestParams: any = {
    model: MODEL_NAME,
    messages,
  };

  if (responseFormat) {
    requestParams.response_format = zodTextFormat(
      responseFormat.schema,
      responseFormat.name
    );
  }

  if (useTools) {
    requestParams.tools = storyTools;
    requestParams.tool_choice = "auto";
  }

  const response = await openai.chat.completions.create(requestParams);
  const choice = response.choices[0];

  if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
    const updatedMessages = [...messages, choice.message as AIMessage];

    const messagesWithToolResponses = await handleToolCalls(
      choice.message.tool_calls,
      updatedMessages
    );

    const finalResponse = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: messagesWithToolResponses as ChatCompletionMessageParam[],
    });

    return {
      text: finalResponse.choices[0].message.content || "",
      role: finalResponse.choices[0].message.role as "assistant" | "user",
    };
  }

  return {
    text: choice.message.content || "",
    role: choice.message.role as "assistant" | "user",
  };
}

// REF: https://platform.openai.com/docs/guides/structured-outputs#structured-outputs-vs-json-mode
export async function generateStructuredResponse(
  messages: ResponseParserMessage[],
  schema: any,
  name: string
) {
  const response = await openai.responses.parse({
    model: MODEL_NAME,
    input: messages.map(message => ({
      role: message.role,
      content: message.content,
    })),
    text: {
      format: zodTextFormat(schema, name),
    },
  })

  const parsed = response.output_parsed

  if (!parsed) {
    throw new Error("Failed to parse structured response.")
  }

  return parsed
}

const characterProfileSchema = z.object({
  name: z
    .string()
    .min(3)
    .describe("Full character name that fits the requested setting or genre."),
  basicInformation: z
    .string()
    .min(10)
    .describe("Key facts such as age, gender (if known), occupation, and role."),
  physicalAppearance: z
    .string()
    .min(10)
    .describe("Distinctive physical traits, style, and mannerisms."),
  personality: z
    .string()
    .min(10)
    .describe("Core traits, strengths, weaknesses, and quirks."),
  background: z
    .string()
    .min(10)
    .describe("Origin story and formative experiences."),
  motivationsAndGoals: z
    .string()
    .min(10)
    .describe("Immediate motivations and longer-term objectives."),
  relationships: z
    .string()
    .min(10)
    .describe("Important connections and their dynamics."),
  skillsAndAbilities: z
    .string()
    .min(10)
    .describe("Relevant talents, skills, or powers."),
  potentialStoryRole: z
    .string()
    .min(10)
    .describe("How the character can drive or influence a narrative."),
})

function formatCharacterProfile(profile: CharacterProfile): string {
  return [
    `Name: ${profile.name}`,
    `Basic Information: ${profile.basicInformation}`,
    `Physical Appearance: ${profile.physicalAppearance}`,
    `Personality: ${profile.personality}`,
    `Background: ${profile.background}`,
    `Motivations & Goals: ${profile.motivationsAndGoals}`,
    `Relationships: ${profile.relationships}`,
    `Skills & Abilities: ${profile.skillsAndAbilities}`,
    `Potential Story Role: ${profile.potentialStoryRole}`,
  ].join("\n\n")
}

export async function generateCharacter(
  description: string
): Promise<AIResponse & { parsed: CharacterProfile }> {
  const prompt = `
  Description : ${description}
  `

  const messages: ResponseParserMessage[] = [
    { role: "system", content: CHARACTER_GENERATION_PROMPT },
    { role: "user", content: prompt },
  ]

  const profile = await generateStructuredResponse(
    messages,
    characterProfileSchema,
    "character_profile"
  )

  const formattedText = formatCharacterProfile(profile);

  return {
    text: formattedText,
    role: "assistant",
    parsed: profile,
  }
}

export async function generateLore(description: string): Promise<AIResponse> {
  const prompt = `
  Lore : ${description}
  `;

  const messages: AIMessage[] = [
    { role: "system", content: LORE_GENERATION_PROMPT },
    { role: "user", content: prompt },
  ];

  return generateText(messages);
}

export async function generateScenario(
  description: string
): Promise<AIResponse> {
  const prompt = `
  Scenario : ${description}
  `;

  const messages: AIMessage[] = [
    { role: "system", content: SCENARIO_GENERATION_PROMPT },
    { role: "user", content: prompt },
  ];

  return generateText(messages);
}

export async function generateDirection(
  description: string,
  sender: string = "Narrator",
  plotOrLore: string = "",
  storySummary: string = ""
): Promise<AIResponse> {
  const prompt = `
  Sender's name: ${sender}
  Directions : ${description}
  Plot/Lore : ${plotOrLore}
  Story Summary : ${storySummary}
  `;

  const messages: AIMessage[] = [
    { role: "system", content: STORY_DIRECTION_PROMPT },
    { role: "user", content: prompt },
  ];

  return generateText(messages);
}

export async function generateInstructions(
  description: string,
  sender: string = "Narrator"
): Promise<AIResponse> {
  const prompt = `
  Sender's name: ${sender}
  Instructions : ${description}
  `;

  const messages: AIMessage[] = [
    { role: "system", content: WRITING_INSTRUCTIONS_PROMPT },
    { role: "user", content: prompt },
  ];

  return generateText(messages);
}

export async function generateMessage(
  message: string,
  sender: string = "Narrator"
): Promise<AIResponse> {
  const sendersProfile = await getCharacterProfile(sender);
  const prompt = `
  Sender's profile: ${sendersProfile}
  Message: ${message}
  `;
  const messages: AIMessage[] = [
    { role: "system", content: MESSAGE_IMPROVEMENT_PROMPT },
    { role: "user", content: prompt },
  ];

  return generateText(messages);
}

export async function generateStoryProgression(
  conversation: AIMessage[],
  summary: string,
  sender: string = "Narrator",
  storyDirection: string = "",
  writingInstructions: string = "",
  newMessage: string = ""
): Promise<AIResponse> {
  // Get sender profile upfront, but let the LLM request other character profiles as needed
  const senderProfile = await getCharacterProfile(sender);
  const characters = await getCharacterNames();

  const prompt = `
  Sender's profile: ${senderProfile}
  Characters in the story: ${characters.join(", ")}
  Summary: ${summary}
  Story Direction: ${storyDirection}
  Writing Instructions: ${writingInstructions}
  Direct Flow Message: ${newMessage}
  You have access to tools to get character profiles and available characters as needed for the story progression.
  `;

  const systemPrompt = `
  ${STORY_PROGRESSION_PROMPT}
  `;

  const messages: AIMessage[] = [
    { role: "system", content: systemPrompt },
    ...conversation,
    { role: "user", content: prompt },
  ];

  // Enable tool calling for story progression
  return generateText(messages, true);
}

export async function generateSummary(
  chatHistory: AIMessage[]
): Promise<AIResponse> {
  const prompt = `
  Chat History : ${chatHistory}
  `;

  const messages: AIMessage[] = [
    { role: "system", content: STORY_SUMMARIZATION_PROMPT },
    { role: "user", content: prompt },
  ];

  return generateText(messages);
}
