// cSpell:words unsub
'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import GamePiece from '@/app/games/GamePiece';
import { getStateFlips } from '@/lib/getStateFlips';
import { validateMove } from '@/lib/validateMove';
import { useWebSocket } from '@/hooks/useWebSocket';
import type { ReversiBoardState, ReversiPlayer } from '@/types/reversi';

export default function GameBoard() {
   const [turn, setTurn] = useState<ReversiPlayer>(1);
   // const [message, setMessage] = useState('');
   const [mouseoverIndex, setMouseoverIndex] = useState(-1);
   const [highlights, setHighlights] = useState<number[]>([]);
   const [gameState, setGameState] = useState<ReversiBoardState>(
      Array.from({ length: 64 }, () => null)
   );

   useEffect(() => {
      setHighlights([]);
   }, [gameState]);

   const [sub, unsub] = useWebSocket();
   useEffect(() => {
      const onCustom = (d: string) =>
         console.log('custom event response', JSON.parse(d));

      sub('custom', onCustom);
      return () => {
         unsub('custom', onCustom);
      };
   }, [sub, unsub]);

   const setPlayerMessage = (type: 'invalid' | 'player1' | 'player2') => {
      if (type === 'invalid') console.log('not your move');
      else if (type === 'player1') console.log('player 1 turn');
      else console.log('player 2 turn');
   };

   const handleClick = (index: number) => {
      if (gameState[index] !== null) return;

      const newState = validateMove(gameState, turn, index);
      if (newState === null) {
         setPlayerMessage('invalid');
         return;
      }

      setTurn((prev) => {
         const next = -prev as 1 | -1;
         setPlayerMessage(next === 1 ? 'player1' : 'player2');

         return next;
      });
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
