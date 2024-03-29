import { useQuery } from "@tanstack/react-query";

import { useState, useEffect } from "react";

type QuotableType = {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: string;
  dateModified: string;
};

const fetchChallengeWords = async () => {
  const response = await fetch(url);
  const json = (await response.json()) as QuotableType;
  const splitWords = json.content.split(" ");
  return splitWords;
};

const url = "http://api.quotable.io/random?minLength=300";

const MonkeyTypeClone = () => {
  const {
    data: words,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["challenge-words"],
    queryFn: async () => await fetchChallengeWords(),
    refetchOnWindowFocus: false,
  });

  const [input, setInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [errors, setErrors] = useState<number[]>([]);
  const [timer, setTimer] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [wordsPerMinute, setWordsPerMinute] = useState<number | null>(null);

  useEffect(() => {
    if (timer !== null && timer > 0 && !finished) {
      const intervalId = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    } else if (timer === 0 && !finished) {
      setEndTime(Date.now());
      setFinished(true);
    }
  }, [timer, finished]);

  useEffect(() => {
    if (startTime !== null && endTime !== null && !finished) {
      const timeDifferenceInSeconds = (endTime - startTime) / 1000;
      const wordsTyped = currentWordIndex;
      const wordsPerMinute = Math.round(
        (wordsTyped / timeDifferenceInSeconds) * 60
      );
      setWordsPerMinute(wordsPerMinute);
      setFinished(true);
    }
  }, [endTime]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!words) return;

    if (!timer) {
      setStartTime(Date.now());
      setTimer(30);
    }

    const typedValue = e.target.value;
    setInput(typedValue);

    const currentWord = words[currentWordIndex];
    const currentErrors = [];
    for (let i = 0; i < typedValue.length; i++) {
      if (typedValue[i] !== currentWord[i]) {
        currentErrors.push(i);
      }
    }
    setErrors(currentErrors);

    const lastValue = typedValue[typedValue.length - 1];

    // Check if word is completed
    if (lastValue === " ") {
      setInput("");
      setCurrentWordIndex(currentWordIndex + 1);
      setErrors([]);

      if (currentWordIndex === words.length - 1) {
        setEndTime(Date.now());
      }
    }
  };

  const handleRestart = () => {
    setInput("");
    setCurrentWordIndex(0);
    setErrors([]);
    setTimer(null);
    setStartTime(null);
    setEndTime(null);
    setFinished(false);
    setWordsPerMinute(null);
  };

  const renderWord = (word: string, index: number) => {
    if (index < currentWordIndex) {
      return (
        <span key={index} style={{ color: "green" }}>
          {word}{" "}
        </span>
      );
    } else if (index === currentWordIndex) {
      return (
        <span key={index}>
          <b>{input}</b>
          {word.slice(input.length)}{" "}
        </span>
      );
    } else {
      return <span key={index}>{word} </span>;
    }
  };

  if (isError) {
    return <div>Error</div>;
  }

  if (isLoading || !words) {
    return <h1>loading...</h1>;
  }

  return (
    <div>
      <div>
        <h1>{words.map(renderWord)}</h1>
        {finished ? (
          <div>
            <p>
              {currentWordIndex === words.length
                ? `Game Over! Your words per minute: ${wordsPerMinute}`
                : "Time's up!"}
            </p>
            <button onClick={handleRestart}>Restart</button>
          </div>
        ) : (
          <p>
            {timer !== null
              ? `Time left: ${timer} seconds`
              : "Start typing to begin the timer"}
          </p>
        )}
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          autoFocus
          disabled={finished}
        />
      </div>
      <div>
        <p>Current word: {input}</p>
        {errors.length > 0 && (
          <p style={{ color: "red" }}>
            Incorrect keystroke(s):{" "}
            {errors.map((i) => words[currentWordIndex][i])}
          </p>
        )}
      </div>
    </div>
  );
};

export default MonkeyTypeClone;
