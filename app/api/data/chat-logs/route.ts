import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CHAT_LOGS_FILE = path.join(process.cwd(), "data", "chat-logs.json");

interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
  type: "user" | "assistant";
}

export async function GET() {
  try {
    const data = await fs.readFile(CHAT_LOGS_FILE, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: ChatMessage[] } = await request.json();

    await fs.mkdir(path.dirname(CHAT_LOGS_FILE), { recursive: true });
    await fs.writeFile(CHAT_LOGS_FILE, JSON.stringify({ messages }, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save chat logs" },
      { status: 500 }
    );
  }
}
