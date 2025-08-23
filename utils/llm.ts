import openai, { MODEL_NAME } from "./ai";
import { AIMessage, AIResponse } from "@/utils/types";
import {
  CHARACTER_GENERATION_PROMPT,
  MESSAGE_IMPROVEMENT_PROMPT,
  SCENARIO_GENERATION_PROMPT,
  STORY_DIRECTION_PROMPT,
  STORY_PROGRESSION_PROMPT,
  WRITING_INSTRUCTIONS_PROMPT,
} from "./prompts";
import { getCharacterProfile, getCharacterNames } from "./characterData";

export async function generateText(messages: AIMessage[]): Promise<AIResponse> {
  const response = await openai.chat.completions.create({
    model: MODEL_NAME,
    messages,
  });

  return {
    text: response.choices[0].message.content || "",
    role: response.choices[0].message.role as "assistant" | "user",
  };
}

export async function generateCharacter(
  description: string
): Promise<AIResponse> {
  const prompt = `
  Description : ${description}
  `;

  const messages: AIMessage[] = [
    { role: "system", content: CHARACTER_GENERATION_PROMPT },
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
  sender: string = "Narrator"
): Promise<AIResponse> {
  const prompt = `
  Sender's name: ${sender}
  Directions : ${description}
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
  sender: string = "Narrator"
): Promise<AIResponse> {
  const characters = await getCharacterNames();
  const senderProfile = await getCharacterProfile(sender);
  
  const prompt = `
  Sender's profile: ${senderProfile}
  Summary: ${summary}
  Characters in the story: ${characters.join(", ")}
  `;

  const messages: AIMessage[] = [
    { role: "system", content: STORY_PROGRESSION_PROMPT },
    ...conversation,
    { role: "user", content: prompt },
  ];

  return generateText(messages);
}
