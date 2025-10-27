import { Accordion, Textarea } from "@abhishekbarve/components";
import WritingHelpers from "./WritingHelpers";
import CharacterGenerator from "./CharacterGenerator";
import LoreGenerator from "./LoreGenerator";
import ScenarioGenerator from "./ScenarioGenerator";

interface ConfigAccordionProps {
  characterText: string;
  lore: string;
  scenario: string;
  onCharacterChange: (value: string) => void;
  onLoreChange: (value: string) => void;
  onScenarioChange: (value: string) => void;
}

function ConfigAccordion({
  characterText,
  lore,
  scenario,
  onCharacterChange,
  onLoreChange,
  onScenarioChange,
}: ConfigAccordionProps) {
  return (
    <Accordion multiple defaultValue={["character"]} className="w-full">
      <Accordion.Item value="character">
        <Accordion.Trigger className="text-left">
          <div>
            <div className="font-medium">Character</div>
            <div className="text-sm text-foreground/40">
              Describe your next character - their personality, background, and
              key traits.
            </div>
          </div>
        </Accordion.Trigger>
        <Accordion.Content className="space-y-3">
          <CharacterGenerator />
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="lore">
        <Accordion.Trigger className="text-left">
          <div>
            <div className="font-medium">Lore & Plot</div>
            <div className="text-sm text-foreground/40">
              Set the world and story context - the setting, background lore,
              and plot elements.
            </div>
          </div>
        </Accordion.Trigger>
        <Accordion.Content className="space-y-3">
          <LoreGenerator />
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="scenario">
        <Accordion.Trigger className="text-left">
          <div>
            <div className="font-medium">Scenario Beginning</div>
            <div className="text-sm text-foreground/40">
              Write the opening scene or situation that starts your story.
            </div>
          </div>
        </Accordion.Trigger>
        <Accordion.Content className="space-y-3">
          <ScenarioGenerator />
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

export default ConfigAccordion;
