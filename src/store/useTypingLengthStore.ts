import { create } from "zustand";

type TypingLengthStore = {
  typingLength: number;
  typingLengthOptions: number[];
  updateTypingLength: (newTypingLength: number) => void;
};

export const useTypingLengthStore = create<TypingLengthStore>((set) => ({
  typingLength: 30,
  typingLengthOptions: [15, 30, 60],
  updateTypingLength: (newTypingLength: number) =>
    set({ typingLength: newTypingLength }),
}));
