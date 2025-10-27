import { useEffect, useState } from "react";
import {
  ScrollArea,
  Button,
  Accordion,
  Textarea,
} from "@abhishekbarve/components";
import { MdContentCopy, MdDownload, MdClear } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import { setSummary, setChat, clearChat } from "@/app/reducerSlices/chatSlice";
import { loadFormData, saveFormData } from "@/utils/formPersistence";
import StoryProgressionButton from "./StoryProgressionButton";
import SummarizeButton from "./SummarizeButton";

interface StoryProgression {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
  type: "assistant";
}

function Logs() {
  const dispatch = useAppDispatch();
  const { chat, summary } = useAppSelector((state: RootState) => state.chat);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const savedSummary = loadFormData("summary");
    if (savedSummary && savedSummary !== summary) {
      dispatch(setSummary(savedSummary));
    }
  }, []);

  useEffect(() => {
    if (summary) {
      saveFormData("summary", summary);
    }
  }, [summary]);

  useEffect(() => {
    const loadAndSyncStoryProgressions = async () => {
      try {
        const response = await fetch("/api/data/story-progressions");
        if (response.ok) {
          const data = await response.json();
          const progressions = data.storyProgressions || [];

          const chatMessages = progressions.map(
            (progression: StoryProgression) => ({
              id: progression.id,
              role: "assistant" as const,
              content: progression.content,
              speaker: progression.sender,
            })
          );

          dispatch(setChat(chatMessages));
        }
      } catch (error) {
        console.error("Error loading story progressions:", error);
      }
    };

    loadAndSyncStoryProgressions();
  }, []);

  const copyChatToClipboard = async () => {
    try {
      const chatText = chat
        .map((message) => `${message.speaker}: ${message.content}`)
        .join("\n\n");

      await navigator.clipboard.writeText(chatText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy chat:", error);
    }
  };

  const downloadChat = async () => {
    try {
      const response = await fetch("/api/data/story-progressions");
      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `story-chat-${new Date().toISOString().split("T")[0]
          }.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to download chat:", error);
    }
  };

  const clearChatLog = async () => {
    try {
      dispatch(clearChat());

      await fetch("/api/data/story-progressions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyProgressions: [] }),
      });
    } catch (error) {
      console.error("Failed to clear chat:", error);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-shrink-0 border-b border-gray-200">
        <Accordion collapsible className="w-full">
          <Accordion.Item value="context" className="border-none">
            <Accordion.Trigger className="text-left px-4 py-3 transition-colors">
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="font-medium text-sm">Story Context</div>
                  <div className="text-xs text-foreground/30">
                    Summary of the conversation so far
                  </div>
                </div>
              </div>
            </Accordion.Trigger>
            <Accordion.Content className="px-4 pb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <Textarea
                  value={summary}
                  onValueChange={(value) => dispatch(setSummary(value))}
                >
                  <Textarea.Field
                    className="w-full min-h-[100px] resize-none"
                    placeholder="Summary of the conversation so far"
                  />
                </Textarea>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>

      <div className="border border-gray-200 bg-background h-[80vh] relative">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {chat.length > 0 ? (
              chat.map((message) => (
                <div key={message.id} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-foreground/40 bg-gray-100 px-2 py-1 rounded-full after:content-[':']">
                      {message.speaker}
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                    {message.speaker === "Narrator" ? (
                      <em className="text-sm text-gray-800 leading-relaxed">
                        {message.content}
                      </em>
                    ) : (
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {message.content}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 mt-20">
                <p className="text-sm">No messages yet</p>
                <p className="text-xs mt-1">
                  Generated story content will appear here
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={copyChatToClipboard}
            className={`p-2 bg-foreground backdrop-blur-sm hover:bg-background transition-colors ${copySuccess ? "bg-green-100 text-green-600" : ""
              }`}
            title={copySuccess ? "Copied!" : "Copy chat to clipboard"}
          >
            <MdContentCopy className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={downloadChat}
            className="p-2 bg-foreground backdrop-blur-sm hover:bg-background transition-colors"
            title="Download chat as JSON"
          >
            <MdDownload className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={clearChatLog}
            className="p-2 bg-foreground backdrop-blur-sm hover:bg-white hover:text-red-600"
            title="Clear chat log"
          >
            <MdClear className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-foreground">
        <div className="flex justify-center gap-4">
          <StoryProgressionButton />
          <SummarizeButton />
        </div>
      </div>
    </div>
  );
}

export default Logs;
