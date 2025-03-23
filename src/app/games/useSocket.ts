'use client';

import { getUniqueId } from '@/lib/utils/getUniqueId';
import { create } from 'zustand';
import { io } from 'socket.io-client';
import type {
   ActiveGameInfo,
   CompletedGameInfo,
   PendingGameInfo,
   ClientSocket as ReversiSocket,
} from '@/types/socket';
import type { Reversi } from '@/types/reversi';
import { createNewBoard } from '@/lib/boardState/createNewBoard';
import { path } from '@/lib/config';

const getAuthKey = () => {
   if (typeof window === 'undefined') return null;

   const storedKey = localStorage.getItem('authKey');
   const authKey = storedKey ?? getUniqueId();
   if (storedKey === null) localStorage.setItem('authKey', authKey);

   return authKey;
};

const createSocket = () => {
   return io(undefined, {
      path, // ws server path - nextjs server:'/api/ws', separate server:'/socket.io'
      auth: { key: getAuthKey() },
      reconnection: true,
   });
};

interface SocketState {
   activeGames: ActiveGameInfo[];
   pendingGames: PendingGameInfo[];
   recentGames: CompletedGameInfo[];
   game: string | null;
   gameType: 'active' | 'waiting' | 'replay' | 'not-found';
   boardState: Reversi['BoardState'];
   role: Reversi['Role'];
   opponent: Reversi['PlayerId'] | null;
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
         pendingGames: pending,
         recentGames: complete,
      });
   });

   socket.on('game:join', (gameId, role, opponentId) => {
      set({ game: gameId, role, opponent: opponentId });
   });

   socket.on('game:end', (finalState) => {
      set({ boardState: finalState });
   });

   socket.on('server:message', (message, error) => {
      if (error) console.warn(`received error from server: ${message}`);
      else console.log(`received message from server: ${message}`);
   });

   socket.on('get:boardState', (boardState) => set({ boardState }));

   return {
      activeGames: [],
      pendingGames: [],
      recentGames: [],
      game: null,
      gameType: 'active',
      boardState: createNewBoard(),
      role: null,
      opponent: null,
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
