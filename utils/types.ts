export interface AIResponse {
  text: string;
  role: "assistant" | "user";
}

export interface AIMessage {
  role: "assistant" | "user" | "system" | "tool";
  content: string;
  tool_call_id?: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  generatedProfile: string;
  timestamp: number;
  tags?: string[];
  structuredProfile?: CharacterProfile;
}

export interface CharacterProfile {
  name: string;
  basicInformation: string;
  physicalAppearance: string;
  personality: string;
  background: string;
  motivationsAndGoals: string;
  relationships: string;
  skillsAndAbilities: string;
  potentialStoryRole: string;
}

export interface ResponseParserMessage {
  role: "user" | "assistant" | "system";
  content: string;
}
