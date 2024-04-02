type FocusWindowProps = {
  showBlur: boolean;
};

export const FocusWindow = ({ showBlur }: FocusWindowProps) => {
  return (
    <div
      className={`absolute flex h-full w-full items-center justify-center text-center transition-opacity duration-500 ${showBlur ? "opacity-100" : "opacity-0"}`}
    >
      Click here to focus
    </div>
  );
};
