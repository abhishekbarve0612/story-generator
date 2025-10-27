import { Textarea, Button, Badge } from "@abhishekbarve/components";
import { MdSend, MdClose } from "react-icons/md";
import WritingHelpers from "./WritingHelpers";
import { useEffect, useState } from "react";
import {
  getCharacterIds,
  removeCharacterId,
} from "../../utils/formPersistence";
import { useAppSelector, useAppDispatch } from "../hooks";
import { RootState } from "../store";
import { deleteCharacter } from "../reducerSlices/llmResponsesSlice";
import StoryProgressionButton from "./StoryProgressionButton";
import MessageGenerator from "./MessageGenerator";

interface Character {
  id: string;
  name: string;
  isDeletable: boolean;
}

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
  const [characters, setCharacters] = useState<Array<Character>>([
    { id: "narrator", name: "Narrator", isDeletable: false },
  ]);
  const { characters: reduxCharacters } = useAppSelector(
    (state: RootState) => state.llmResponses
  );
  const dispatch = useAppDispatch();

  // Load characters from localStorage, JSON file, and Redux store
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const characterIds = getCharacterIds();
        const charactersFromStorage: Array<Character> = [];

        if (characterIds.length > 0) {
          const response = await fetch("/api/data/characters");
          if (response.ok) {
            const data = await response.json();
            const charactersFromAPI = characterIds
              .map((id) => ({
                id,
                name: data.characters?.[id]?.name,
                isDeletable: true,
              }))
              .filter((char) => char.name);
            charactersFromStorage.push(...charactersFromAPI);
          }
        }

        const charactersFromRedux = Object.values(reduxCharacters).map(
          (char) => ({
            id: char.id,
            name: char.name,
            isDeletable: true,
          })
        );

        // Combine all characters, remove duplicates by ID
        const allCharacters = [
          { id: "narrator", name: "Narrator", isDeletable: false },
          ...charactersFromStorage,
          ...charactersFromRedux.filter(
            (reduxChar) =>
              !charactersFromStorage.some(
                (storageChar) => storageChar.id === reduxChar.id
              )
          ),
        ];

        setCharacters(allCharacters);
      } catch (error) {
        console.error("Error loading characters:", error);
      }
    };

    loadCharacters();
  }, [reduxCharacters]);

  const handleDeleteCharacter = async (
    characterId: string,
    characterName: string
  ) => {
    try {
      const response = await fetch(`/api/character?id=${characterId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch(deleteCharacter(characterId));

        removeCharacterId(characterId);

        if (selectedCharacter === characterName) {
          onCharacterSelect("");
        }

        setCharacters((prev) => prev.filter((char) => char.id !== characterId));
      } else {
        console.error("Failed to delete character");
      }
    } catch (error) {
      console.error("Error deleting character:", error);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-foreground/80 mb-2">
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
                  variant={
                    selectedCharacter === char.name ? "default" : "secondary"
                  }
                  className="cursor-pointer transition-colors flex items-center gap-1"
                  onClick={() =>
                    onCharacterSelect(
                      selectedCharacter === char.name ? "" : char.name
                    )
                  }
                >
                  <span>{char.name}</span>
                  {char.isDeletable && (
                    <MdClose
                      className="w-3 h-3 hover:text-red-500 ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCharacter(char.id, char.name);
                      }}
                    />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <p className="text-sm text-foreground/40 mb-4">
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
