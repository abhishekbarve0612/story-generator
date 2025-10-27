import { consume, ipFromRequest } from "@/lib/rate-limit/staticBudget";
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

    const ip = ipFromRequest(request)
    const consumption = consume(ip)

    const headers = new Headers()

    let limitHeader: string
    if (consumption.policy === 'unlimited' || consumption.policy === 'bypass') {
      limitHeader = 'unlimited'
    } else {
      limitHeader = `${consumption.policy} ${consumption.remaining}`
    }

    headers.set('X-RateLimit-Limit', limitHeader)
    headers.set('X-RateLimit-Remaining', consumption.remaining.toString())
    headers.set('X-RateLimit-Policy', consumption.policy.toString())

    if (!consumption.allowed) {
      return new NextResponse(JSON.stringify({
        error: 'Demo request limit reached',
      }), {
        status: 429,
        headers: headers,
      })
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

    return NextResponse.json(result, {
      headers: headers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate story progression" },
      { status: 500 }
    );
  }
}
