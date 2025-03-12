'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import GamePiece, { type GamePieceState } from '@/app/games/GamePiece';
import { getStateFlips } from '@/lib/getStateFlips';

export default function GameBoard() {
   const [turn, setTurn] = useState<1 | -1>(1);
   const [mouseoverIndex, setMouseoverIndex] = useState(-1);
   const [highlights, setHighlights] = useState<number[]>([]);
   const [gameState, setGameState] = useState<GamePieceState[]>(
      Array.from({ length: 64 }, () => null)
   );

   useEffect(() => {
      setHighlights([]);
   }, [gameState]);

   const handleClick = (index: number) => {
      if (gameState[index] !== null) return;

      const newState = [...gameState];
      newState[index] = turn;
      setTurn((prev) => -prev as 1 | -1);
      setGameState(newState);
   };

   const handlePointerEnter = (index: number) => {
      setMouseoverIndex(index);

      if (gameState[index] !== null) return;

      const flippedPieces = getStateFlips(gameState, turn, index);
      setHighlights(flippedPieces);
   };

   const handlePointerLeave = () => {
      setMouseoverIndex(-1);
      setHighlights([]);
   };

   return (
      <div className="p-4 bg-stone-800 grid grid-cols-8 select-none user-drag:none">
         {gameState.map((piece, i) => (
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
   );
}
