'use client';

import { useSocket } from '@/app/games/useSocket';
import {
   // usePathname,
   useRouter,
} from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function GameRouter() {
   const router = useRouter();
   const gameId = useSocket((s) => s.game);
   const previousRoute = useRef(gameId);

   // const pathname = usePathname();
   // useEffect(() => {
   //    console.log(pathname);
   // }, [pathname]);

   // when gameId
   useEffect(() => {
      if (gameId === previousRoute.current) return;
      previousRoute.current = gameId;

      if (gameId === null) return;
      router.push(`/games/${gameId}`);
   }, [gameId, router]);

   return null;
}
