import { Textarea } from "@abhishekbarve/components";
import WritingHelpers from "./WritingHelpers";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setDirection,
  setInstructions,
} from "@/app/reducerSlices/directionInstructionSlice";
import type { RootState } from "@/app/store";
import InstructionGenerator from "./InstructionGenerator";
import DirectionGenerator from "./DirectionGenerator";

function DirectionInstructions() {
  const dispatch = useAppDispatch();
  const { direction, instructions } = useAppSelector(
    (state: RootState) => state.directionInstruction
  );

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
          <DirectionGenerator />

          {/* Instructions Textarea */}
          <InstructionGenerator />
        </div>
      </div>
    </div>
  );
}

export default DirectionInstructions;
