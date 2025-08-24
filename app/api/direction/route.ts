import { generateDirection } from "@/utils/llm";
import { logLLMResponse } from "@/utils/responseLogger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { description, sender, plotOrLore, storySummary } =
      await request.json();

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const result = await generateDirection(
      description,
      sender,
      plotOrLore,
      storySummary
    );

    try {
      await logLLMResponse("direction", { description }, result);
    } catch (logError) {
      console.error("Error logging direction response:", logError);
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate direction" },
      { status: 500 }
    );
  }
}
