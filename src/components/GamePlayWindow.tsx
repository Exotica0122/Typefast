import { MutableRefObject } from "react";
import { Caret } from "./Caret";
import { RandomWord } from "../utils/utils";
import { Timer } from "./Timer";
import { WordsDisplay } from "./WordsDisplay";

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
    <div className="relative w-[80%]">
      <Timer isStarted={isStarted} seconds={seconds} />
      <div className="h-40 overflow-hidden">
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
