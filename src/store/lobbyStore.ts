'use client';

import { create } from 'zustand';
import type {
   ActiveGameInfo,
   CompletedGameInfo,
   PendingGameInfo,
   ResponsePayload,
} from '@/types/socket';

const filterGame = <T extends { gameId: string }>(
   gameList: T[],
   gameId: string
) => gameList.filter(({ gameId: id }) => id === gameId);

const addGame = <
   T extends PendingGameInfo | ActiveGameInfo | CompletedGameInfo
>(
   gameList: T[],
   game: PendingGameInfo | ActiveGameInfo | CompletedGameInfo
) => [game as T, ...gameList];

interface LobbyState {
   pending: PendingGameInfo[];
   active: ActiveGameInfo[];
   complete: CompletedGameInfo[];

   setGames: ResponsePayload['fetch:lobby'];
   updateGames: ResponsePayload['update:lobby'];
}

export const lobbyStore = create<LobbyState>((set, get) => ({
   pending: [],
   active: [],
   complete: [],

   setGames: ({ pending, active, complete }) => {
      set({ pending, active, complete });
   },

   updateGames: (added, removed) => {
      const state = get();

      let pending = state.pending;
      let active = state.active;
      let complete = state.complete;

      for (const { type, gameId } of removed) {
         if (type === 'pending') pending = filterGame(pending, gameId);
         else if (type === 'complete') complete = filterGame(complete, gameId);
         else active = filterGame(active, gameId);
      }

      for (const { type, game } of added) {
         if (type === 'pending') pending = addGame(pending, game);
         else if (type === 'complete') complete = addGame(complete, game);
         else active = addGame(active, game);
      }

      set({ pending, active, complete });
   },
}));
