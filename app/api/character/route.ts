import { generateCharacter } from "@/utils/llm";
import { logLLMResponse } from "@/utils/responseLogger";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Character } from "@/utils/types";

const CHARACTERS_FILE = path.join(process.cwd(), "data", "characters.json");

// Helper function to extract character name from generated content
function extractCharacterName(generatedText: string): string {
  // Look for common patterns like "Name: John", "Character: Sarah", etc.
  const namePatterns = [
    /Name:\s*<([^>]+)>/i, // Priority pattern: Name: <....>
    /Name:\s*([^\n,]+)/i,
    /Character:\s*([^\n,]+)/i,
    /^([A-Z][a-zA-Z\s]+)(?:\s*[-–—]|\s*:|\s*is|\s*was)/m,
    /\*\*Name:\*\*\s*([^\n,]+)/i,
    /\*\*([A-Z][a-zA-Z\s]+)\*\*/,
  ];

  for (const pattern of namePatterns) {
    const match = generatedText.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // If no name found, extract first capitalized word/phrase
  const firstLineMatch = generatedText.match(/^([A-Z][a-zA-Z\s]{1,30})/);
  if (firstLineMatch) {
    return firstLineMatch[1].trim();
  }

  return "Unnamed Character";
}

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const result = await generateCharacter(description);

    // Save the generated character to JSON file
    try {
      const characterId = `char_${Date.now()}`;
      const extractedName = extractCharacterName(result.text);

      const character: Character = {
        id: characterId,
        name: extractedName,
        description: description,
        generatedProfile: result.text,
        timestamp: Date.now(),
      };

      let existingData: {
        characters: Record<string, Character>;
        characterIds: string[];
      } = {
        characters: {},
        characterIds: [],
      };

      try {
        const data = await fs.readFile(CHARACTERS_FILE, "utf8");
        existingData = JSON.parse(data);
        // Ensure characterIds array exists
        if (!existingData.characterIds) {
          existingData.characterIds = [];
        }
      } catch (error) {
        console.log("Creating new characters file");
      }

      existingData.characters[characterId] = character;
      existingData.characterIds.push(characterId);

      await fs.mkdir(path.dirname(CHARACTERS_FILE), { recursive: true });
      await fs.writeFile(
        CHARACTERS_FILE,
        JSON.stringify(existingData, null, 2)
      );

      console.log(`Character saved to ${CHARACTERS_FILE}:`, {
        id: characterId,
        name: extractedName,
      });

      try {
        await logLLMResponse("character", { description }, result);
      } catch (logError) {
        console.error("Error logging character response:", logError);
      }

      // Return the character data along with the text
      return NextResponse.json({
        ...result,
        character: {
          id: characterId,
          name: extractedName,
          description: description,
        },
      });
    } catch (saveError) {
      console.error("Error saving character:", saveError);
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("error", error);
    return NextResponse.json(
      { error: "Failed to generate character" },
      { status: 500 }
    );
  }
}
