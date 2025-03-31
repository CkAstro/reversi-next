'use client';

import { socketStore } from '@/store/socketStore';
import { useCallback } from 'react';
import type { ClientSocket } from '@/types/socket';

export const useSendMessage = () => {
   const socket = socketStore((s) => s.socket);

   const send: ClientSocket['emit'] = useCallback(
      (event, ...params) => {
         return socket.emit(event, ...params);
      },
      [socket]
   );

   return send;
};
