export interface AIResponse {
  text: string;
  role: "assistant" | "user";
}

export interface AIMessage {
  role: "assistant" | "user" | "system";
  content: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  generatedProfile: string;
  timestamp: number;
  tags?: string[];
}
