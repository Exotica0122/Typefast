import { useState, useEffect, useRef } from "react";
import { generateRandomWords, keysToTrack, RandomWord } from "../utils/utils";

const SECONDS_TIMER = 30;
const MINUTES_IN_SECONDS = 60;

export const useTypefast = () => {
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
        0,
      );
      const durationOffset = SECONDS_TIMER / MINUTES_IN_SECONDS;
      const wpm = Math.round(wordsCompleted / durationOffset);
      setWpm(wpm);
    }
    return () => clearInterval(interval);
  }, [isStarted, seconds]);

  const handleCaret = (wordIndex: number, letterIndex: number) => {
    if (!caretRef || !caretRef.current) {
      return;
    }

    const caretPositionX = caretRef.current.getBoundingClientRect().left;
    const caretPositionY = caretRef.current.getBoundingClientRect().top;

    let newCaretPositionX = 0;
    let newCaretPositionY = 0;

    if (letterIndex === 0) {
      newCaretPositionX =
        wordsRef.current[wordIndex].childNodes[
          letterIndex
          // @ts-ignore
        ].getBoundingClientRect().left;
      newCaretPositionY =
        wordsRef.current[wordIndex].childNodes[
          letterIndex
          // @ts-ignore
        ].getBoundingClientRect().top;
    } else {
      newCaretPositionX =
        wordsRef.current[wordIndex].childNodes[
          letterIndex - 1
          // @ts-ignore
        ].getBoundingClientRect().right;
      newCaretPositionY =
        wordsRef.current[wordIndex].childNodes[
          letterIndex - 1
          // @ts-ignore
        ].getBoundingClientRect().top;
    }

    const xOffset = newCaretPositionX - caretPositionX;
    const yOffset = newCaretPositionY - caretPositionY;

    const x = caretElementPosition.x + xOffset;
    let y = caretElementPosition.y + yOffset;

    y = moveText({ x, y });

    setCaretElementPosition({ x, y });
  };

  const moveText = ({ y }: { x: number; y: number }) => {
    if (y < 0) {
      setMainTextTranslateDistance((prevDistance) => (prevDistance -= y));
      return 0;
    }

    if (currentLetterIndex === 0 && y > 40) {
      setMainTextTranslateDistance((prevDistance) => (prevDistance -= y / 2));
      return y / 2;
    }

    return y;
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
        0,
      );

      wordsObject[currentWordIndex - 1].isError = false;
      setWordsObject(wordsObject);
      setCurrentLetterIndex(newCurrentLetterIndex);
      setCurrentWordIndex((prevIndex) => prevIndex - 1);
      setInputValue(
        wordsObject[currentWordIndex - 1].word
          .map(({ isTyped, typedValue }) =>
            isTyped && typedValue ? typedValue : "",
          )
          .join(""),
      );
      handleCaret(currentWordIndex - 1, newCurrentLetterIndex);
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
    handleCaret(currentWordIndex, currentLetterIndex - 1);
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
    handleCaret(currentWordIndex + 1, 0);
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

    // work around to handle caret after push
    setTimeout(() => {
      handleCaret(currentWordIndex, currentLetterIndex + 1);
    }, 0);
  };

  const handleTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Disable Input if Control button is pressed
    if (disableInput || isFinished) return;
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

  const handleRestart = () => {
    const { randomWords, randomWordsObject } = generateRandomWords(100);
    setWords(randomWords);
    setWordsObject(randomWordsObject);

    setCurrentLetterIndex(0);
    setCurrentWordIndex(0);

    setInputValue("");
    setIsStarted(false);
    setIsFinished(false);
    setSeconds(SECONDS_TIMER);
    setCaretElementPosition({ x: 0, y: 0 });
    setMainTextTranslateDistance(0);
    setWpm(0);

    inputRef.current?.focus();
    setInputFocus(true);
  };

  return {
    wordsObject,
    inputFocus,
    disableInput,
    inputValue,
    currentWordIndex,
    currentLetterIndex,
    seconds,
    isStarted,
    isFinished,
    caretElementPosition,
    caretRef,
    mainTextTranslateDistance,
    inputRef,
    wordsRef,
    wpm,
    handleTyping,
    handleEnableTyping,
    handleRestart,
    setInputFocus,
  };
};
