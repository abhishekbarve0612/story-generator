export interface AIResponse {
  text: string;
  role: "assistant" | "user";
}

export interface AIMessage {
  role: "assistant" | "user" | "system";
  content: string;
}
