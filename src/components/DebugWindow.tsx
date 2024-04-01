type DebugWindowProps = {
  inputFocus: boolean;
  disableInput: boolean;
  inputValue: string;
  currentWordIndex: number;
  currentLetterIndex: number;
  seconds: number;
  isStarted: boolean;
  isFinished: boolean;
};

export const DebugWindow = ({
  currentLetterIndex,
  currentWordIndex,
  disableInput,
  inputFocus,
  inputValue,
  isFinished,
  isStarted,
  seconds,
}: DebugWindowProps) => {
  return (
    <div className="absolute left-0 top-0 text-yellow-300 select-none">
      <h1>Input Focus: {String(inputFocus)}</h1>
      <h1>Disable Input: {String(disableInput)}</h1>
      <h1>Input Value: {inputValue}</h1>
      <h1>Current word index: {currentWordIndex}</h1>
      <h1>Current letter index: {currentLetterIndex}</h1>
      <h1>Seconds: {seconds}</h1>
      <h1>Is Started: {String(isStarted)}</h1>
      <h1>Is Finished: {String(isFinished)}</h1>
    </div>
  );
};
