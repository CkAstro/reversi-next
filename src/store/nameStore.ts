'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Reversi } from '@/types/reversi';

interface UsernameState {
   username: Reversi['Username'];
   nameList: Reversi['Username'][];
   setUsername: (username: Reversi['Username']) => void;
}

export const nameStore = create<UsernameState>()(
   persist(
      (set, get) => ({
         username: '',
         nameList: [],
         setUsername: (username) => {
            const list = get().nameList;
            const updatedList = list.includes(username)
               ? list
               : [...list, username];
            set({ username, nameList: updatedList });
         },
      }),
      {
         name: 'usernames',
         partialize: (state) => ({
            active: state.username,
            list: state.nameList,
         }),
      }
   )
);
