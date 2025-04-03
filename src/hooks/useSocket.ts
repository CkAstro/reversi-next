import { nameStore } from '@/store/nameStore';
import { socketStore } from '@/store/socketStore';
import { useCallback } from 'react';

export const useSocket = () => {
   const username = nameStore((s) => s.username);
   const connectClient = socketStore((s) => s.connect);

   const connect = useCallback(() => {
      connectClient(username);
   }, [connectClient, username]);

   return [connect];
};
