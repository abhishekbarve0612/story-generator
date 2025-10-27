import { consume, ipFromRequest } from "@/lib/rate-limit/staticBudget";
import { generateInstructions } from "@/utils/llm";
import { logLLMResponse } from "@/utils/responseLogger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { description, sender } = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
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

    const result = await generateInstructions(description, sender);

    try {
      await logLLMResponse("instructions", { description }, result);
    } catch (logError) {
      console.error("Error logging instruction response:", logError);
    }

    return NextResponse.json(result, {
      headers: headers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate instructions" },
      { status: 500 }
    );
  }
}
