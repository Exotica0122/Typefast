import { ResultChart } from "./chart/ResultChart";

type ResultWindowProps = {
  accuracy: number;
  wpmHistory: number[];
};

export const ResultWindow = ({ accuracy, wpmHistory }: ResultWindowProps) => {
  return (
    <div className="flex gap-12">
      <div>
        <div className="mb-4">
          <h2 className="text-xl text-neutral-400">wpm</h2>
          <p className="text-4xl text-yellow-300">
            {wpmHistory[wpmHistory.length - 1]}
          </p>
        </div>
        <div>
          <h2 className="text-xl text-neutral-400">acc</h2>
          <p className="text-4xl text-yellow-300">{accuracy}%</p>
        </div>
      </div>
      <ResultChart className="h-[180px] w-[720px]" dataSet={wpmHistory} />
    </div>
  );
};
