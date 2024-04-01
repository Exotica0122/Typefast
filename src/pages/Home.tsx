import { useState, useEffect, useRef } from "react";
import words from "../words/words.json";
import { keysToTrack } from "../utils/keysToTrack";

type RandomLetter = {
  id: number;
  value: string;
  isTyped: boolean;
  isError: boolean;
  isDeletable: boolean;
};

type RandomWord = {
  isTyped: boolean;
  isError: boolean;
  word: RandomLetter[];
};

function generateRandomWords() {
  let randomWords = "";
  for (let i = 0; i < 100; ++i) {
    randomWords += words.words[Math.floor(Math.random() * words.length)] + " ";
  }

  let idCounter = 0;
  const randomWordsObject: RandomWord[] = randomWords
    .split(" ")
    .map((word, i) => {
      return {
        isTyped: false,
        isError: false,
        word: word.split("").map((letter, j) => {
          return {
            id: idCounter++,
            value: letter,
            isTyped: false,
            isError: false,
            isDeletable: false,
          };
        }),
      };
    });

  return { randomWordsObject, randomWords };
}

const Home = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [words, setWords] = useState("");
  const [wordsArray, setWordsArray] = useState<string[]>([]);
  const [wordsObject, setWordsObject] = useState<RandomWord[]>([]);
  const [inputFocus, setInputFocus] = useState(false);
  const [disableInput, setDisableInput] = useState(false);

  const [value, setValue] = useState("");
  const [started, setStarted] = useState(false);

  const [globalLetterIndex, setGlobalLetterIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [backspaceMinPosition, setBackspaceMinPosition] = useState(0);

  console.log(currentLetterIndex);

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [cursorElementPosition, setCursorElementPosition] = useState({
    x: 0,
    y: 0,
  });

  let wordsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    inputRef.current?.focus();
    setInputFocus(true);

    const { randomWords, randomWordsObject } = generateRandomWords();
    setWords(randomWords);
    setWordsArray(randomWords.split(" "));
    setWordsObject(randomWordsObject);
  }, []);

  useEffect(() => {
    if (started) {
      handleCursor();
    }
  }, [currentWordIndex, currentLetterIndex]);

  function handleCursor() {
    if (!cursorRef || !cursorRef.current) {
      return;
    }

    const cursorPositionX = cursorRef.current.getBoundingClientRect().left;
    const cursorPositionY = cursorRef.current.getBoundingClientRect().top;

    let newCursorPositionX = 0;
    let newCursorPositionY = 0;

    if (currentLetterIndex === 0) {
      newCursorPositionX =
        wordsRef.current[currentWordIndex].childNodes[
          currentLetterIndex
        ].getBoundingClientRect().left;
      newCursorPositionY =
        wordsRef.current[currentWordIndex].childNodes[
          currentLetterIndex
        ].getBoundingClientRect().top;
    } else {
      newCursorPositionX =
        wordsRef.current[currentWordIndex].childNodes[
          currentLetterIndex - 1
        ].getBoundingClientRect().right;
      newCursorPositionY =
        wordsRef.current[currentWordIndex].childNodes[
          currentLetterIndex - 1
        ].getBoundingClientRect().top;
    }

    const xOffset = newCursorPositionX - cursorPositionX;
    const yOffset = newCursorPositionY - cursorPositionY;
    setCursorElementPosition((prevPosition) => ({
      x: (prevPosition.x += xOffset),
      // y: prevPosition.y,
      y: (prevPosition.y += yOffset),
    }));
  }

  const handleEnableTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.code === "MetaLeft" ||
      e.code === "MetaRight" ||
      e.code === "AltLeft" ||
      e.code === "ControlLeft"
    ) {
      setDisableInput(false);
      return;
    }
  };

  const handleTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.code === "MetaLeft" ||
      e.code === "MetaRight" ||
      e.code === "AltLeft" ||
      e.code === "ControlLeft"
    ) {
      setDisableInput(true);
      return;
    }

    if (!started) {
      setStarted(true);
    }

    if (disableInput) return;

    if (e.code === "Backspace") {
      console.log(wordsObject[currentWordIndex - 1]);
      if (
        currentLetterIndex === 0 &&
        wordsObject[currentWordIndex - 1].isError
      ) {
        console.log(wordsObject[currentWordIndex - 1].isError);
        wordsObject[currentWordIndex - 1].isError = false;
        setWordsObject(wordsObject);
        setCurrentLetterIndex(wordsObject[currentWordIndex - 1].word.length);
        setCurrentWordIndex((prevIndex) => prevIndex - 1);
        setValue(
          wordsObject[currentWordIndex - 1].word
            .map(({ value }) => value)
            .join("")
        );
        return;
      }

      if (currentLetterIndex === 0) {
        return;
      }

      setValue((prevValue) => prevValue.slice(0, -1));

      const newObject = [...wordsObject];
      const targetWord = newObject[currentWordIndex];
      const targetLetter = targetWord.word[currentLetterIndex - 1];

      if (!targetLetter.isDeletable) {
        targetLetter.isTyped = false;
        targetLetter.isError = false;
      } else {
        targetWord.word.pop();
      }

      setWordsObject(newObject);
      setCurrentLetterIndex((prevIndex) => prevIndex - 1);
      return;
    }

    if (!keysToTrack.includes(e.code)) {
      return;
    }

    // Handle space
    if (e.code === "Space") {
      if (!value) return;

      const newObject = [...wordsObject];
      const targetWord = newObject[currentWordIndex];
      targetWord.isTyped = true;

      if (value != wordsArray[currentWordIndex]) {
        targetWord.isError = true;
      } else {
        targetWord.isError = false;
      }

      setWordsObject(newObject);
      setCurrentWordIndex((currIndex) => currIndex + 1);
      setCurrentLetterIndex(0);
      setValue("");
      return;
    }

    if (value.length <= 20) {
      // console.log(currentLetterIndex);
      setValue((prevValue) => prevValue + e.key);
      setCurrentLetterIndex((prevIndex) => prevIndex + 1);
    }

    const newObject = [...wordsObject];
    const targetWord = newObject[currentWordIndex];
    const targetLetter = targetWord.word[currentLetterIndex];

    // If letter typed is in bound with words
    if (currentLetterIndex < targetWord.word.length) {
      targetLetter["isTyped"] = true;
      if (targetLetter.value !== e.key) {
        targetLetter["isError"] = true;
      }
      // Handle when more letter typed
    } else {
      if (targetWord.word.length <= 20) {
        targetWord.word.push({
          id: -1,
          value: e.key,
          isError: true,
          isTyped: true,
          isDeletable: true,
        });
      }
    }

    setWordsObject(newObject);
  };

  return (
    <div className="w-[80%]">
      <div
        className={`animate-blink absolute mt-1 h-6 w-[2px] bg-yellow-300`}
        style={{
          transform: `translate(${cursorElementPosition.x}px, ${cursorElementPosition.y}px)`,
        }}
        ref={cursorRef}
      />
      <div
        className="flex flex-wrap gap-2 text-2xl select-none"
        onClick={() => inputRef.current?.focus()}
      >
        {wordsObject.map((wordObject, i) => {
          return (
            <div
              className={`w-fit${
                wordObject.isError ? " underline decoration-red-500" : ""
              }`}
              ref={(el) => (wordsRef.current[i] = el)}
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
                  <span className={`${letterClassName} ml-[2px]`}>{value}</span>
                );
              })}
            </div>
          );
        })}
      </div>

      <input
        ref={inputRef}
        className="opacity-0 p-0 m-0 absolute select-none"
        value={value}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
        onKeyDown={handleTyping}
        onKeyUp={handleEnableTyping}
        autoComplete="false"
        autoCapitalize="false"
        data-enable-grammarly="false"
        spellCheck="false"
      />
    </div>
  );
};

export default Home;
