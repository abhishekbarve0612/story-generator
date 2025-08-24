import { Button } from "@abhishekbarve/components";
import { MdAutoAwesome } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useState } from "react";
import { RootState } from "../store";
import { addMessage } from "../reducerSlices/chatSlice";

interface Props {
  label?: string;
  isDisabled?: boolean;
  icon?: React.ReactNode;
}

function StoryProgressionButton({
  label = "Generate Next Message",
  isDisabled = false,
  icon = <MdAutoAwesome className="w-5 h-5 mr-2" />,
}: Props) {
  const dispatch = useAppDispatch();
  const { chat, summary } = useAppSelector((state: RootState) => state.chat);
  const { selectedCharacter, message } = useAppSelector(
    (state: RootState) => state.config
  );
  const { direction, instructions } = useAppSelector(
    (state: RootState) => state.directionInstruction
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateStoryProgression() {
    setLoading(true);
    setError(null);

    try {
      console.log("Making API call...");
      const conversation = chat.map((message) => ({
        role: message.role,
        content: message.content,
      }));
      const response = await fetch("/api/story-progression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation,
          summary,
          direction,
          instructions,
          selectedCharacter,
          message,
        }),
      });

      console.log("API response:", response.status);

      if (!response.ok) {
        throw new Error("Failed to generate story progression");
      }

      const data = await response.json();
      console.log("API data received:", data);

      // Replace textarea content with generated response
      dispatch(
        addMessage({
          role: "assistant",
          content: data.text,
          speaker: selectedCharacter,
          id: data.id,
        })
      );
    } catch (err) {
      console.error("Error in generateSummary:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  }

  return (
    <Button
      size="md"
      className="min-w-[200px]"
      onClick={generateStoryProgression}
      disabled={isDisabled}
    >
      {label}
      {icon}
    </Button>
  );
}

export default StoryProgressionButton;
