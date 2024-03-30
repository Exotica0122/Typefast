import { useState, useEffect, useRef } from "react";
import words from "../words/words.json";
import { keysToTrack } from "../utils/keysToTrack";

type RandomWord = {
  id: number;
  value: string;
  isTyped: boolean;
  isError: boolean;
  isDeletable: boolean;
};

function generateRandomWords() {
  let randomWords = "";
  for (let i = 0; i < 100; ++i) {
    randomWords += words.words[Math.floor(Math.random() * words.length)] + " ";
  }

  let idCounter = 0;
  const randomWordsObject: RandomWord[][] = randomWords
    .split(" ")
    .map((word, i) => {
      return word.split("").map((letter, j) => {
        return {
          id: idCounter++,
          value: letter,
          isTyped: false,
          isError: false,
          isDeletable: false,
        };
      });
    });

  return { randomWordsObject, randomWords };
}

const Home = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [words, setWords] = useState("");
  const [wordsArray, setWordsArray] = useState<string[]>([]);
  const [wordsObject, setWordsObject] = useState<RandomWord[][]>([]);
  const [wordsError, setWordsError] = useState<string[]>([]);
  const [inputFocus, setInputFocus] = useState(false);

  const [value, setValue] = useState("");
  const [started, setStarted] = useState(false);

  const [globalLetterIndex, setGlobalLetterIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [backspaceMinPosition, setBackspaceMinPosition] = useState(0);

  useEffect(() => {
    inputRef.current?.focus();
    setInputFocus(true);

    const { randomWords, randomWordsObject } = generateRandomWords();
    setWords(randomWords);
    setWordsArray(randomWords.split(" "));
    setWordsObject(randomWordsObject);
  }, []);

  const handleTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Backspace") {
      if (currentLetterIndex === 0) return;
      setValue((prevValue) => prevValue.slice(0, -1));
      setWordsObject((prevObject) => {
        const newObject = [...prevObject];
        const targetWord = newObject[currentWordIndex];
        const targetLetter = targetWord[currentLetterIndex - 1];
        console.log(targetLetter);

        if (!targetLetter.isDeletable) {
          targetLetter.isTyped = false;
          targetLetter.isError = false;
        } else {
          targetWord.pop();
        }

        console.log(targetWord);
        return newObject;
      });
      setCurrentLetterIndex((prevIndex) => prevIndex - 1);
      return;
    }

    if (!keysToTrack.includes(e.code)) {
      return;
    }

    if (e.code === "Space") {
      setCurrentWordIndex((currIndex) => currIndex + 1);
      setCurrentLetterIndex(0);
      setValue("");
      return;
    }

    if (value.length <= 20) {
      setValue((prevValue) => prevValue + e.key);
      setCurrentLetterIndex((prevIndex) => prevIndex + 1);
    }

    setWordsObject((prevObject) => {
      const newObject = [...prevObject];
      const targetWord = newObject[currentWordIndex];
      const targetLetter = targetWord[currentLetterIndex];

      // If letter typed is in bound with words
      if (currentLetterIndex < targetWord.length) {
        targetLetter["isTyped"] = true;
        if (targetLetter.value !== e.key) {
          targetLetter["isError"] = true;
        }
        // Handle when more letter typed
      } else {
        if (targetWord.length <= 20) {
          targetWord.push({
            id: -1,
            value: e.key,
            isError: true,
            isTyped: true,
            isDeletable: true,
          });
        }
      }

      return newObject;
    });
  };

  if (!wordsObject.length) return <>Loading...</>;

  return (
    <>
      <div
        className="w-[80%] flex flex-wrap gap-2 text-2xl select-none"
        onClick={() => inputRef.current?.focus()}
      >
        {wordsObject.map((wordObject, i) => {
          return (
            <div
              className={`w-fit${
                wordsError[i] ? " underline decoration-red-500" : ""
              }`}
            >
              {wordObject.map(({ id, value, isError, isTyped }) => {
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
        // className="opacity-0 p-0 m-0 absolute select-none"
        className="p-0 m-0 absolute select-none text-black"
        value={value}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
        onKeyDown={handleTyping}
        autoComplete="false"
        autoCapitalize="false"
        data-enable-grammarly="false"
        spellCheck="false"
      />
    </>
  );
};

export default Home;
