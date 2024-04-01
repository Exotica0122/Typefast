import { forwardRef, LegacyRef } from "react";

type CaretProps = {
  caretElementPosition: { x: number; y: number };
};

export const Caret = forwardRef<HTMLDivElement | null, CaretProps>(
  ({ caretElementPosition: position }, ref) => {
    return (
      <div
        className={`absolute h-6 w-[2px] animate-blink bg-yellow-300 pt-1 transition-transform duration-75`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        ref={ref}
      />
    );
  },
);
