'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useGameListeners } from '@/hooks/useGameListeners';
import { useOnMessage } from '@/hooks/useOnMessage';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useLobbyListeners } from '@/hooks/useLobbyListeners';
import type { Reversi } from '@/types/reversi';

export default function GameRouter() {
   const router = useRouter();
   const send = useSendMessage();
   const previousId = useRef<string | null>(null);

   const pathname = usePathname();
   useEffect(() => {
      const gameId = pathname?.startsWith('/games/')
         ? pathname.split(/\/games\/([^\/]+)$/)[1]
         : null;

      if (gameId === previousId.current) return;
      previousId.current = gameId;

      if (gameId !== null) send('game:join', gameId);
   }, [pathname, send]);

   const handleSetRoute = useCallback(
      (gameId: Reversi['GameId'] | null) => {
         router.push(`/games/${gameId ?? ''}`);
      },
      [router]
   );

   useOnMessage('game:join', handleSetRoute);
   useGameListeners();
   useLobbyListeners();

   return null;
}
