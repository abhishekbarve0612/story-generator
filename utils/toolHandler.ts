import { TOOL_NAMES } from "./tools";
import { getCharacterProfile, getCharacterNames } from "./characterData";
import { AIMessage } from "./types";

// Tool execution functions
export async function executeToolCall(toolName: string, args: any): Promise<string> {
  switch (toolName) {
    case TOOL_NAMES.GET_CHARACTER_PROFILE:
      return await getCharacterProfile(args.character_name);
    
    case TOOL_NAMES.GET_AVAILABLE_CHARACTERS:
      const characters = await getCharacterNames();
      return `Available characters: ${characters.join(", ")}`;
    
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

// Handle multiple tool calls in a conversation
export async function handleToolCalls(
  toolCalls: any[],
  messages: AIMessage[]
): Promise<AIMessage[]> {
  const updatedMessages = [...messages];

  for (const toolCall of toolCalls) {
    try {
      const result = await executeToolCall(
        toolCall.function.name,
        JSON.parse(toolCall.function.arguments)
      );

      // Add tool response message
      updatedMessages.push({
        role: "tool",
        content: result,
        tool_call_id: toolCall.id
      } as AIMessage);
    } catch (error) {
      console.error(`Tool execution error for ${toolCall.function.name}:`, error);
      
      // Add error response
      updatedMessages.push({
        role: "tool",
        content: `Error executing ${toolCall.function.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        tool_call_id: toolCall.id
      } as AIMessage);
    }
  }

  return updatedMessages;
}