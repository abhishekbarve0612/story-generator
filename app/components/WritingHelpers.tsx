import { Button } from "@abhishekbarve/components";
import { MdRefresh, MdAutoFixHigh, MdClear } from "react-icons/md";

interface Props {
  textContent: string;
  onGenerate: (text: string) => void;
  onImprove: (text: string) => void;
  onClear: () => void;
}

function WritingHelpers({
  textContent,
  onGenerate,
  onImprove,
  onClear,
}: Props) {
  return (
    <div className="flex gap-2 justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onGenerate(textContent)}
      >
        <MdRefresh className="w-4 h-4 inline-block" />
        Generate
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onImprove(textContent)}
      >
        <MdAutoFixHigh className="w-4 h-4 inline-block" />
        Improve
      </Button>
      <Button variant="outline" size="sm" onClick={onClear}>
        <MdClear className="w-4 h-4 inline-block" />
        Clear
      </Button>
    </div>
  );
}

export default WritingHelpers;
