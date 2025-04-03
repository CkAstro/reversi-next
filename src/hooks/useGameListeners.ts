'use client';

import { useCallback } from 'react';
import { useOnMessage } from '@/hooks/useOnMessage';
import { gameStore } from '@/store/gameStore';
import type { ResponsePayload } from '@/types/socket';

export const useGameListeners = () => {
   const joinGame = gameStore((s) => s.joinGame);
   const leaveGame = gameStore((s) => s.leaveGame);
   const endGame = gameStore((s) => s.endGame);
   const setBoardState = gameStore((s) => s.setBoardState);
   const updateBoardState = gameStore((s) => s.updateBoardState);
   const setOpponent = gameStore((s) => s.setOpponent);
   const addObserver = gameStore((s) => s.addObserver);
   const removeObserver = gameStore((s) => s.removeObserver);

   const handleUserJoin: ResponsePayload['game:userJoin'] = useCallback(
      (username, role) => {
         if (role === null) return;
         if (role === 0) addObserver(username);
         else setOpponent(username);
      },
      [addObserver, setOpponent]
   );

   const handleUserLeave: ResponsePayload['game:userLeave'] = useCallback(
      (username, role) => {
         if (role === 0) removeObserver(username);
      },
      [removeObserver]
   );

   useOnMessage('game:join', joinGame);
   useOnMessage('game:leave', leaveGame);
   useOnMessage('game:end', endGame);
   useOnMessage('game:userJoin', handleUserJoin);
   useOnMessage('game:userLeave', handleUserLeave);
   useOnMessage('update:boardState', updateBoardState);
   useOnMessage('fetch:boardState', setBoardState);
};
