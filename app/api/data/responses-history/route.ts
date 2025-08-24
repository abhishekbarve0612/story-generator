import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const RESPONSES_FILE = path.join(
  process.cwd(),
  "data",
  "responses-history.json"
);

interface GeneratedResponse {
  id: string;
  type:
    | "character"
    | "scenario"
    | "direction"
    | "instruction"
    | "message"
    | "story-progression";
  input: string;
  output: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export async function GET() {
  try {
    const data = await fs.readFile(RESPONSES_FILE, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ responses: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { response }: { response: GeneratedResponse } = await request.json();

    let existingData: { responses: GeneratedResponse[] } = { responses: [] };
    try {
      const data = await fs.readFile(RESPONSES_FILE, "utf8");
      existingData = JSON.parse(data);
    } catch (error) {
      console.error("Error reading responses file:", error);
    }

    existingData.responses.push(response);

    await fs.mkdir(path.dirname(RESPONSES_FILE), { recursive: true });
    await fs.writeFile(RESPONSES_FILE, JSON.stringify(existingData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 }
    );
  }
}
