import {
  ScrollArea,
  Button,
  Accordion,
  Textarea,
} from "@abhishekbarve/components";
import { MdAutoAwesome, MdSummarize } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../store";
import { setSummary } from "../reducerSlices/chatSlice";
import { useEffect } from "react";
import { loadFormData, saveFormData } from "@/utils/formPersistence";
import StoryProgressionButton from "./StoryProgressionButton";
import SummarizeButton from "./SummarizeButton";

function Logs() {
  const dispatch = useAppDispatch();
  const { chat, summary } = useAppSelector((state: RootState) => state.chat);

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

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-shrink-0 border-b border-gray-200">
        <Accordion collapsible className="w-full">
          <Accordion.Item value="context" className="border-none">
            <Accordion.Trigger className="text-left px-4 py-3 hover:bg-gray-50">
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="font-medium text-sm">Story Context</div>
                  <div className="text-xs text-gray-500">
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

      <div className="border border-gray-200 bg-gray-50 h-[80vh]">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {chat.length > 0 ? (
              chat.map((message) => (
                <div key={message.id} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full after:content-[':']">
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
      </div>

      {/* Generate Button Section - Bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex justify-center gap-4">
          <StoryProgressionButton />
          <SummarizeButton />
        </div>
      </div>
    </div>
  );
}

export default Logs;
