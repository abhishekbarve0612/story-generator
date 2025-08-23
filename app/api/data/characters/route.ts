import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CHARACTERS_FILE = path.join(process.cwd(), "data", "characters.json");

interface Character {
  name: string;
  description: string;
  generatedProfile: string;
  timestamp: number;
  tags?: string[];
}

export async function GET() {
  try {
    const data = await fs.readFile(CHARACTERS_FILE, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ characters: {} });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { character }: { character: Character } = await request.json();

    let existingData: { characters: Record<string, Character> } = {
      characters: {},
    };
    try {
      const data = await fs.readFile(CHARACTERS_FILE, "utf8");
      existingData = JSON.parse(data);
    } catch (error) {
      console.error("Error reading characters file:", error);
    }

    existingData.characters[character.name] = character;

    await fs.mkdir(path.dirname(CHARACTERS_FILE), { recursive: true });
    await fs.writeFile(CHARACTERS_FILE, JSON.stringify(existingData, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save character" },
      { status: 500 }
    );
  }
}
