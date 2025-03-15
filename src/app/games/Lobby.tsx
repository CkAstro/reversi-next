// cSpell:words unsub
'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import GamePiece from '@/app/games/GamePiece';
import { getStateFlips } from '@/lib/getStateFlips';
import type { ReversiBoardState, ReversiPlayer } from '@/types/reversi';
import { useSocket } from '@/app/games/useSocket';
import GameDisplay from '@/app/games/GameDisplay';
import GameHistory from '@/app/games/GameHistory';

export default function Lobby() {
   const [turn, _setTurn] = useState<ReversiPlayer>(1);
   const [mouseoverIndex, setMouseoverIndex] = useState(-1);
   const [highlights, setHighlights] = useState<number[]>([]);
   const [boardState, _setBoardState] = useState<ReversiBoardState>(
      Array.from({ length: 64 }, () => null)
   );

   const activeGames = useSocket((s) => s.activeGames);
   const waitingGames = useSocket((s) => s.waitingGames);

   useEffect(() => {
      setHighlights([]);
   }, [boardState]);

   const send = useSocket((s) => s.send);
   const handleClick = (index: number) => {
      if (boardState[index] !== null) return;

      send('move', { square: index, role: turn });
   };

   const handlePointerEnter = (index: number) => {
      setMouseoverIndex(index);

      if (boardState[index] !== null) return;

      const flippedPieces = getStateFlips(boardState, turn, index);
      setHighlights(flippedPieces);
   };

   const handlePointerLeave = () => {
      setMouseoverIndex(-1);
      setHighlights([]);
   };

   return (
      <div className="flex flex-col md:flex-row gap-2 max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg">
         <div className="w-full h-full flex flex-col gap-2">
            <GameDisplay title="Waiting" games={waitingGames} />
            <GameDisplay title="Active" games={activeGames} />
            <div className="w-full h-full flex flex-col gap-2 bg-slate-800 p-2">
               <h2 className="text-xl">Current Game</h2>
               <div className="p-4 w-96 h-96 bg-stone-800 grid grid-cols-8 select-none user-drag:none">
                  {boardState.map((piece, i) => (
                     <div
                        key={i}
                        className="relative w-11 h-11 bg-green-700 border-[2px] border-stone-800"
                        onClick={() => handleClick(i)}
                        onPointerEnter={() => handlePointerEnter(i)}
                        onPointerLeave={handlePointerLeave}
                     >
                        {
                           <div
                              className={clsx(
                                 'absolute top-0 left-0 right-0 bottom-0 border-[2px] border-yellow-600 opacity-0 transition-opacity transition-300',
                                 highlights.includes(i) && 'opacity-100'
                              )}
                           />
                        }
                        <GamePiece
                           piece={piece}
                           preview={i === mouseoverIndex ? turn : null}
                        />
                     </div>
                  ))}
               </div>
            </div>
         </div>
         <GameHistory />
      </div>
   );
}
