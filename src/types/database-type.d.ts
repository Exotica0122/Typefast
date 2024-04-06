import { Database } from "./supabase";

declare global {
  type TypingHistory = Database["public"]["Tables"]["typing_history"]["Row"];
  type Users = Database["public"]["Tables"]["users"]["Row"];
}
