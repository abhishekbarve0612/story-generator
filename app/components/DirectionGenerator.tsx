"use client";
import { useEffect, useState } from "react";
import { Textarea } from "@abhishekbarve/components";
import WritingHelpers from "@/app/components/WritingHelpers";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import { setDirection as setDirectionConfig } from "@/app/reducerSlices/directionInstructionSlice";
import { setDirections } from "@/app/reducerSlices/llmResponsesSlice";
import { saveFormData, loadFormData } from "@/utils/formPersistence";

function DirectionGenerator() {
  const dispatch = useAppDispatch();
  const { direction } = useAppSelector(
    (state: RootState) => state.directionInstruction
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedText = loadFormData("directions");
    if (savedText && savedText !== direction) {
      dispatch(setDirectionConfig(savedText));
    }
  }, [dispatch]);

  useEffect(() => {
    if (direction) {
      saveFormData("direction", direction);
    }
  }, [direction]);

  async function generateDirection(value: string) {
    if (!value.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Making API call...");
      const response = await fetch("/api/direction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: value }),
      });

      console.log("API response:", response.status);

      if (!response.ok) {
        throw new Error("Failed to generate direction");
      }

      const data = await response.json();
      console.log("API data received:", data);

      // Replace textarea content with generated response
      dispatch(setDirectionConfig(data.text));

      // Save generated instructions to Redux store
      dispatch(setDirections(data.text));
    } catch (err) {
      console.error("Error in generateDirection:", err);
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
          Story Direction
        </label>
        <p className="text-xs text-gray-500 mb-2">
          What happens next? Describe plot developments, events, or story
          progression.
        </p>
      </div>

      <Textarea
        name="direction"
        value={direction}
        onValueChange={(value) => dispatch(setDirectionConfig(value))}
      >
        <Textarea.Field
          className="w-full min-h-[100px] resize-none"
          placeholder="The protagonist discovers a hidden door behind the bookshelf..."
        />
      </Textarea>

      <WritingHelpers
        textContent={direction}
        onGenerate={generateDirection}
        onClear={() => dispatch(setDirectionConfig(""))}
      />
    </div>
  );
}

export default DirectionGenerator;
