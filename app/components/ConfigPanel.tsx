import { Form } from "@abhishekbarve/components";
import { useState } from "react";
import ConfigAccordion from "./ConfigAccordion";
import MessageInput from "./MessageInput";
import DirectionInstructions from "./DirectionInstructions";

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
    <div className="w-full p-6 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Story Configuration
      </h1>

      <Form>
        <ConfigAccordion
          characterText={characterText}
          lore={lore}
          scenario={scenario}
          onCharacterChange={setCharacterText}
          onLoreChange={setLore}
          onScenarioChange={setScenario}
        />
      </Form>

      <MessageInput
        message={message}
        characters={characters}
        selectedCharacter={selectedCharacter}
        onMessageChange={setMessage}
        onCharacterSelect={setSelectedCharacter}
      />

      <DirectionInstructions
        direction={direction}
        instructions={instructions}
        onDirectionChange={setDirection}
        onInstructionsChange={setInstructions}
      />
    </div>
  );
}

export default ConfigPanel;
