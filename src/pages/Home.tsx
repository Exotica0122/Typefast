import { FaRedo } from "react-icons/fa";
import { DebugWindow } from "../components/DebugWindow";
import { GamePlayWindow } from "../components/GamePlayWindow";
import { useTypefast } from "../hooks/useTypefast";
import { ResultWindow } from "../components/ResultWindow";

const Home = () => {
  const DEV_MODE = import.meta.env.DEV ?? false;

  const {
    wordsObject,
    currentLetterIndex,
    currentWordIndex,
    disableInput,
    inputFocus,
    inputValue,
    isFinished,
    isStarted,
    seconds,
    caretElementPosition,
    caretRef,
    mainTextTranslateDistance,
    handleEnableTyping,
    handleRestart,
    handleTyping,
    inputRef,
    wordsRef,
    wpm,
    setInputFocus,
  } = useTypefast();

  return (
    <>
      {DEV_MODE && (
        <DebugWindow
          inputFocus={inputFocus}
          disableInput={disableInput}
          inputValue={inputValue}
          currentWordIndex={currentWordIndex}
          currentLetterIndex={currentLetterIndex}
          seconds={seconds}
          isStarted={isStarted}
          isFinished={isFinished}
          caretElementPosition={caretElementPosition}
        />
      )}

      {!isFinished ? (
        <GamePlayWindow
          caretElementPosition={caretElementPosition}
          caretRef={caretRef}
          wordsRef={wordsRef}
          inputRef={inputRef}
          wordsObject={wordsObject}
          mainTextTranslateDistance={mainTextTranslateDistance}
          isStarted={isStarted}
          seconds={seconds}
          inputFocus={inputFocus}
        />
      ) : (
        <ResultWindow wpm={wpm} />
      )}

      <input
        readOnly
        ref={inputRef}
        className="absolute -z-50 m-0 select-none p-0 opacity-0"
        value={inputValue}
        onKeyDown={handleTyping}
        onKeyUp={handleEnableTyping}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
        autoComplete="false"
        autoCapitalize="false"
        data-enable-grammarly="false"
        spellCheck="false"
      />

      <button
        className="mt-4 px-6 py-2 text-neutral-400 transition-colors hover:text-neutral-100"
        onClick={handleRestart}
      >
        <FaRedo width={20} height={20} />
      </button>
    </>
  );
};

export default Home;
