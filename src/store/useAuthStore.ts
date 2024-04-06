import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

type AuthStore = {
  session: Session | null;
  updateSession: (session: Session | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  updateSession: (newSession: Session | null) => set({ session: newSession }),
}));
