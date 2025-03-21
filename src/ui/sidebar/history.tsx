'use client';

import { useSocket } from '@/app/games/useSocket';
import { Expandable } from '@/ui/components/expandable';

export default function History() {
   const history = useSocket((s) => s.recentGames);

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
