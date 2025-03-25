'use client';

import { useSocket } from '@/app/games/useSocket';
import { Expandable } from '@/ui/components/expandable';
import { useEffect } from 'react';
import type { Reversi } from '@/types/reversi';
import type { ResponsePayload } from '@/types/socket';

const emptyBoardState: Reversi['BoardState'] = Array.from(
   { length: 64 },
   () => null
);

export default function History() {
   const history = useSocket((s) => s.recentGames);
   const sub = useSocket((s) => s.sub);
   const unsub = useSocket((s) => s.unsub);

   useEffect(() => {
      const handleReceiveHistory: ResponsePayload['get:games'] = ({
         complete,
      }) => {
         console.log('complete game', complete);
         complete.forEach(async ({ gameId }) => {
            const res = await fetch(`/api/${gameId}`);
            if (res.ok) {
               const data = await res.json();
               console.log('data', data);
            }
         });
      };

      sub('get:games', handleReceiveHistory);
      return () => {
         unsub('get:games', handleReceiveHistory);
      };
   }, [sub, unsub]);

   return (
      <div className="bg-gray-800 rounded-xl p-2 min-h-0 flex flex-col">
         <div className="flex flex-col gap-2 overflow-y-auto rounded-md">
            {history.map((game) => (
               <Expandable
                  key={game.gameId}
                  className="w-full bg-gray-700 p-2"
                  header={
                     <div className="w-full grid grid-cols-2 gap-2">
                        <span>{game.playerA.name}</span>
                        <span>{game.playerB.name}</span>
                     </div>
                  }
                  body={
                     <div className="w-full grid grid-cols-2 gap-2">
                        <span>{game.playerA.score}</span>
                        <span>{game.playerB.score}</span>
                     </div>
                  }
               />
            ))}
         </div>
      </div>
   );
}
