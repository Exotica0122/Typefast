import { useState, useEffect, useRef } from "react";
import { generateRandomWords, keysToTrack, RandomWord } from "../utils/utils";

const Home = () => {
  const DEV_MODE = import.meta.env.DEV ?? false;

  const [words, setWords] = useState<string[]>([]);
  const [wordsObject, setWordsObject] = useState<RandomWord[]>([]);
  const wordsRef = useRef<HTMLDivElement[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const [disableInput, setDisableInput] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [started, setStarted] = useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const caretRef = useRef<HTMLDivElement | null>(null);
  const [caretElementPosition, setCaretElementPosition] = useState({
    x: 0,
    y: 0,
  });

  // Init game
  useEffect(() => {
    inputRef.current?.focus();
    setInputFocus(true);

    const { randomWords, randomWordsObject } = generateRandomWords(100);
    setWords(randomWords);
    setWordsObject(randomWordsObject);
  }, []);

  // @TODO: hack around for now. Move this to the handler
  useEffect(() => {
    if (started) {
      handleCaret();
    }
  }, [currentWordIndex, currentLetterIndex]);

  const handleCaret = () => {
    if (!caretRef || !caretRef.current) {
      return;
    }

    const caretPositionX = caretRef.current.getBoundingClientRect().left;
    const caretPositionY = caretRef.current.getBoundingClientRect().top;

    let newCaretPositionX = 0;
    let newCaretPositionY = 0;

    if (currentLetterIndex === 0) {
      newCaretPositionX =
        wordsRef.current[currentWordIndex].childNodes[
          currentLetterIndex
          // @ts-ignore
        ].getBoundingClientRect().left;
      newCaretPositionY =
        wordsRef.current[currentWordIndex].childNodes[
          currentLetterIndex
          // @ts-ignore
        ].getBoundingClientRect().top;
    } else {
      newCaretPositionX =
        wordsRef.current[currentWordIndex].childNodes[
          currentLetterIndex - 1
          // @ts-ignore
        ].getBoundingClientRect().right;
      newCaretPositionY =
        wordsRef.current[currentWordIndex].childNodes[
          currentLetterIndex - 1
          // @ts-ignore
        ].getBoundingClientRect().top;
    }

    const xOffset = newCaretPositionX - caretPositionX;
    const yOffset = newCaretPositionY - caretPositionY;
    setCaretElementPosition((prevPosition) => ({
      x: (prevPosition.x += xOffset),
      y: (prevPosition.y += yOffset),
    }));
  };

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

  const handleDisableTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.code === "MetaLeft" ||
      e.code === "MetaRight" ||
      e.code === "AltLeft" ||
      e.code === "ControlLeft"
    ) {
      setDisableInput(true);
      return true;
    }
    return false;
  };

  const handleBackspace = () => {
    // Ignore when very first word and letter
    if (currentWordIndex === 0 && currentLetterIndex === 0) {
      return;
    }

    // Ignore if previous word is correctly typed
    if (
      currentLetterIndex === 0 &&
      !wordsObject[currentWordIndex - 1].isError
    ) {
      return;
    }

    // When need to go back to previous wrongly typed word to fix
    if (currentLetterIndex === 0 && wordsObject[currentWordIndex - 1].isError) {
      const newCurrentLetterIndex = wordsObject[
        currentWordIndex - 1
      ].word.reduce(
        (count, prevValue) => (prevValue.isTyped ? ++count : count),
        0
      );

      wordsObject[currentWordIndex - 1].isError = false;
      setWordsObject(wordsObject);
      setCurrentLetterIndex(newCurrentLetterIndex);
      setCurrentWordIndex((prevIndex) => prevIndex - 1);
      setInputValue(
        wordsObject[currentWordIndex - 1].word
          .map(({ isTyped, typedValue }) =>
            isTyped && typedValue ? typedValue : ""
          )
          .join("")
      );
      return;
    }

    const newObject = [...wordsObject];
    const targetWord = newObject[currentWordIndex];
    const targetLetter = targetWord.word[currentLetterIndex - 1];

    if (!targetLetter.isDeletable) {
      targetLetter.isTyped = false;
      targetLetter.isError = false;
    } else {
      targetWord.word.pop();
    }

    // Remove the last value
    setInputValue((prevValue) => prevValue.slice(0, -1));
    setWordsObject(newObject);
    setCurrentLetterIndex((prevIndex) => prevIndex - 1);
  };

  const handleSpace = () => {
    if (!inputValue) return;

    const newWordsObject = wordsObject.map((wordObject, i) => {
      if (currentWordIndex !== i) return wordObject;

      wordObject.isTyped = true;
      if (inputValue != words[currentWordIndex]) {
        wordObject.isError = true;
      } else {
        wordObject.isError = false;
      }
      return wordObject;
    });

    setWordsObject(newWordsObject);
    setCurrentWordIndex((currIndex) => currIndex + 1);
    setCurrentLetterIndex(0);
    setInputValue("");
  };

  const handleNewLetterTyped = (letter: string) => {
    if (inputValue.length < 20) {
      setInputValue((prevValue) => prevValue + letter);
      setCurrentLetterIndex((prevIndex) => prevIndex + 1);
    }

    const newObject = [...wordsObject];
    const targetWord = newObject[currentWordIndex];
    const targetLetter = targetWord.word[currentLetterIndex];

    // If letter typed is in bound with words
    if (currentLetterIndex < targetWord.word.length) {
      targetLetter.isTyped = true;
      targetLetter.typedValue = letter;
      if (targetLetter.value !== letter) {
        targetLetter.isError = true;
      }
      // Handle when more letter typed
    } else {
      if (targetWord.word.length < 20) {
        targetWord.word.push({
          id: -1,
          value: letter,
          typedValue: letter,
          isError: true,
          isTyped: true,
          isDeletable: true,
        });
      }
    }

    setWordsObject(newObject);
  };

  const handleTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Disable Input if Control button is pressed
    if (disableInput) return;
    if (handleDisableTyping(e)) return;

    // Start game loop
    if (!started) {
      setStarted(true);
    }

    if (e.code === "Backspace") {
      handleBackspace();
      return;
    }

    // ignore if key is not necessary to track
    if (!keysToTrack.includes(e.code)) {
      return;
    }

    // Handle space
    if (e.code === "Space") {
      handleSpace();
      return;
    }

    handleNewLetterTyped(e.key);
  };

  return (
    <>
      {DEV_MODE && (
        <div className="absolute left-0 top-0 text-yellow-300">
          <h1>Input Focus: {String(inputFocus)}</h1>
          <h1>Disable Input: {String(disableInput)}</h1>
          <h1>Game Started: {String(started)}</h1>
          <h1>Input Value: {inputValue}</h1>
          <h1>Current word index: {currentWordIndex}</h1>
          <h1>Current letter index: {currentLetterIndex}</h1>
        </div>
      )}
      <div className="w-[80%]">
        {/* Caret */}
        <div
          className={`animate-blink absolute mt-1 h-6 w-[2px] bg-yellow-300`}
          style={{
            transform: `translate(${caretElementPosition.x}px, ${caretElementPosition.y}px)`,
          }}
          ref={caretRef}
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
                ref={(el) => {
                  if (!el) return;
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
                  return <span className={`${letterClassName}`}>{value}</span>;
                })}
              </div>
            );
          })}
        </div>

        <input
          ref={inputRef}
          className="opacity-0 p-0 m-0 absolute select-none"
          value={inputValue}
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
    </>
  );
};

export default Home;
