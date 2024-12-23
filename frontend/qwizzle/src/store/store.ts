import { create } from "zustand";
import API_URL from "../config";
import { SetWithExtraType } from "../pages/learn/SetByIdOverview";

import { persist } from "zustand/middleware";

export interface User {
  id: number;
  username: string;
  token: string;
  email: string;
  expiry?: number;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export interface SetOverallType {
  id: number;
  name: string;
  description: string;
  langFrom: string;
  langTo: string;
  userId: number;
  user: string;
}

// const useUserStore = create<UserState>()(
//   persist(
//     (set) => ({
//       user: null,
//       setUser: (user: User) => set({ user }),
//       clearUser: () => set({ user: null }),
//     }),
//     {
//       name: "user-storage", // Klucz w localStorage
//       partialize: (state) => ({ user: state.user }), // Zapisuje tylko `user`
//     },
//   ),
// );

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => {
        const expiry = Date.now() + 2 * 60 * 60 * 1000; // 2 godziny od teraz
        set({ user: { ...user, expiry } });
      },
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", // Klucz w localStorage
      partialize: (state) => ({ user: state.user }), // Zapisuje tylko `user`
      onRehydrateStorage: () => (state) => {
        if (state?.user?.expiry && state.user.expiry < Date.now()) {
          state.user = null; // Czyść użytkownika, jeśli dane są przeterminowane
        }
      },
    },
  ),
);

export const getToken = () => {
  const state = useUserStore.getState();
  return state.user ? state.user.token : null;
};

export const logOut = () => {
  const state = useUserStore.getState();
  if (state.user) {
    useUserStore.setState({ user: null });
  }
};

export const isLoggedIn = () => {
  const state = useUserStore.getState();
  return state.user !== null;
};

export function getUserId() {
  const state = useUserStore.getState();
  return state.user?.id;
}

// Check if set :id is saved
export const isSetSaved = async (setId: string) => {
  const token = getToken();
  const res = await fetch(API_URL + "/sets/saved", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  });

  const data = await res.json();

  if (res.ok) {
    if (data.data.length === 0) {
      return false;
    }
    return data.data.some((set: SetOverallType) => set.id.toString() === setId);
  } else {
    console.log(data.message);
  }
};

// Add sets to bookmarks
export async function addSetToBookmarks(setId: number) {
  console.log(setId, "essa213");
  const res = await fetch(API_URL + `/sets/saved/${setId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${getToken()}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }
}

// Remove sets from bookmarks
export async function removeSetFromBookmarks(setId: number) {
  const res = await fetch(API_URL + `/sets/saved/${setId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${getToken()}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }
}

// Check if user is the owner of the set
export function isSetOwner(set: SetWithExtraType) {
  const id = getUserId();
  return id === set.userId;
}

export default useUserStore;
