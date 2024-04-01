import { MutableRefObject } from "react";
import { Caret } from "./Caret";
import { RandomWord } from "../utils/utils";
import { Timer } from "./Timer";

type GamePlayWindowProps = {
  caretElementPosition: { x: number; y: number };
  caretRef: MutableRefObject<HTMLDivElement | null>;
  wordsRef: MutableRefObject<HTMLDivElement[] | null>;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  wordsObject: RandomWord[];
  mainTextTranslateDistance: number;
  isStarted: boolean;
  seconds: number;
};

export const GamePlayWindow = ({
  caretElementPosition,
  caretRef,
  inputRef,
  wordsRef,
  mainTextTranslateDistance,
  wordsObject,
  isStarted,
  seconds,
}: GamePlayWindowProps) => {
  return (
    <div className="w-[80%] relative">
      <Timer isStarted={isStarted} seconds={seconds} />
      <div className="overflow-hidden h-40">
        <Caret caretElementPosition={caretElementPosition} ref={caretRef} />

        <div
          className="flex flex-wrap gap-2 text-2xl select-none transition-transform"
          style={{
            transform: `translateY(${mainTextTranslateDistance}px)`,
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {wordsObject.map((wordObject, i) => {
            return (
              <div
                key={wordObject.id}
                className={`w-fit${
                  wordObject.isError ? " underline decoration-red-500" : ""
                }`}
                ref={(el) => {
                  if (!el || !wordsRef || !wordsRef.current) return;
                  wordsRef.current[i] = el;
                }}
              >
                {wordObject.word.map(({ id, value, isError, isTyped }) => {
                  let letterClassName = "";
                  if (isTyped && isError) {
                    letterClassName = "text-red-800";
                  } else if (isTyped && !isError) {
                    letterClassName = "text-white";
                  } else {
                    letterClassName = "text-neutral-400";
                  }
                  return (
                    <span
                      key={`${wordObject.id}-${id}`}
                      className={`${letterClassName}`}
                    >
                      {value}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
