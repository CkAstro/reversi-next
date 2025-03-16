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
   RequestPayload,
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
   game: string | null;
   gameType: 'active' | 'waiting' | 'replay' | 'not-found';
   boardState: ReversiBoardState;
   role: ReversiPlayer;
   playerA: PlayerName | null;
   playerB: PlayerName | null;
   observerCount: number;
   send: <E extends keyof RequestPayload>(
      event: E,
      ...args: Parameters<RequestPayload[E]>
   ) => void;
}

export const useSocket = create<SocketState>((set) => {
   const authKey = getAuthKey();
   const socket: ReversiSocket = io(undefined, {
      path: '/api/ws',
      auth: { key: authKey },
      addTrailingSlash: false,
      reconnection: true,
   });
   // const socket: ReversiSocket = io('ws://localhost:3000', {
   //    auth: { key: authKey },
   //    reconnection: true,
   // });

   socket.on('connect', () => console.log('connected'));
   socket.on('disconnect', () => console.log('disconnected'));

   socket.on('init', ({ active, complete, waiting }) => {
      set({
         activeGames: active,
         waitingGames: waiting,
         recentGames: complete,
      });
   });

   socket.on('join', (gameId) => {
      set({ game: gameId });
   });

   return {
      activeGames: [],
      waitingGames: [],
      recentGames: [],
      game: null,
      gameType: 'active',
      boardState: createNewBoard(),
      role: 1,
      playerA: null,
      playerB: null,
      observerCount: 0,
      send: (event, ...request) => {
         if (process.env.DEBUG === 'true')
            console.log(
               'sending event',
               event,
               '| socket status',
               socket.connected
            );

         socket.emit(event, ...request);
      },
   };
});
