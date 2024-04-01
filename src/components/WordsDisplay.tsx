import { MutableRefObject } from "react";
import { RandomWord } from "../utils/utils";

type WordsDisplayProps = {
  wordsRef: MutableRefObject<HTMLDivElement[] | null>;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  wordsObject: RandomWord[];
  mainTextTranslateDistance: number;
};

export const WordsDisplay = ({
  wordsObject,
  mainTextTranslateDistance,
  inputRef,
  wordsRef,
}: WordsDisplayProps) => {
  return (
    <div
      className="flex select-none flex-wrap gap-2 text-2xl transition-transform duration-100"
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
  );
};
