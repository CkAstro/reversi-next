'use client';

import { useSocket } from '@/store/gameStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function GameRouter() {
   const router = useRouter();
   const sub = useSocket((s) => s.sub);
   const unsub = useSocket((s) => s.unsub);
   const send = useSocket((s) => s.send);
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

   // when gameId
   useEffect(() => {
      const setRoute = (gameId: string | null) => {
         router.push(`/games/${gameId ?? ''}`);
      };

      sub('game:join', setRoute);
      return () => {
         unsub('game:join', setRoute);
      };
      // if (gameId === previousRoute.current) return;
      // previousRoute.current = gameId;

      // if (gameId === null) return;
      // router.push(`/games/${gameId}`);
   }, [sub, unsub, router]);

   return null;
}
