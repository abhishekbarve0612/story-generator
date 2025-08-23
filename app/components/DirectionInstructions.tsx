import { Textarea } from "@abhishekbarve/components";
import WritingHelpers from "./WritingHelpers";

interface DirectionInstructionsProps {
  direction: string;
  instructions: string;
  onDirectionChange: (value: string) => void;
  onInstructionsChange: (value: string) => void;
}

function DirectionInstructions({
  direction,
  instructions,
  onDirectionChange,
  onInstructionsChange,
}: DirectionInstructionsProps) {
  return (
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
              onValueChange={onDirectionChange}
            >
              <Textarea.Field
                className="w-full min-h-[100px] resize-none"
                placeholder="The protagonist discovers a hidden door behind the bookshelf..."
              />
            </Textarea>
            
            <WritingHelpers
              textContent={direction}
              onGenerate={onDirectionChange}
              onImprove={onDirectionChange}
              onClear={() => onDirectionChange("")}
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
              onValueChange={onInstructionsChange}
            >
              <Textarea.Field
                className="w-full min-h-[100px] resize-none"
                placeholder="Write in first person, focus on suspense, include sensory details..."
              />
            </Textarea>
            
            <WritingHelpers
              textContent={instructions}
              onGenerate={onInstructionsChange}
              onImprove={onInstructionsChange}
              onClear={() => onInstructionsChange("")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DirectionInstructions;