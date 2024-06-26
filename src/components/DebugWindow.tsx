type DebugWindowProps = {
  inputFocus: boolean;
  inputValue: string;
  currentWordIndex: number;
  currentLetterIndex: number;
  seconds: number;
  isStarted: boolean;
  isFinished: boolean;
  caretElementPosition: {
    x: number;
    y: number;
  };
};

export const DebugWindow = ({
  currentLetterIndex,
  currentWordIndex,
  inputFocus,
  inputValue,
  isFinished,
  isStarted,
  seconds,
  caretElementPosition,
}: DebugWindowProps) => {
  return (
    <div className="absolute left-0 top-0 select-none text-yellow-300">
      <h1>Input Focus: {String(inputFocus)}</h1>
      <h1>Input Value: {inputValue}</h1>
      <h1>Current word index: {currentWordIndex}</h1>
      <h1>Current letter index: {currentLetterIndex}</h1>
      <h1>Seconds: {seconds}</h1>
      <h1>Is Started: {String(isStarted)}</h1>
      <h1>Is Finished: {String(isFinished)}</h1>
      <h1>Caret Position X: {caretElementPosition.x}</h1>
      <h1>Caret Position Y: {caretElementPosition.y}</h1>
    </div>
  );
};
