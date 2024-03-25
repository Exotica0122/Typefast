const DisplayWords = ({
  words,
  currentWordIndex,
}: {
  words: string[];
  currentWordIndex: number;
}) => {
  return (
    <div className="text-white text-center text-2xl flex flex-wrap">
      {words.map((word, i) => {
        const letters = word.split("");
        return (
          <div
            key={`${word}${i}`}
            className="leading-none m-1 border-b-2 border-transparent"
          >
            {letters.map((letter, j) => (
              <span key={`${letter}${j}`}>{letter}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default DisplayWords;
// .word {
//   font-size: 1em;
//   line-height: 1em;
//   margin: .25em;
//   color: var(--sub-color);
//   font-variant: no-common-ligatures;
//   /* border-bottom: 2px solid transparent; */
// }
