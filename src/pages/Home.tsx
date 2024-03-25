import { useEffect, useState } from "react";
import { FaRedo } from "react-icons/fa";
import DisplayWords from "../components/DisplayWords";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "../components/LoadingSpinner";

const url = "http://api.quotable.io/random?minLength=350&maxLength=600";

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

const Home = () => {
  const queryClient = useQueryClient();
  const {
    data: challengeWords,
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

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const lastChar = value.charAt(value.length - 1);

    if (
      lastChar === " " &&
      challengeWords &&
      input === challengeWords[currentWordIndex]
    ) {
      setCurrentWordIndex((prevWordIndex) => ++prevWordIndex);
      setInput("");
    } else {
      setInput(value);
    }
  };

  const handleRefetch = () => {
    const {} = refetch();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex items-center justify-center flex-col gap-4">
      <DisplayWords
        words={challengeWords || [""]}
        currentWordIndex={currentWordIndex}
      />

      <input type="text" value={input} onChange={onInputChange} />
      <div
        className="py-4 px-8 text-neutral-400 hover:text-neutral-200"
        onClick={() => {
          queryClient.invalidateQueries({ queryKey: ["challenge-words"] });
        }}
      >
        <FaRedo />
      </div>
    </div>
  );
};

export default Home;
