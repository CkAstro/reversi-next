'use client';

import { useSocket } from '@/app/games/useSocket';
import {
   // usePathname,
   useRouter,
} from 'next/navigation';
import {
   useEffect,
   // useRef
} from 'react';

export default function GameRouter() {
   const router = useRouter();
   // const gameId = useSocket((s) => s.game);
   const sub = useSocket((s) => s.sub);
   const unsub = useSocket((s) => s.unsub);
   // const previousRoute = useRef<string | null>(null);

   // const pathname = usePathname();
   // useEffect(() => {
   //    console.log(pathname);
   // }, [pathname]);

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
