import { StateCreator } from "zustand";
import { Chef, Cred, ExecutedTrade, TradePlay, User } from "@/types";
import { StoryClient } from "@story-protocol/core-sdk";

interface GlobalState {
  user: User | null;
  chef: Chef | null;
  cred: Cred | null;
  walletBalance: string;
  totalEquity: number;
  pnl: string;
  humanityRegistered: boolean;
  user_follows: string[];
  storyClient: StoryClient | null;
  recipes: TradePlay[];
  actions: ExecutedTrade[];
}

interface GlobalActions {
  setUser: (user: User | null) => void;
  setChef: (chef: Chef | null) => void;
  setCred: (cred: Cred | null) => void;
  setWalletBalance: (bal: string) => void;
  setTotalEquity: (equity: number) => void;
  setPnl: (pnl: string) => void;
  setUserFollows: (user_follows: string[]) => void;
  setUserFollow: (user_follow: string) => void;
  setRecipes: (tradePlays: TradePlay[]) => void;
  setRecipe: (tradePlay: TradePlay) => void;
  setActions: (actions: ExecutedTrade[]) => void;
  setStoryClient: (client: StoryClient) => void;
  setHumanityRegistered: (humanityRegistered: boolean) => void;
}

export type GlobalSlice = GlobalState & GlobalActions;

export const initialGlobalState: GlobalState = {
  user: null,
  totalEquity: 0,
  walletBalance: "0",
  chef: null,
  cred: null,
  pnl: "0",
  recipes: [],
  user_follows: [],
  actions: [],
  storyClient: null,
  humanityRegistered: false,
};

export const createGlobalSlice: StateCreator<
  GlobalSlice,
  [],
  [],
  GlobalSlice
> = (set) => ({
  ...initialGlobalState,
  setUser: (user) => {
    set({ user });
  },
  setTotalEquity: (totalEquity) => {
    set({ totalEquity });
  },
  setPnl: (pnl) => {
    set({ pnl });
  },
  setChef: (chef) => {
    set({ chef });
  },
  setUserFollows: (user_follows) => {
    set({ user_follows });
  },
  setUserFollow: (user_follow) => {
    set((state) => {
      if (state.user_follows.includes(user_follow)) {
        return {
          user_follows: [...state.user_follows],
        };
      } else {
        return {
          user_follows: [...state.user_follows, user_follow],
        };
      }
    });
  },
  setRecipes: (recipes) => {
    set({ recipes });
  },
  setRecipe: (recipe) => {
    set((state) => {
      const recipes = state.recipes;
      const index = recipes.findIndex((r) => r.id === recipe.id);
      if (index === -1) {
        return {
          recipes: [...recipes, recipe],
        };
      } else {
        recipes[index] = recipe;
        return {
          recipes: [...recipes],
        };
      }
    });
  },
  setActions: (actions) => {
    set({ actions });
  },
  setWalletBalance: (walletBalance) => {
    set({ walletBalance });
  },
  setStoryClient: (client) => {
    set({ storyClient: client });
  },
  setHumanityRegistered: (humanityRegistered) => {
    set({ humanityRegistered });
  },
  setCred: (cred) => {
    set({ cred });
  },
});
