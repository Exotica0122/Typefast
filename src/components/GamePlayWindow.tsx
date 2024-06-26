import { MutableRefObject, useEffect, useState } from "react";
import { Caret } from "./Caret";
import { RandomWord } from "../utils/utils";
import { Timer } from "./Timer";
import { WordsDisplay } from "./WordsDisplay";
import { FocusWindow } from "./FocusWindow";
import { TypingSetting } from "./TypingSetting";

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
    <div className="relative flex h-full max-w-4xl flex-col gap-12">
      <TypingSetting isStarted={isStarted} />
      <FocusWindow showBlur={showBlur} />
      <Timer isStarted={isStarted} seconds={seconds} />

      <div
        className={`h-40 overflow-hidden transition-opacity duration-300 ${showBlur ? "blur" : ""}`}
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
