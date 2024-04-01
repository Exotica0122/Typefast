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
    <div className="w-[80%] relative">
      <Timer isStarted={isStarted} seconds={seconds} />
      <div className="overflow-hidden h-40">
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
