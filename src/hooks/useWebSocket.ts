'use client';

import { useCallback, useEffect } from 'react';
import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;
export const getWebSocket = (): Socket => {
   if (socket === null)
      socket = io(undefined, {
         path: '/api/ws',
         addTrailingSlash: false,
         autoConnect: false,
      });

   return socket;
};

type SubscriberAction = (data: string) => void;
export function useWebSocket() {
   // const [isConnected, setIsConnected] = useState(false);
   const socket = getWebSocket();

   const subscribe = useCallback(
      (event: string, action: SubscriberAction) => {
         socket.on(event, action);
      },
      [socket]
   );

   const unsubscribe = useCallback(
      (event: string, action: SubscriberAction) => {
         socket.off(event, action);
      },
      [socket]
   );

   useEffect(() => {
      socket.connect();
      socket.on('connect', () => {
         console.log('connected!');
      });
      socket.on('connect', () => {
         console.log('more messages');
      });

      return () => {
         socket.disconnect();
      };
   }, [socket]);

   return [subscribe, unsubscribe];
}
