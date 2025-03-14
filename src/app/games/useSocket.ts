'use client';

import { getUniqueId } from '@/lib/utils/getUniqueId';
import { io } from 'socket.io-client';
import { create } from 'zustand';

type SubscriberAction = (data: string) => void;
type Subscribe = (event: string, action: SubscriberAction) => void;
type Unsubscribe = Subscribe;
type Emit = (event: string, data: string) => void;
interface SocketState {
   subscribe: Subscribe;
   unsubscribe: Unsubscribe;
   emit: Emit;
}

const getAuthKey = () => {
   if (typeof window === 'undefined') return null;

   const storedKey = localStorage.getItem('authKey');
   const authKey = storedKey ?? getUniqueId();
   if (storedKey === null) localStorage.setItem('authKey', authKey);

   return authKey;
};

export const useSocket = create<SocketState>(() => {
   const authKey = getAuthKey();
   const socket = io(undefined, {
      path: '/api/ws',
      auth: { key: authKey },
      addTrailingSlash: false,
   });

   return {
      subscribe: (event, action) => {
         socket.on(event, action);
      },
      unsubscribe: (event, action) => {
         socket.off(event, action);
      },
      emit: (event, data) => {
         socket.emit(event, data);
      },
   };
});
