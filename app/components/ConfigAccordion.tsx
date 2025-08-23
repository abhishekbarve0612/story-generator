import { Accordion, Textarea } from "@abhishekbarve/components";
import WritingHelpers from "./WritingHelpers";
import CharacterGenerator from "./CharacterGenerator";

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
            <div className="text-sm text-gray-600">
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
            <div className="text-sm text-gray-600">
              Set the world and story context - the setting, background lore,
              and plot elements.
            </div>
          </div>
        </Accordion.Trigger>
        <Accordion.Content className="space-y-3">
          <Textarea name="lore" value={lore} onValueChange={onLoreChange}>
            <Textarea.Field
              className="w-full min-h-[120px] resize-none"
              placeholder="In a Victorian-era city where magic is hidden beneath the surface..."
            />
          </Textarea>
          <WritingHelpers
            textContent={lore}
            onGenerate={onLoreChange}
            onClear={() => onLoreChange("")}
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
            onValueChange={onScenarioChange}
          >
            <Textarea.Field
              className="w-full min-h-[120px] resize-none"
              placeholder="The fog was thick that evening when a mysterious letter arrived..."
            />
          </Textarea>
          <WritingHelpers
            textContent={scenario}
            onGenerate={onScenarioChange}
            onClear={() => onScenarioChange("")}
          />
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

export default ConfigAccordion;
