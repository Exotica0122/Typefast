import { useTypingLengthStore } from "../store/useTypingLengthStore";

type TypingSettingProps = {
  isStarted: boolean;
};

export const TypingSetting = ({ isStarted }: TypingSettingProps) => {
  const typingLength = useTypingLengthStore((state) => state.typingLength);
  const typingLengthOptions = useTypingLengthStore(
    (state) => state.typingLengthOptions,
  );
  const updateTypingLength = useTypingLengthStore(
    (state) => state.updateTypingLength,
  );

  const handleUpdateTypingLength = (option: number) => {
    if (isStarted) return;

    updateTypingLength(option);
  };

  return (
    <div
      className={`flex select-none items-center justify-center ${isStarted ? " opacity-0" : "opacity-100"}`}
    >
      <ul className="flex items-center justify-center gap-6 rounded-md bg-neutral-900 py-2 px-6">
        {typingLengthOptions.map((option: number) => (
          <li>
            <button
              key={option}
              className={`transition-colors hover:text-white ${typingLength === option ? "text-yellow-300" : "text-neutral-400"} ${isStarted ? "" : "cursor-pointer"}`}
              onClick={() => handleUpdateTypingLength(option)}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
