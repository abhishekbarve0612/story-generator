"use client";
import { Textarea } from "@abhishekbarve/components";
import WritingHelpers from "./WritingHelpers";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";
import { setScenario as setScenarioConfig } from "../reducerSlices/configSlice";
import { setScenario } from "../reducerSlices/llmResponsesSlice";
import { saveFormData, loadFormData } from "../../utils/formPersistence";
import { useEffect, useState, useCallback } from "react";

function ScenarioGenerator() {
  const dispatch = useAppDispatch();
  const { scenario } = useAppSelector((state: RootState) => state.config);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedText = loadFormData("scenario");
    if (savedText && savedText !== scenario) {
      dispatch(setScenarioConfig(savedText));
    }
  }, [dispatch]);

  useEffect(() => {
    if (scenario) {
      saveFormData("scenario", scenario);
    }
  }, [scenario]);

  async function generateScenario(value: string) {
    if (!value.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Making API call...");
      const response = await fetch("/api/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: value }),
      });

      console.log("API response:", response.status);

      if (!response.ok) {
        throw new Error("Failed to generate scenario");
      }

      const data = await response.json();
      console.log("API data received:", data);

      // Replace textarea content with generated response
      dispatch(setScenarioConfig(data.text));

      // Save generated scenario to Redux store
      dispatch(setScenario(data.text));
    } catch (err) {
      console.error("Error in generateScenario:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  }

  return (
    <>
      <Textarea
        name="scenario"
        value={scenario}
        onValueChange={(value) => dispatch(setScenarioConfig(value))}
      >
        <Textarea.Field
          className="w-full min-h-[120px] resize-none"
          placeholder="A curious young detective with a sharp wit and mysterious past..."
        />
      </Textarea>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <WritingHelpers
        textContent={scenario}
        onGenerate={generateScenario}
        onClear={() => {
          dispatch(setScenarioConfig(""));
          saveFormData("scenario", "");
        }}
        isLoading={loading}
      />
    </>
  );
}

export default ScenarioGenerator;
