import { PiCursorFill } from "react-icons/pi";

type FocusWindowProps = {
  showBlur: boolean;
};

export const FocusWindow = ({ showBlur }: FocusWindowProps) => {
  return (
    <div
      className={`absolute flex h-full w-full items-center justify-center gap-2 text-center transition-opacity duration-300 ${showBlur ? "opacity-100" : "opacity-0"}`}
    >
      <div className="relative">
        <span className=" absolute left-0 top-0 inline-flex h-4 w-4 animate-ping rounded-full bg-white opacity-50" />
        <PiCursorFill />
      </div>
      Click here to focus
    </div>
  );
};
