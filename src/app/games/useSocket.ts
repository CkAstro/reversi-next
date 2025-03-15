'use client';

import { getUniqueId } from '@/lib/utils/getUniqueId';
import { create } from 'zustand';
import { io } from 'socket.io-client';
import type {
   ActiveGameInfo,
   CompletedGameInfo,
   PlayerName,
   WaitingGameInfo,
   ClientSocket as ReversiSocket,
} from '@/types/socket';
import type { ReversiBoardState, ReversiPlayer } from '@/types/reversi';
import { createNewBoard } from '@/lib/boardState/createNewBoard';

const getAuthKey = () => {
   if (typeof window === 'undefined') return null;

   const storedKey = localStorage.getItem('authKey');
   const authKey = storedKey ?? getUniqueId();
   if (storedKey === null) localStorage.setItem('authKey', authKey);

   return authKey;
};

interface SocketState {
   activeGames: ActiveGameInfo[];
   waitingGames: WaitingGameInfo[];
   recentGames: CompletedGameInfo[];
   boardState: ReversiBoardState;
   role: ReversiPlayer;
   playerA: PlayerName | null;
   playerB: PlayerName | null;
   observerCount: number;
}

export const useSocket = create<SocketState>((set) => {
   const authKey = getAuthKey();
   const socket: ReversiSocket = io(undefined, {
      path: '/api/ws',
      auth: { key: authKey },
      addTrailingSlash: false,
   });

   socket.on('init', ({ active, complete, waiting }) => {
      set({
         activeGames: active,
         waitingGames: waiting,
         recentGames: complete,
      });
   });

   return {
      activeGames: [],
      waitingGames: [],
      recentGames: [],
      boardState: createNewBoard(),
      role: 1,
      playerA: null,
      playerB: null,
      observerCount: 0,
   };
});
