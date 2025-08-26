import { generateMessage } from "@/utils/llm";
import { logLLMResponse } from "@/utils/responseLogger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, sender } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const result = await generateMessage(message, sender);

    try {
      await logLLMResponse("message", { message, sender }, result);
    } catch (logError) {
      console.error("Error logging message response:", logError);
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to improve message" },
      { status: 500 }
    );
  }
}
