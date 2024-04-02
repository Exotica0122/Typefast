import { MutableRefObject, useEffect, useState } from "react";
import { Caret } from "./Caret";
import { RandomWord } from "../utils/utils";
import { Timer } from "./Timer";
import { WordsDisplay } from "./WordsDisplay";
import { FocusWindow } from "./FocusWindow";

type GamePlayWindowProps = {
  caretElementPosition: { x: number; y: number };
  caretRef: MutableRefObject<HTMLDivElement | null>;
  wordsRef: MutableRefObject<HTMLDivElement[] | null>;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  wordsObject: RandomWord[];
  mainTextTranslateDistance: number;
  isStarted: boolean;
  seconds: number;
  inputFocus: boolean;
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
  inputFocus,
}: GamePlayWindowProps) => {
  const [showBlur, setShowBlur] = useState(false);

  useEffect(() => {
    if (inputFocus) {
      setShowBlur(false);
      return;
    }

    const timeout = setTimeout(() => setShowBlur(true), 1000);
    return () => clearTimeout(timeout);
  }, [inputFocus]);

  return (
    <div className="relative w-[80%]">
      <FocusWindow showBlur={showBlur} />
      <Timer isStarted={isStarted} seconds={seconds} />
      <div
        className={`h-40 overflow-hidden transition-opacity duration-500 ${showBlur ? "blur" : ""}`}
      >
        <Caret caretElementPosition={caretElementPosition} ref={caretRef} />
        <WordsDisplay
          wordsRef={wordsRef}
          inputRef={inputRef}
          wordsObject={wordsObject}
          mainTextTranslateDistance={mainTextTranslateDistance}
        />
      </div>
    </div>
  );
};
