import openai, { MODEL_NAME } from "./ai";
import { AIMessage, AIResponse } from "@/types";
import {
  CHARACTER_GENERATION_PROMPT,
  MESSAGE_IMPROVEMENT_PROMPT,
  SCENARIO_GENERATION_PROMPT,
  STORY_DIRECTION_PROMPT,
  STORY_PROGRESSION_PROMPT,
  WRITING_INSTRUCTIONS_PROMPT,
} from "./prompts";

export async function generateText(messages: AIMessage[]): Promise<AIResponse> {
  const response = await openai.chat.completions.create({
    model: MODEL_NAME,
    messages,
    temperature: 0.7,
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

const mockSendersProfile = (sender: string): string => {
  return `
  ${sender} is a ${Math.floor(Math.random() * 100)} year old ${
    Math.random() > 0.5 ? "man" : "woman"
  } who works as a ${Math.random() > 0.5 ? "software engineer" : "doctor"}.
  `;
};

export async function generateMessage(
  message: string,
  sender: string = "Narrator"
): Promise<AIResponse> {
  const sendersProfile = mockSendersProfile(sender);
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
  const prompt = `
  Sender's name: ${sender}
  Summary: ${summary}
  `;

  const messages: AIMessage[] = [
    { role: "system", content: STORY_PROGRESSION_PROMPT },
    ...conversation,
    { role: "user", content: prompt },
  ];

  return generateText(messages);
}
