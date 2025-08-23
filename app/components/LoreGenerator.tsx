"use client";
import { Textarea } from "@abhishekbarve/components";
import WritingHelpers from "./WritingHelpers";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";
import { setLore as setLoreConfig } from "../reducerSlices/configSlice";
import { setLore } from "../reducerSlices/llmResponsesSlice";
import {
  saveFormData,
  loadFormData,
} from "../../utils/formPersistence";
import { useEffect, useState, useCallback } from "react";

function LoreGenerator() {
  const dispatch = useAppDispatch();
  const { lore } = useAppSelector((state: RootState) => state.config);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedText = loadFormData("lore");
    if (savedText && savedText !== lore) {
      dispatch(setLoreConfig(savedText));
    }
  }, [dispatch]);

  useEffect(() => {
    if (lore) {
      saveFormData("lore", lore);
    }
  }, [lore]);

  async function generateLore(value: string) {
    if (!value.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Making API call...");
      const response = await fetch("/api/lore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: value }),
      });

      console.log("API response:", response.status);

      if (!response.ok) {
        throw new Error("Failed to generate lore");
      }

      const data = await response.json();
      console.log("API data received:", data);

      // Replace textarea content with generated response
      dispatch(setLoreConfig(data.text));
      
      // Save generated lore to Redux store
      dispatch(setLore(data.text));
    } catch (err) {
      console.error("Error in generateLore:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  }

  return (
    <>
      <Textarea
        name="lore"
        value={lore}
        onValueChange={(value) => dispatch(setLoreConfig(value))}
      >
        <Textarea.Field
          className="w-full min-h-[120px] resize-none"
          placeholder="A curious young detective with a sharp wit and mysterious past..."
        />
      </Textarea>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <WritingHelpers
        textContent={lore}
        onGenerate={generateLore}
        onClear={() => {
          dispatch(setLoreConfig(""));
          saveFormData("lore", "");
        }}
        isLoading={loading}
      />
    </>
  );
}

export default LoreGenerator;
