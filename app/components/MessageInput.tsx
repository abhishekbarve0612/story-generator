import { Textarea, Button, Badge } from "@abhishekbarve/components";
import { MdSend } from "react-icons/md";
import WritingHelpers from "./WritingHelpers";

interface MessageInputProps {
  message: string;
  characters: string[];
  selectedCharacter: string;
  onMessageChange: (value: string) => void;
  onCharacterSelect: (character: string) => void;
}

function MessageInput({
  message,
  characters,
  selectedCharacter,
  onMessageChange,
  onCharacterSelect,
}: MessageInputProps) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Send Message as
          </h2>

          {characters.length > 0 && (
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium text-gray-700 sr-only">
                Select Character:
              </label>
              <div className="flex flex-wrap gap-2">
                {characters.map((char, index) => (
                  <Badge
                    key={index}
                    variant={selectedCharacter === char ? "default" : "secondary"}
                    className="cursor-pointer transition-colors"
                    onClick={() => onCharacterSelect(selectedCharacter === char ? "" : char)}
                  >
                    {char}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-600 mb-4">
            Write a message from the perspective of {selectedCharacter} to continue the story.
          </p>
        </div>

        <Textarea
          name="message"
          value={message}
          onValueChange={onMessageChange}
        >
          <Textarea.Field
            className="w-full min-h-[100px] resize-none"
            placeholder="Type your message here..."
          />
        </Textarea>

        <div className="flex justify-end gap-2">
          <WritingHelpers
            textContent={message}
            onGenerate={onMessageChange}
            onImprove={onMessageChange}
            onClear={() => onMessageChange("")}
          />
          <Button className="min-w-[120px]" disabled={!message.trim()}>
            <MdSend className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MessageInput;