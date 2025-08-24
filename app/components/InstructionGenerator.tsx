"use client";
import { useEffect, useState } from "react";
import { Textarea } from "@abhishekbarve/components";
import WritingHelpers from "@/app/components/WritingHelpers";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import { setInstructions as setInstructionsConfig } from "@/app/reducerSlices/directionInstructionSlice";
import { setInstructions } from "@/app/reducerSlices/llmResponsesSlice";
import { saveFormData, loadFormData } from "@/utils/formPersistence";

function InstructionGenerator() {
  const dispatch = useAppDispatch();
  const { instructions } = useAppSelector(
    (state: RootState) => state.directionInstruction
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedText = loadFormData("instructions");
    if (savedText && savedText !== instructions) {
      dispatch(setInstructionsConfig(savedText));
    }
  }, [dispatch]);

  useEffect(() => {
    if (instructions) {
      saveFormData("instructions", instructions);
    }
  }, [instructions]);

  async function generateInstructions(value: string) {
    if (!value.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Making API call...");
      const response = await fetch("/api/instruction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: value }),
      });

      console.log("API response:", response.status);

      if (!response.ok) {
        throw new Error("Failed to generate instructions");
      }

      const data = await response.json();
      console.log("API data received:", data);

      // Replace textarea content with generated response
      dispatch(setInstructionsConfig(data.text));

      // Save generated instructions to Redux store
      dispatch(setInstructions(data.text));
    } catch (err) {
      console.error("Error in generateInstructions:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Writing Instructions
        </label>
        <p className="text-xs text-gray-500 mb-2">
          How should it be written? Tone, style, focus points, or specific
          requirements.
        </p>
      </div>

      <Textarea
        name="instructions"
        value={instructions}
        onValueChange={(value) => dispatch(setInstructionsConfig(value))}
      >
        <Textarea.Field
          className="w-full min-h-[100px] resize-none"
          placeholder="Write in first person, focus on suspense, include sensory details..."
        />
      </Textarea>

      <WritingHelpers
        textContent={instructions}
        onGenerate={generateInstructions}
        onClear={() => dispatch(setInstructionsConfig(""))}
      />
    </div>
  );
}

export default InstructionGenerator;
