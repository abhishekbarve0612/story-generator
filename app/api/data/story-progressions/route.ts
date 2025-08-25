import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const RESPONSES_JSON_FILE = path.join(process.cwd(), "responses.json");

interface StoryProgression {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
  type: "assistant";
}

export async function GET() {
  try {
    const data = await fs.readFile(RESPONSES_JSON_FILE, "utf8");
    const responses = JSON.parse(data);
    
    return NextResponse.json({ 
      storyProgressions: responses.storyProgressions || [] 
    });
  } catch (error) {
    return NextResponse.json({ storyProgressions: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { storyProgressions }: { storyProgressions: StoryProgression[] } = await request.json();

    let responsesData: any = {};
    
    try {
      const data = await fs.readFile(RESPONSES_JSON_FILE, "utf8");
      responsesData = JSON.parse(data);
    } catch (error) {
      responsesData = {};
    }

    responsesData.storyProgressions = storyProgressions;

    await fs.writeFile(RESPONSES_JSON_FILE, JSON.stringify(responsesData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save story progressions" },
      { status: 500 }
    );
  }
}