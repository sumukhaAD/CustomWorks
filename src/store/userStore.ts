import { create } from "zustand";
import type { User } from "@/types";

interface UserState {
  user: User | null;
  setUser: (u: User | null) => void;
  signOut: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  signOut: () => set({ user: null }),
}));
