import { forwardRef, LegacyRef } from "react";

type CaretProps = {
  caretElementPosition: { x: number; y: number };
};

export const Caret = forwardRef<HTMLDivElement | null, CaretProps>(
  ({ caretElementPosition: position }, ref) => {
    return (
      <div
        className={`animate-blink absolute pt-1 h-6 w-[2px] bg-yellow-300`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        ref={ref}
      />
    );
  }
);
