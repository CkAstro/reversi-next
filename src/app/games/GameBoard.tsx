// cSpell:words unsub
'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import GamePiece from '@/app/games/GamePiece';
import { getStateFlips } from '@/lib/getStateFlips';
import { validateMove } from '@/lib/validateMove';
import { useWebSocket } from '@/hooks/useWebSocket';
import type { ReversiBoardState, ReversiPlayer } from '@/types/reversi';
import { parseBoardState } from '@/lib/boardState/parseBoardState';

export default function GameBoard() {
   const [turn, setTurn] = useState<ReversiPlayer>(1);
   // const [message, setMessage] = useState('');
   const [mouseoverIndex, setMouseoverIndex] = useState(-1);
   const [highlights, setHighlights] = useState<number[]>([]);
   const [boardState, setBoardState] = useState<ReversiBoardState>(
      Array.from({ length: 64 }, () => null)
   );

   useEffect(() => {
      setHighlights([]);
   }, [boardState]);

   const [sub, unsub] = useWebSocket();
   useEffect(() => {
      const onBoardUpdate = (serializedState: string) => {
         const boardState = parseBoardState(serializedState);
         setBoardState(boardState);
      };

      sub('boardUpdate', onBoardUpdate);
      return () => {
         unsub('boardUpdate', onBoardUpdate);
      };
   }, [sub, unsub]);

   const setPlayerMessage = (type: 'invalid' | 'player1' | 'player2') => {
      if (type === 'invalid') console.log('not your move');
      else if (type === 'player1') console.log('player 1 turn');
      else console.log('player 2 turn');
   };

   const handleClick = (index: number) => {
      if (boardState[index] !== null) return;

      const newState = validateMove(boardState, turn, index);
      if (newState === null) {
         setPlayerMessage('invalid');
         return;
      }

      setTurn((prev) => {
         const next = -prev as 1 | -1;
         setPlayerMessage(next === 1 ? 'player1' : 'player2');

         return next;
      });
      setBoardState(newState);
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
      <div className="p-4 bg-stone-800 grid grid-cols-8 select-none user-drag:none">
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
   );
}
