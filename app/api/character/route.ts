import { generateCharacter } from "@/utils/llm";
import { logLLMResponse } from "@/utils/responseLogger";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Character } from "@/utils/types";
import { consume, ipFromRequest } from "@/lib/rate-limit/staticBudget";

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
      }, {
        headers: headers,
      });
    } catch (saveError) {
      console.error("Error saving character:", saveError);
      return NextResponse.json(result, {
        headers: headers,
      });
    }
  } catch (error) {
    console.error("error", error);
    return NextResponse.json(
      { error: "Failed to generate character" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const characterId = searchParams.get('id');

    if (!characterId) {
      return NextResponse.json(
        { error: "Character ID is required" },
        { status: 400 }
      );
    }

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
    } catch (error) {
      return NextResponse.json(
        { error: "Characters file not found" },
        { status: 404 }
      );
    }

    // Check if character exists
    if (!existingData.characters[characterId]) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    // Remove character from both objects
    delete existingData.characters[characterId];
    existingData.characterIds = existingData.characterIds.filter(id => id !== characterId);

    // Save updated data
    await fs.writeFile(
      CHARACTERS_FILE,
      JSON.stringify(existingData, null, 2)
    );

    console.log(`Character deleted: ${characterId}`);

    return NextResponse.json({ success: true, deletedId: characterId });
  } catch (error) {
    console.error("Error deleting character:", error);
    return NextResponse.json(
      { error: "Failed to delete character" },
      { status: 500 }
    );
  }
}
