type ResultWindowProps = {
  wpm: number;
};

export const ResultWindow = ({ wpm }: ResultWindowProps) => {
  return <div>WPM: {wpm}</div>;
};
