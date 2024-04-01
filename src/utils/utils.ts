import wordsJSON from "../words/words.json";

type RandomLetter = {
  id: number;
  value: string;
  typedValue?: string;
  isTyped: boolean;
  isError: boolean;
  isDeletable: boolean;
};

export type RandomWord = {
  id: number;
  isTyped: boolean;
  isError: boolean;
  word: RandomLetter[];
};

export function generateRandomWords(length: number) {
  const randomWords = [];
  for (let i = 0; i < length; ++i) {
    const randomWord =
      wordsJSON.words[Math.floor(Math.random() * wordsJSON.length)];
    randomWords.push(randomWord);
  }

  let wordIdCounter = 0;
  let letterIdCounter = 0;
  const randomWordsObject: RandomWord[] = randomWords.map((word) => {
    return {
      id: wordIdCounter++,
      isTyped: false,
      isError: false,
      word: word.split("").map((letter, j) => {
        return {
          id: letterIdCounter++,
          value: letter,
          isTyped: false,
          isError: false,
          isDeletable: false,
        };
      }),
    };
  });

  return { randomWordsObject, randomWords };
}

export const keysToTrack = [
  "NumpadMultiply",
  "NumpadSubtract",
  "NumpadAdd",
  "NumpadDecimal",
  "NumpadEqual",
  "NumpadDivide",
  "Numpad0",
  "Numpad1",
  "Numpad2",
  "Numpad3",
  "Numpad4",
  "Numpad5",
  "Numpad6",
  "Numpad7",
  "Numpad8",
  "Numpad9",
  "Backquote",
  "Digit1",
  "Digit2",
  "Digit3",
  "Digit4",
  "Digit5",
  "Digit6",
  "Digit7",
  "Digit8",
  "Digit9",
  "Digit0",
  "Minus",
  "Equal",
  "KeyQ",
  "KeyW",
  "KeyE",
  "KeyR",
  "KeyT",
  "KeyY",
  "KeyU",
  "KeyI",
  "KeyO",
  "KeyP",
  "BracketLeft",
  "BracketRight",
  "Backslash",
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyF",
  "KeyG",
  "KeyH",
  "KeyJ",
  "KeyK",
  "KeyL",
  "Semicolon",
  "Quote",
  "IntlBackslash",
  "KeyZ",
  "KeyX",
  "KeyC",
  "KeyV",
  "KeyB",
  "KeyN",
  "KeyM",
  "Comma",
  "Period",
  "Slash",
  "Space",
  // "Enter",
  // "Tab",
  "NoCode", //android (smells) and some keyboards might send no location data - need to use this as a fallback
];
