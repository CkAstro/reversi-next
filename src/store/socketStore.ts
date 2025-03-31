import { io } from 'socket.io-client';
import { create } from 'zustand';
import { path } from '@/lib/config';
import { getUniqueId } from '@/lib/utils/getUniqueId';
import type { ClientSocket } from '@/types/socket';

const getAuthKey = () => {
   if (typeof window === 'undefined') return null;

   const storedKey = localStorage.getItem('authKey');
   const authKey = storedKey ?? getUniqueId();
   if (storedKey === null) localStorage.setItem('authKey', authKey);

   return authKey;
};

interface SocketState {
   socket: ClientSocket;
}

export const socketStore = create<SocketState>(() => ({
   socket: io(undefined, {
      path,
      auth: { key: getAuthKey() },
      reconnection: true,
   }),
}));
