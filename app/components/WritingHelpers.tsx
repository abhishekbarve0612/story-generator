import { Button } from "@abhishekbarve/components";
import { MdAutoFixHigh, MdClear } from "react-icons/md";

interface Props {
  textContent: string;
  onGenerate: (text: string) => void;
  onClear: () => void;
  isLoading?: boolean;
}

function WritingHelpers({
  textContent,
  onGenerate,
  onClear,
  isLoading = false,
}: Props) {
  return (
    <div className="flex gap-2 justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onGenerate(textContent)}
        disabled={isLoading}
      >
        <MdAutoFixHigh className="w-4 h-4 inline-block" />
        Generate
      </Button>
      <Button variant="outline" size="sm" onClick={onClear}>
        <MdClear className="w-4 h-4 inline-block" />
        Clear
      </Button>
    </div>
  );
}

export default WritingHelpers;
