import ConfigAccordion from "./ConfigAccordion";
import MessageInput from "./MessageInput";
import DirectionInstructions from "./DirectionInstructions";
import DarkMode from "./DarkMode";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setCharacterText,
  setLore,
  setScenario,
  setMessage,
  setSelectedCharacter,
} from "@/app/reducerSlices/configSlice";
import type { RootState } from "@/app/store";

function ConfigPanel() {
  const dispatch = useAppDispatch();
  const { characterText, lore, scenario, message, selectedCharacter } =
    useAppSelector((state: RootState) => state.config);

  return (
    <div className="w-full p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground/80">
          Story Configuration
        </h1>
        <DarkMode />
      </div>

      <ConfigAccordion
        characterText={characterText}
        lore={lore}
        scenario={scenario}
        onCharacterChange={(value) => dispatch(setCharacterText(value))}
        onLoreChange={(value) => dispatch(setLore(value))}
        onScenarioChange={(value) => dispatch(setScenario(value))}
      />

      <MessageInput
        message={message}
        selectedCharacter={selectedCharacter}
        onMessageChange={(value) => dispatch(setMessage(value))}
        onCharacterSelect={(value) => dispatch(setSelectedCharacter(value))}
      />

      <DirectionInstructions />
    </div>
  );
}

export default ConfigPanel;
