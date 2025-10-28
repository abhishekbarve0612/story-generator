"use client";
import { Textarea } from "@abhishekbarve/components";
import WritingHelpers from "./WritingHelpers";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";
import { setCharacterText } from "../reducerSlices/configSlice";
import { addCharacter } from "../reducerSlices/llmResponsesSlice";
import {
  saveFormData,
  loadFormData,
  saveCharacterId,
} from "../../utils/formPersistence";
import { useEffect, useState, useCallback } from "react";

function CharacterGenerator() {
  const dispatch = useAppDispatch();
  const { characterText } = useAppSelector((state: RootState) => state.config);
  const { characters } = useAppSelector(
    (state: RootState) => state.llmResponses
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedText = loadFormData("character");
    if (savedText && savedText !== characterText) {
      dispatch(setCharacterText(savedText));
    }
  }, [dispatch]);

  // Save form data to localStorage whenever characterText changes
  useEffect(() => {
    if (characterText) {
      saveFormData("character", characterText);
    }
  }, [characterText]);

  async function generateCharacter(value: string) {
    if (!value.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Making API call...");
      const response = await fetch("/api/character", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: value }),
      });

      console.log("API response:", response.status);

      if (!response.ok) {
        throw new Error("Failed to generate character");
      }

      const data = await response.json();
      console.log("API data received:", data);

      // Replace textarea content with generated response
      dispatch(setCharacterText(data.text));

      // Save generated character to Redux store and localStorage
      if (data.character) {
        const character = {
          id: data.character.id,
          name: data.character.name,
          description: data.character.description,
          generatedProfile: data.text,
          structuredProfile: data.character.structuredProfile,
          timestamp: Date.now(),
        };

        dispatch(addCharacter(character));
        saveCharacterId(data.character.id);

        console.log("Character saved:", character);
      }
    } catch (err) {
      console.error("Error in generateCharacter:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  }

  return (
    <>
      <Textarea
        name="character"
        value={characterText}
        onValueChange={(value) => dispatch(setCharacterText(value))}
      >
        <Textarea.Field
          className="w-full min-h-[120px] resize-none"
          placeholder="A curious young detective with a sharp wit and mysterious past..."
        />
      </Textarea>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <WritingHelpers
        textContent={characterText}
        onGenerate={generateCharacter}
        onClear={() => {
          dispatch(setCharacterText(""));
          saveFormData("character", "");
        }}
        isLoading={loading}
      />
    </>
  );
}

export default CharacterGenerator;
