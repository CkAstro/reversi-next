'use client';

import { useOnMessage } from '@/hooks/useOnMessage';
import { lobbyStore } from '@/store/lobbyStore';

export const useLobbyListeners = () => {
   const setGames = lobbyStore((s) => s.setGames);
   const updateGames = lobbyStore((s) => s.updateGames);

   useOnMessage('fetch:lobby', setGames);
   useOnMessage('update:lobby', updateGames);
};
