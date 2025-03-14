'use client';

import { useWebSocket } from '@/hooks/useWebSocket';

export default function WebSocket() {
   useWebSocket(true);

   return null;
}
