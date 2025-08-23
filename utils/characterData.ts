import { promises as fs } from "fs";
import path from "path";
import type { Character } from "./types";

const CHARACTERS_FILE = path.join(process.cwd(), "data", "characters.json");

// Utility to get character profile from JSON file
export async function getCharacterProfile(characterName: string): Promise<string> {
  try {
    const data = await fs.readFile(CHARACTERS_FILE, "utf8");
    const charactersData = JSON.parse(data);
    
    // Find character by name (case-insensitive)
    const character = Object.values(charactersData.characters || {}).find(
      (char: any) => char.name.toLowerCase() === characterName.toLowerCase()
    ) as Character;

    if (character) {
      return `Character: ${character.name}
Description: ${character.description}
Profile: ${character.generatedProfile}`;
    }
  } catch (error) {
    console.warn(`Failed to load character profile for ${characterName}:`, error);
  }

  // Fallback for Narrator or unknown characters
  if (characterName.toLowerCase() === "narrator") {
    return "Character: Narrator - The omniscient storyteller who guides the narrative and provides context.";
  }

  return `Character: ${characterName} - No detailed profile available.`;
}

// Utility to get all characters from JSON file
export async function getAllCharacters(): Promise<Character[]> {
  try {
    const data = await fs.readFile(CHARACTERS_FILE, "utf8");
    const charactersData = JSON.parse(data);
    return Object.values(charactersData.characters || {}) as Character[];
  } catch (error) {
    console.warn("Failed to load characters:", error);
    return [];
  }
}

// Utility to get character names for story context
export async function getCharacterNames(): Promise<string[]> {
  try {
    const characters = await getAllCharacters();
    return characters.map(char => char.name);
  } catch (error) {
    console.warn("Failed to load character names:", error);
    return [];
  }
}