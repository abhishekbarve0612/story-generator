import {
  Form,
  Textarea,
  Button,
  Accordion,
  Badge,
} from "@abhishekbarve/components";
import { useState } from "react";
import { MdAutoFixHigh, MdClear, MdRefresh, MdSend } from "react-icons/md";
import WritingHelpers from "./WritingHelpers";

function ConfigPanel() {
  const [characters, setCharacters] = useState([
    "Nora",
    "John",
    "Jane",
    "Jim",
    "Jill",
  ]);
  const [characterText, setCharacterText] = useState("");
  const [lore, setLore] = useState("");
  const [scenario, setScenario] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState("the character");
  const [direction, setDirection] = useState("");
  const [instructions, setInstructions] = useState("");

  return (
    <div className="w-full h-full p-6 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Story Configuration
      </h1>

      <Form>
        <Accordion multiple defaultValue={["character"]} className="w-full">
          <Accordion.Item value="character">
            <Accordion.Trigger className="text-left">
              <div>
                <div className="font-medium">Character</div>
                <div className="text-sm text-gray-600">
                  Describe your next character - their personality, background,
                  and key traits.
                </div>
              </div>
            </Accordion.Trigger>
            <Accordion.Content className="space-y-3">
              <Textarea
                name="character"
                value={characterText}
                onValueChange={(value) => setCharacterText(value)}
              >
                <Textarea.Field
                  className="w-full min-h-[120px] resize-none"
                  placeholder="A curious young detective with a sharp wit and mysterious past..."
                />
              </Textarea>
              <WritingHelpers
                textContent={characterText}
                onGenerate={setCharacterText}
                onImprove={setCharacterText}
                onClear={() => setCharacterText("")}
              />
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="lore">
            <Accordion.Trigger className="text-left">
              <div>
                <div className="font-medium">Lore & Plot</div>
                <div className="text-sm text-gray-600">
                  Set the world and story context - the setting, background
                  lore, and plot elements.
                </div>
              </div>
            </Accordion.Trigger>
            <Accordion.Content className="space-y-3">
              <Textarea
                name="lore"
                value={lore}
                onValueChange={(value) => setLore(value)}
              >
                <Textarea.Field
                  className="w-full min-h-[120px] resize-none"
                  placeholder="In a Victorian-era city where magic is hidden beneath the surface..."
                />
              </Textarea>
              <WritingHelpers
                textContent={lore}
                onGenerate={setLore}
                onImprove={setLore}
                onClear={() => setLore("")}
              />
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="scenario">
            <Accordion.Trigger className="text-left">
              <div>
                <div className="font-medium">Scenario Beginning</div>
                <div className="text-sm text-gray-600">
                  Write the opening scene or situation that starts your story.
                </div>
              </div>
            </Accordion.Trigger>
            <Accordion.Content className="space-y-3">
              <Textarea
                name="scenario"
                value={scenario}
                onValueChange={(value) => setScenario(value)}
              >
                <Textarea.Field
                  className="w-full min-h-[120px] resize-none"
                  placeholder="The fog was thick that evening when a mysterious letter arrived..."
                />
              </Textarea>
              <WritingHelpers
                textContent={scenario}
                onGenerate={setScenario}
                onImprove={setScenario}
                onClear={() => setScenario("")}
              />
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </Form>

      {/* Message Input Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Send Message as
            </h2>

            {/* Character Selection Badges */}
            {characters.length > 0 && (
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium text-gray-700 sr-only">
                  Select Character:
                </label>
                <div className="flex flex-wrap gap-2">
                  {characters.map((char, index) => (
                    <Badge
                      key={index}
                      variant={
                        selectedCharacter === char ? "default" : "secondary"
                      }
                      className="cursor-pointer transition-colors"
                      onClick={() =>
                        setSelectedCharacter(
                          selectedCharacter === char ? "" : char
                        )
                      }
                    >
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <p className="text-sm text-gray-600 mb-4">
              Write a message from the perspective of {selectedCharacter} to
              continue the story.
            </p>
          </div>

          <Textarea
            name="message"
            value={message}
            onValueChange={(value) => setMessage(value)}
          >
            <Textarea.Field
              className="w-full min-h-[100px] resize-none"
              placeholder="Type your message here..."
            />
          </Textarea>

          {/* Send Button */}
          <div className="flex justify-end gap-2">
            <WritingHelpers
              textContent={message}
              onGenerate={setMessage}
              onImprove={setMessage}
              onClear={() => setMessage("")}
            />
            <Button className="min-w-[120px]" disabled={!message.trim()}>
              <MdSend className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </div>

      {/* Direction and Instructions Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Story Direction & Instructions
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Guide the story development and provide writing instructions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Direction Textarea */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Story Direction
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  What happens next? Describe plot developments, events, or story progression.
                </p>
              </div>
              
              <Textarea
                name="direction"
                value={direction}
                onValueChange={(value) => setDirection(value)}
              >
                <Textarea.Field
                  className="w-full min-h-[100px] resize-none"
                  placeholder="The protagonist discovers a hidden door behind the bookshelf..."
                />
              </Textarea>
              
              <WritingHelpers
                textContent={direction}
                onGenerate={setDirection}
                onImprove={setDirection}
                onClear={() => setDirection("")}
              />
            </div>

            {/* Instructions Textarea */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Writing Instructions
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  How should it be written? Tone, style, focus points, or specific requirements.
                </p>
              </div>
              
              <Textarea
                name="instructions"
                value={instructions}
                onValueChange={(value) => setInstructions(value)}
              >
                <Textarea.Field
                  className="w-full min-h-[100px] resize-none"
                  placeholder="Write in first person, focus on suspense, include sensory details..."
                />
              </Textarea>
              
              <WritingHelpers
                textContent={instructions}
                onGenerate={setInstructions}
                onImprove={setInstructions}
                onClear={() => setInstructions("")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigPanel;
