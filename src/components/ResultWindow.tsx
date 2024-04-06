import { ResultChart } from "./chart/ResultChart";
import { Label } from "./ui/Label";

type ResultWindowProps = {
  accuracy: number;
  wpmHistory: number[];
};

export const ResultWindow = ({ accuracy, wpmHistory }: ResultWindowProps) => {
  return (
    <div className="flex gap-12">
      <div>
        <Label title="wpm" value={wpmHistory[wpmHistory.length - 1]} />
        <Label title="acc" value={`${accuracy}%`} />
      </div>
      <ResultChart className="h-[180px] w-[720px]" dataSet={wpmHistory} />
    </div>
  );
};
