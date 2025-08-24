import { Textarea, Button, Badge } from "@abhishekbarve/components";
import { MdSend } from "react-icons/md";
import WritingHelpers from "./WritingHelpers";
import { useEffect, useState } from "react";
import { getCharacterIds } from "../../utils/formPersistence";
import { useAppSelector } from "../hooks";
import { RootState } from "../store";
import StoryProgressionButton from "./StoryProgressionButton";
import MessageGenerator from "./MessageGenerator";

interface MessageInputProps {
  message: string;
  selectedCharacter: string;
  onMessageChange: (value: string) => void;
  onCharacterSelect: (character: string) => void;
}

function MessageInput({
  message,
  selectedCharacter,
  onMessageChange,
  onCharacterSelect,
}: MessageInputProps) {
  const [characters, setCharacters] = useState<string[]>(["Narrator"]);
  const { characters: reduxCharacters } = useAppSelector(
    (state: RootState) => state.llmResponses
  );

  // Load characters from localStorage, JSON file, and Redux store
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const characterIds = getCharacterIds();
        const characterNamesFromStorage: string[] = [];

        if (characterIds.length > 0) {
          const response = await fetch("/api/data/characters");
          if (response.ok) {
            const data = await response.json();
            const namesFromAPI = characterIds
              .map((id) => data.characters?.[id]?.name)
              .filter(Boolean);
            characterNamesFromStorage.push(...namesFromAPI);
          }
        }

        const characterNamesFromRedux = Object.values(reduxCharacters).map(
          (char) => char.name
        );

        // Combine all character names, remove duplicates
        const allCharacterNames = [
          ...new Set([
            ...characterNamesFromStorage,
            ...characterNamesFromRedux,
          ]),
        ];

        setCharacters(["Narrator", ...allCharacterNames]);
      } catch (error) {
        console.error("Error loading characters:", error);
      }
    };

    loadCharacters();
  }, [reduxCharacters]);

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Send Message as
          </h2>

          <div className="space-y-2 mb-4">
            <label className="text-sm font-medium text-gray-700 sr-only">
              Select Character:
            </label>
            <div className="flex flex-wrap gap-2">
              {characters.map((char, index) => (
                <Badge
                  key={index}
                  variant={selectedCharacter === char ? "default" : "secondary"}
                  className="cursor-pointer transition-colors"
                  onClick={() =>
                    onCharacterSelect(selectedCharacter === char ? "" : char)
                  }
                >
                  {char}
                </Badge>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Write a message from the perspective of {selectedCharacter} to
            continue the story.
          </p>
        </div>
        <MessageGenerator />
      </div>
    </div>
  );
}

export default MessageInput;
