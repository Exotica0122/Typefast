type TimerProps = { isStarted: boolean; seconds: number };

export const Timer = ({ isStarted, seconds }: TimerProps) => {
  return (
    <h1
      className={`absolute left-0 -top-8 text-xl text-yellow-300 select-none transition-opacity duration-500 ${
        isStarted ? "opacity-100" : "opacity-0"
      }`}
    >
      {seconds}
    </h1>
  );
};
