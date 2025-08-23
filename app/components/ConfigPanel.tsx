import { Form, Textarea, Button } from "@abhishekbarve/components";
import { useState } from "react";
import { MdAutoFixHigh, MdClear, MdRefresh } from "react-icons/md";

function ConfigPanel() {
  const [character, setCharacter] = useState("");
  const [lore, setLore] = useState("");
  const [scenario, setScenario] = useState("");

  return (
    <div className="w-full h-full p-6 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Story Configuration
      </h1>

      <Form className="space-y-8">
        <div className="space-y-3">
          <Textarea
            name="character"
            value={character}
            onValueChange={(value) => setCharacter(value)}
          >
            <Textarea.Label>Character</Textarea.Label>
            <Textarea.Description>
              Describe your main character - their personality, background, and
              key traits.
            </Textarea.Description>
            <Textarea.Field
              className="w-full min-h-[120px] resize-none"
              placeholder="A curious young detective with a sharp wit and mysterious past..."
            />
          </Textarea>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm">
              <MdRefresh className="w-4 h-4 inline-block" />
              Generate
            </Button>
            <Button variant="outline" size="sm">
              <MdAutoFixHigh className="w-4 h-4 inline-block" />
              Improve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCharacter("")}
            >
              <MdClear className="w-4 h-4 inline-block" />
              Clear
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Textarea
            name="lore"
            value={lore}
            onValueChange={(value) => setLore(value)}
          >
            <Textarea.Label>Lore & Plot</Textarea.Label>
            <Textarea.Description>
              Set the world and story context - the setting, background lore,
              and plot elements.
            </Textarea.Description>
            <Textarea.Field
              className="w-full min-h-[120px] resize-none"
              placeholder="In a Victorian-era city where magic is hidden beneath the surface..."
            />
          </Textarea>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm">
              <MdRefresh className="w-4 h-4 inline-block" />
              Generate
            </Button>
            <Button variant="outline" size="sm">
              <MdAutoFixHigh className="w-4 h-4 inline-block" />
              Improve
            </Button>
            <Button variant="outline" size="sm" onClick={() => setLore("")}>
              <MdClear className="w-4 h-4 inline-block" />
              Clear
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Textarea
            name="scenario"
            value={scenario}
            onValueChange={(value) => setScenario(value)}
          >
            <Textarea.Label>Scenario Beginning</Textarea.Label>
            <Textarea.Description>
              Write the opening scene or situation that starts your story.
            </Textarea.Description>
            <Textarea.Field
              className="w-full min-h-[120px] resize-none"
              placeholder="The fog was thick that evening when a mysterious letter arrived..."
            />
          </Textarea>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm">
              <MdRefresh className="w-4 h-4 inline-block" />
              Generate
            </Button>
            <Button variant="outline" size="sm">
              <MdAutoFixHigh className="w-4 h-4 inline-block" />
              Improve
            </Button>
            <Button variant="outline" size="sm" onClick={() => setScenario("")}>
              <MdClear className="w-4 h-4 inline-block" />
              Clear
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default ConfigPanel;
