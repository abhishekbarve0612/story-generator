import { generateStoryProgression } from "@/utils/llm";
import { logLLMResponse } from "@/utils/responseLogger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      conversation,
      summary,
      sender,
      storyDirection,
      writingInstructions,
      newMessage,
    } = await request.json();

    if (!conversation || !Array.isArray(conversation)) {
      return NextResponse.json(
        { error: "Conversation array is required" },
        { status: 400 }
      );
    }

    const result = await generateStoryProgression(
      conversation,
      summary || "",
      sender || "Narrator",
      storyDirection || "",
      writingInstructions || "",
      newMessage || ""
    );

    // Log the LLM request and response
    try {
      await logLLMResponse(
        "story-progression",
        {
          summary: summary || "",
          sender: sender || "Narrator",
        },
        result
      );
    } catch (logError) {
      console.error("Error logging story progression response:", logError);
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate story progression" },
      { status: 500 }
    );
  }
}
