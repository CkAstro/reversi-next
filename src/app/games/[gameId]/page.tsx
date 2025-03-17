'use client';

import { notFound } from 'next/navigation';
import { useSocket } from '@/app/games/useSocket';
import { useEffect, useRef } from 'react';
import ReversiBoard from '@/app/games/[gameId]/ReversiBoard';

export default function Page(props: { params: Promise<{ gameId: string }> }) {
   const gameIdRef = useRef<string | null>(null);
   const gameType = useSocket((s) => s.gameType);
   const send = useSocket((s) => s.send);

   /* we want to rely on an established connection
    * rather than api-request, so we will wait on
    * gameId param, and then request boardState via
    * websocket send
    */
   useEffect(() => {
      props.params.then(({ gameId }) => {
         if (gameIdRef.current === gameId) return;
         gameIdRef.current = gameId;

         send('get:boardState', gameId);
      });
   }, [props, send]);

   if (gameType === 'not-found') return notFound();
   return (
      <div className="w-full h-full flex items-center justify-center">
         <ReversiBoard />
      </div>
   );
}
