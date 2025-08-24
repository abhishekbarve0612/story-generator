"use client";
import { useEffect, useState } from "react";
import { Textarea } from "@abhishekbarve/components";
import WritingHelpers from "@/app/components/WritingHelpers";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import { setDirection as setDirectionConfig } from "@/app/reducerSlices/directionInstructionSlice";
import { setDirections } from "@/app/reducerSlices/llmResponsesSlice";
import { saveFormData, loadFormData } from "@/utils/formPersistence";
import { MdSend } from "react-icons/md";
import StoryProgressionButton from "./StoryProgressionButton";
import { setMessage } from "../reducerSlices/configSlice";

function MessageGenerator() {
  const dispatch = useAppDispatch();
  const { direction } = useAppSelector(
    (state: RootState) => state.directionInstruction
  );
  const { message, selectedCharacter } = useAppSelector(
    (state: RootState) => state.config
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedText = loadFormData("message");
    if (savedText && savedText !== message) {
      dispatch(setMessage(savedText));
    }
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      saveFormData("message", message);
    }
  }, [message]);

  async function generateMessage(value: string) {
    if (!value.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Making API call...");
      const response = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: value, sender: selectedCharacter }),
      });

      console.log("API response:", response.status);

      if (!response.ok) {
        throw new Error("Failed to generate message");
      }

      const data = await response.json();
      console.log("API data received:", data);

      // Replace textarea content with generated response
      dispatch(setMessage(data.text));

      // Save generated instructions to Redux store
      dispatch(setDirections(data.text));
    } catch (err) {
      console.error("Error in generateMessage:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  }

  return (
    <>
      <Textarea
        name="message"
        value={message}
        onValueChange={(value) => dispatch(setMessage(value))}
      >
        <Textarea.Field
          className="w-full min-h-[100px] resize-none"
          placeholder="Type your message here..."
        />
      </Textarea>

      <div className="flex justify-end gap-2">
        <WritingHelpers
          textContent={message}
          onGenerate={generateMessage}
          onClear={() => dispatch(setMessage(""))}
        />
        <StoryProgressionButton
          label="Send Message"
          isDisabled={!message.trim()}
          icon={<MdSend className="w-4 h-4" />}
        />
      </div>
    </>
  );
}

export default MessageGenerator;
