//   const renderText = () => {
//     return text.split("").map((char, index) => {
//       let color = "inherit";
//       if (userInput[index] && userInput[index] !== char) {
//         color = "red";
//       }
//       return (
//         <span key={index} style={{ color }}>
//           {char}
//         </span>
//       );
//     });
//   };

const DisplayWords = ({
  words,
  currentWordIndex,
  input,
  currentLetterIndex,
}: {
  words: string[];
  currentWordIndex: number;
  input: string;
  currentLetterIndex: number;
}) => {
  const renderText = () => {
    const combinedText = words.join(" ");
    // console.log(combinedText);
    return combinedText.split("").map((char, index) => {
      let color = "inherit";
      if (input[index] && input[index] !== char) {
        color = "red";
      }
      return (
        <span key={index} style={{ color }}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="text-white text-center text-2xl flex flex-wrap">
      {renderText()}
    </div>
  );

  //   return (
  //     <div className="text-white text-center text-2xl flex flex-wrap">
  //       {words.map((word, i) => {
  //         const letters = word.split("");
  //         return (
  //           <div
  //             key={`${word}${i}`}
  //             className={`leading-none m-1 border-b-2 border-transparent ${
  //               i < currentWordIndex && "bg-green-600"
  //             }`}
  //           >
  //             {letters.map((letter, j) => (
  //               <span
  //                 key={`${letter}${j}`}
  //                 // className={`${
  //                 //   letters[currentLetterIndex] !== letters[j] && "bg-red-600"
  //                 // }`}
  //               >
  //                 {letter}
  //               </span>
  //             ))}
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
};

export default DisplayWords;
