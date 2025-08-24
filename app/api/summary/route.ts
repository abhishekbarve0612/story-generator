import { generateSummary } from "@/utils/llm";
import { logLLMResponse } from "@/utils/responseLogger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { chatHistory } = await request.json();

    if (!chatHistory) {
      return NextResponse.json(
        { error: "Chat history is required" },
        { status: 400 }
      );
    }

    const result = await generateSummary(chatHistory);

    try {
      await logLLMResponse("summary", { description: chatHistory }, result);
    } catch (logError) {
      console.error("Error logging summary response:", logError);
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
