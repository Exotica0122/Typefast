import { useState, useEffect, useRef } from "react";
import { FaRedo } from "react-icons/fa";
import { generateRandomWords, keysToTrack, RandomWord } from "../utils/utils";

const SECONDS_TIMER = 30;
const MINUTES_IN_SECONDS = 60;

const Home = () => {
  const DEV_MODE = import.meta.env.DEV ?? false;

  const [words, setWords] = useState<string[]>([]);
  const [wordsObject, setWordsObject] = useState<RandomWord[]>([]);
  const wordsRef = useRef<HTMLDivElement[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const [disableInput, setDisableInput] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [seconds, setSeconds] = useState(SECONDS_TIMER); // init this from context
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [mainTextTranslateDistance, setMainTextTranslateDistance] = useState(0);

  const caretRef = useRef<HTMLDivElement | null>(null);
  const [caretElementPosition, setCaretElementPosition] = useState({
    x: 0,
    y: 0,
  });

  const [wpm, setWpm] = useState(0);

  // Init game
  useEffect(() => {
    inputRef.current?.focus();
    setInputFocus(true);

    const { randomWords, randomWordsObject } = generateRandomWords(100);
    setWords(randomWords);
    setWordsObject(randomWordsObject);
  }, []);

  useEffect(() => {
    let interval = 0;
    if (isStarted && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
      setIsStarted(false);
      setIsFinished(true);

      const wordsCompleted = wordsObject.reduce(
        (count, prevWord) =>
          prevWord.isTyped && !prevWord.isError ? ++count : count,
        0
      );
      const durationOffset = SECONDS_TIMER / MINUTES_IN_SECONDS;
      setWpm(wordsCompleted / durationOffset);
    }
    return () => clearInterval(interval);
  }, [isStarted, seconds]);

  // @TODO: hack around for now. Move this to the handler
  useEffect(() => {
    if (isStarted) {
      handleCaret();
    }
  }, [currentWordIndex, currentLetterIndex]);

  // @TODO: hack around for now. Move this to the handler
  useEffect(() => {
    if (isStarted) {
      checkIfMoveText();
    }
  }, [caretElementPosition]);

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

  const checkIfMoveText = () => {
    if (currentLetterIndex === 0 && caretElementPosition.y > 40) {
      setMainTextTranslateDistance(
        (prevDistance) => (prevDistance -= caretElementPosition.y / 2)
      );
    }
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
      e.code === "Tab" ||
      e.code === "Enter" ||
      (e.code === "Space" && currentLetterIndex === 0 && currentWordIndex === 0)
    ) {
      return true;
    }

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
    // Ignore if input length hits limit
    if (inputValue.length >= 20) return;

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
    } else {
      // Handle when more letter typed
      targetWord.word.push({
        id: -currentLetterIndex,
        value: letter,
        typedValue: letter,
        isError: true,
        isTyped: true,
        isDeletable: true,
      });
    }

    setInputValue((prevValue) => prevValue + letter);
    setCurrentLetterIndex((prevIndex) => prevIndex + 1);
    setWordsObject(newObject);
  };

  const handleTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Disable Input if Control button is pressed
    if (disableInput) return;
    if (handleDisableTyping(e)) return;

    // Start game loop
    if (!isStarted) {
      setIsStarted(true);
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

  const handleRestart = () => {};

  return (
    <>
      {DEV_MODE && (
        <div className="absolute left-0 top-0 text-yellow-300 select-none">
          <h1>Input Focus: {String(inputFocus)}</h1>
          <h1>Disable Input: {String(disableInput)}</h1>
          <h1>Game Started: {String(isStarted)}</h1>
          <h1>Input Value: {inputValue}</h1>
          <h1>Current word index: {currentWordIndex}</h1>
          <h1>Current letter index: {currentLetterIndex}</h1>
          <h1>Seconds: {seconds}</h1>
          <h1>Is Started: {String(isStarted)}</h1>
          <h1>Is Finished: {String(isFinished)}</h1>
        </div>
      )}
      {!isFinished ? (
        <>
          <div className="w-[80%] relative">
            {/* Timer */}
            <h1
              className={`absolute left-0 -top-8 text-xl text-yellow-300 select-none transition-opacity duration-500 ${
                isStarted ? "opacity-100" : "opacity-0"
              }`}
            >
              {seconds}
            </h1>

            <div className="overflow-hidden h-40">
              {/* Caret */}
              <div
                className={`animate-blink absolute pt-1 h-6 w-[2px] bg-yellow-300`}
                style={{
                  transform: `translate(${caretElementPosition.x}px, ${caretElementPosition.y}px)`,
                }}
                ref={caretRef}
              />

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
                        wordObject.isError
                          ? " underline decoration-red-500"
                          : ""
                      }`}
                      ref={(el) => {
                        if (!el) return;
                        wordsRef.current[i] = el;
                      }}
                    >
                      {wordObject.word.map(
                        ({ id, value, isError, isTyped }) => {
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
                        }
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>WPM: {wpm}</div>
      )}

      <input
        readOnly
        ref={inputRef}
        className="opacity-0 p-0 m-0 absolute select-none"
        value={inputValue}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
        onKeyDown={handleTyping}
        onKeyUp={handleEnableTyping}
        disabled={isFinished}
        autoComplete="false"
        autoCapitalize="false"
        data-enable-grammarly="false"
        spellCheck="false"
      />

      <button className="mt-4 px-6 py-2" onClick={handleRestart}>
        <FaRedo width={20} height={20} />
      </button>
    </>
  );
};

export default Home;
