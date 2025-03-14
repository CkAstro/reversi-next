'use client';

import { getUniqueId } from '@/lib/utils/getUniqueId';
import { useCallback, useEffect } from 'react';
import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;
const getSocket = (): Socket | null => {
   if (socket !== null || typeof window === 'undefined') return socket;

   const storedKey = localStorage.getItem('authKey');
   const authKey = storedKey ?? getUniqueId();
   if (storedKey === null) localStorage.setItem('authKey', authKey);

   socket = io(undefined, {
      path: '/api/ws',
      auth: { key: authKey },
      addTrailingSlash: false,
      autoConnect: false,
   });

   return socket;
};

type SubscriberAction = (data: string) => void;
type Subscribe = (event: string, action: SubscriberAction) => void;
type Unsubscribe = Subscribe;
type Emit = (event: string, data: string) => void;
export function useWebSocket(wrapper = false): [Subscribe, Unsubscribe, Emit] {
   const socket = getSocket();

   const subscribe: Subscribe = useCallback(
      (event, action) => {
         if (socket === null) return;
         socket.on(event, action);
      },
      [socket]
   );

   const unsubscribe: Unsubscribe = useCallback(
      (event, action) => {
         if (socket === null) return;
         socket.off(event, action);
      },
      [socket]
   );

   const emit: Emit = useCallback(
      (event, data) => {
         if (socket === null) return;
         socket.emit(event, data);
      },
      [socket]
   );

   useEffect(() => {
      if (socket === null || !wrapper) return;

      socket.on('connect', () => {
         console.log('connected!');
      });
      socket.connect();
      return () => {
         socket.disconnect();
      };
   }, [socket, wrapper]);

   return [subscribe, unsubscribe, emit];
}
