import { FaRedo } from "react-icons/fa";

type RestartButtonProps = {
  handleRestart: () => void;
};

export const RestartButton = ({ handleRestart }: RestartButtonProps) => {
  return (
    <button
      className="mt-4 px-6 py-2 text-neutral-400 transition-colors hover:text-neutral-100"
      onClick={handleRestart}
    >
      <FaRedo width={20} height={20} />
    </button>
  );
};
