import { DebugWindow } from "../components/DebugWindow";
import { GamePlayWindow } from "../components/GamePlayWindow";
import { useTypefast } from "../hooks/useTypefast";
import { ResultWindow } from "../components/ResultWindow";
import { RestartButton } from "../components/ui/RestartButton";

const Home = () => {
  const DEV_MODE = import.meta.env.DEV ?? false;

  const {
    wordsObject,
    currentLetterIndex,
    currentWordIndex,
    inputFocus,
    inputValue,
    isFinished,
    isStarted,
    seconds,
    caretElementPosition,
    caretRef,
    mainTextTranslateDistance,
    inputRef,
    wordsRef,
    wpm,
    wpmHistory,
    accuracy,
    setInputFocus,
    handleBackspace,
    handleRestart,
    handleTyping,
  } = useTypefast();

  return (
    <>
      {DEV_MODE && (
        <DebugWindow
          inputFocus={inputFocus}
          inputValue={inputValue}
          currentWordIndex={currentWordIndex}
          currentLetterIndex={currentLetterIndex}
          seconds={seconds}
          isStarted={isStarted}
          isFinished={isFinished}
          caretElementPosition={caretElementPosition}
        />
      )}

      <div className="flex flex-col gap-12">
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
          <ResultWindow accuracy={accuracy} wpmHistory={wpmHistory} />
        )}

        <input
          readOnly
          ref={inputRef}
          className="absolute -z-50 m-0 select-none p-0 opacity-0"
          value={inputValue}
          onKeyDown={handleBackspace}
          onKeyPress={handleTyping}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          autoComplete="false"
          autoCapitalize="false"
          data-enable-grammarly="false"
          spellCheck="false"
        />

        <div className="flex items-start justify-center">
          <RestartButton handleRestart={handleRestart} />
        </div>
      </div>
    </>
  );
};

export default Home;
