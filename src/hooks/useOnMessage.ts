'use client';

import { useEffect } from 'react';
import { socketStore } from '@/store/socketStore';
import type { ResponsePayload } from '@/types/socket';

// NOTE: both the function type definition and the typed arguments seem to be required.
type UseOnMessage = <E extends keyof ResponsePayload>(
   event: E,
   action: ResponsePayload[E]
) => void;
export const useOnMessage: UseOnMessage = (
   event: keyof ResponsePayload,
   action: ResponsePayload[keyof ResponsePayload]
) => {
   const socket = socketStore((s) => s.socket);

   useEffect(() => {
      socket.on(event, action);

      return () => {
         socket.off(event, action);
      };
   }, [event, action, socket]);
};
