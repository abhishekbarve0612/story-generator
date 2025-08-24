import { Button } from "@abhishekbarve/components";
import { MdSummarize } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useState } from "react";
import { RootState } from "../store";
import { setSummary } from "../reducerSlices/chatSlice";

function SummarizeButton() {
  const dispatch = useAppDispatch();
  const { summary, chat } = useAppSelector((state: RootState) => state.chat);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateSummary() {
    setLoading(true);
    setError(null);

    try {
      console.log("Making API call...");
      const chatHistory = chat.map((message) => ({
        role: message.role,
        content: message.content,
      }));
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatHistory }),
      });

      console.log("API response:", response.status);

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      console.log("API data received:", data);

      // Replace textarea content with generated response
      dispatch(setSummary(data.text));
    } catch (err) {
      console.error("Error in generateSummary:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  }

  return (
    <Button size="md" className="min-w-[200px]" onClick={generateSummary}>
      <MdSummarize className="w-5 h-5 mr-2" />
      Summarize Story
    </Button>
  );
}

export default SummarizeButton;
