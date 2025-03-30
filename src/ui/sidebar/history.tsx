'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/store/gameStore';
import { Expandable } from '@/ui/components/expandable';
import { GamePiece } from '@/ui/reversi/GamePiece';
import type { Reversi } from '@/types/reversi';
import type { ResponsePayload } from '@/types/socket';

const emptyBoardState: Reversi['BoardState'] = Array.from(
   { length: 64 },
   () => null
);

const Board: React.FC<{ boardState: Reversi['BoardState'] }> = ({
   boardState,
}) => (
   <div className="bg-black aspect-square grid grid-cols-8 gap-[1px] select-none user-drag:none">
      {boardState.map((square, ind) => (
         <div key={ind} className="bg-green-700 aspect-square w-3.5 relative">
            <GamePiece piece={square} detailed={false} />
         </div>
      ))}
   </div>
);

export default function History() {
   const history = useSocket((s) => s.recentGames);
   const [boardState, setBoardState] = useState<
      Record<string, Reversi['BoardState']>
   >({});
   const sub = useSocket((s) => s.sub);
   const unsub = useSocket((s) => s.unsub);

   useEffect(() => {
      const handleReceiveHistory: ResponsePayload['fetch:lobby'] = ({
         complete,
      }) => {
         complete.forEach(async ({ gameId }) => {
            const res = await fetch(`/api/games/${gameId}`, { method: 'GET' });
            if (res.ok) {
               const data = await res.json();
               setBoardState((prev) => ({
                  ...prev,
                  [gameId]: data.finalState,
               }));
            }
         });
      };

      sub('fetch:lobby', handleReceiveHistory);
      return () => {
         unsub('fetch:lobby', handleReceiveHistory);
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
                        <Board
                           boardState={
                              boardState[game.gameId] ?? emptyBoardState
                           }
                        />
                        <div className="flex flex-col center-items">
                           <div>
                              <span>Score:</span>
                              <span>{game.playerA.score}</span>
                              <span>vs</span>
                              <span>{game.playerB.score}</span>
                           </div>
                           {game.playerA.score === game.playerB.score ? (
                              <div>Tie</div>
                           ) : (
                              <div>
                                 winner:{' '}
                                 {game.playerA.score > game.playerB.score
                                    ? game.playerA.name
                                    : game.playerB.name}
                              </div>
                           )}
                           <div>View Match</div>
                        </div>
                     </div>
                  }
               />
            ))}
         </div>
      </div>
   );
}
