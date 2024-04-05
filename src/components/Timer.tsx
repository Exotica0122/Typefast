type TimerProps = { isStarted: boolean; seconds: number };

export const Timer = ({ isStarted, seconds }: TimerProps) => {
  return (
    <h1
      className={`absolute top-[3.5rem] left-0 select-none text-xl text-yellow-300 transition-opacity duration-500 ${
        isStarted ? "opacity-100" : "opacity-0"
      }`}
    >
      {seconds}
    </h1>
  );
};
