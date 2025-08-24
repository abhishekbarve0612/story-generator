import openai, { MODEL_NAME } from "./ai";
import { AIMessage, AIResponse } from "@/utils/types";
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

export async function generateText(
  messages: AIMessage[],
  useTools: boolean = false
): Promise<AIResponse> {
  const requestParams: any = {
    model: MODEL_NAME,
    messages,
  };

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
      messages: messagesWithToolResponses,
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
