'use client';

import { notFound } from 'next/navigation';
import { gameStore } from '@/store/gameStore';
import { useEffect, useRef } from 'react';
import { useSendMessage } from '@/hooks/useSendMessage';
import ReversiBoard from './ReversiBoard';

export default function Page(props: { params: Promise<{ gameId: string }> }) {
   const gameIdRef = useRef<string | null>(null);
   const gameStatus = gameStore((s) => s.gameStatus);
   const send = useSendMessage();

   /* we want to rely on an established connection
    * rather than api-request, so we will wait on
    * gameId param, and then request boardState via
    * websocket send
    */
   useEffect(() => {
      props.params.then(({ gameId }) => {
         if (gameIdRef.current === gameId) return;
         gameIdRef.current = gameId;

         send('fetch:boardState', gameId);
      });
   }, [props, send]);

   if (gameStatus === null) return notFound();
   return (
      <div className="w-full h-full flex items-center justify-center">
         <ReversiBoard />
      </div>
   );
}
