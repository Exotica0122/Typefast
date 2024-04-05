type TypingSettingProps = {
  isStarted: boolean;
};

export const TypingSetting = ({ isStarted }: TypingSettingProps) => {
  return (
    <div
      className={`flex items-center justify-center ${isStarted ? "opacity-0" : "opacity-100"}`}
    >
      <ul className="flex items-center justify-center gap-6 rounded-md bg-neutral-900 py-2 px-6">
        <li>15</li>
        <li>30</li>
        <li>60</li>
      </ul>
    </div>
  );
};
