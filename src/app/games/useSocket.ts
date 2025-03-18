'use client';

import { getUniqueId } from '@/lib/utils/getUniqueId';
import { create } from 'zustand';
import { io } from 'socket.io-client';
import type {
   ActiveGameInfo,
   CompletedGameInfo,
   PlayerName,
   PendingGameInfo,
   ClientSocket as ReversiSocket,
} from '@/types/socket';
import type { Reversi } from '@/types/reversi';
import { createNewBoard } from '@/lib/boardState/createNewBoard';

const getAuthKey = () => {
   if (typeof window === 'undefined') return null;

   const storedKey = localStorage.getItem('authKey');
   const authKey = storedKey ?? getUniqueId();
   if (storedKey === null) localStorage.setItem('authKey', authKey);

   return authKey;
};

const createSocket = () => {
   const separateServer =
      process.env.NEXT_PUBLIC_DEDICATED_SOCKET_SERVER === 'true';
   const socketUrl = separateServer ? 'ws://localhost:3001' : undefined;
   const path = separateServer ? undefined : '/api/ws';
   return io(socketUrl, {
      path,
      auth: { key: getAuthKey() },
      reconnection: true,
      addTrailingSlash: separateServer,
   });
};

interface SocketState {
   activeGames: ActiveGameInfo[];
   waitingGames: PendingGameInfo[];
   recentGames: CompletedGameInfo[];
   game: string | null;
   gameType: 'active' | 'waiting' | 'replay' | 'not-found';
   boardState: Reversi['BoardState'];
   role: Reversi['PlayerRole'];
   playerA: PlayerName | null;
   playerB: PlayerName | null;
   observerCount: number;
   sub: ReversiSocket['on'];
   unsub: ReversiSocket['off'];
   send: ReversiSocket['emit'];
}

export const useSocket = create<SocketState>((set) => {
   const socket: ReversiSocket = createSocket();
   socket.on('connect', () => console.log('connected to server'));
   socket.on('disconnect', () => console.log('disconnected from server'));

   socket.on('get:games', ({ active, complete, pending }) => {
      set({
         activeGames: active,
         waitingGames: pending,
         recentGames: complete,
      });
   });

   socket.on('game:join', (gameId) => {
      set({ game: gameId });
   });

   socket.on('server:message', (message, error) => {
      if (error) console.warn(`received error from server: ${message}`);
      else console.log(`received message from server: ${message}`);
   });

   socket.on('get:boardState', (boardState) => set({ boardState }));

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
      sub: (event, action) => {
         return socket.on(event, action);
      },
      unsub: (event, action) => {
         return socket.off(event, action);
      },
      send: (event, ...request) => {
         if (process.env.NEXT_PUBLIC_DEBUG === 'true')
            console.log(
               'sending event',
               event,
               '| socket status',
               socket.connected
            );

         return socket.emit(event, ...request);
      },
   };
});
