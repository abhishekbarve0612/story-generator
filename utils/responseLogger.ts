import { promises as fs } from "fs";
import path from "path";
import { AIResponse } from "./types";

const RESPONSES_LOG_FILE = path.join(
  process.cwd(),
  "data",
  "llm-responses.json"
);

interface LLMRequestResponse {
  id: string;
  type:
    | "character"
    | "lore"
    | "scenario"
    | "message"
    | "direction"
    | "instructions"
    | "story-progression"
    | "summary";
  request: {
    description?: string;
    message?: string;
    sender?: string;
    summary?: string;
    timestamp: number;
  };
  response: AIResponse;
  timestamp: number;
}

interface ResponsesLog {
  responses: Record<string, LLMRequestResponse>;
  responseIds: string[];
}

export async function logLLMResponse(
  type: LLMRequestResponse["type"],
  request: Omit<LLMRequestResponse["request"], "timestamp">,
  response: AIResponse
): Promise<string> {
  try {
    const responseId = `${type}_${Date.now()}`;
    const logEntry: LLMRequestResponse = {
      id: responseId,
      type,
      request: {
        ...request,
        timestamp: Date.now(),
      },
      response,
      timestamp: Date.now(),
    };

    let existingData: ResponsesLog = {
      responses: {},
      responseIds: [],
    };

    try {
      const data = await fs.readFile(RESPONSES_LOG_FILE, "utf8");
      existingData = JSON.parse(data);
      if (!existingData.responseIds) {
        existingData.responseIds = [];
      }
    } catch (error) {
      console.log("Creating new LLM responses log file");
    }

    existingData.responses[responseId] = logEntry;
    existingData.responseIds.push(responseId);

    await fs.mkdir(path.dirname(RESPONSES_LOG_FILE), { recursive: true });
    await fs.writeFile(
      RESPONSES_LOG_FILE,
      JSON.stringify(existingData, null, 2)
    );

    console.log(`LLM response logged: ${type} - ${responseId}`);
    return responseId;
  } catch (error) {
    console.error("Error logging LLM response:", error);
    throw error;
  }
}

// Utility to get all responses by type
export async function getResponsesByType(
  type: LLMRequestResponse["type"]
): Promise<LLMRequestResponse[]> {
  try {
    const data = await fs.readFile(RESPONSES_LOG_FILE, "utf8");
    const logData: ResponsesLog = JSON.parse(data);

    return Object.values(logData.responses || {}).filter(
      (response) => response.type === type
    );
  } catch (error) {
    console.warn(`Failed to get responses for type ${type}:`, error);
    return [];
  }
}

// Utility to get response by ID
export async function getResponseById(
  responseId: string
): Promise<LLMRequestResponse | null> {
  try {
    const data = await fs.readFile(RESPONSES_LOG_FILE, "utf8");
    const logData: ResponsesLog = JSON.parse(data);

    return logData.responses[responseId] || null;
  } catch (error) {
    console.warn(`Failed to get response ${responseId}:`, error);
    return null;
  }
}
