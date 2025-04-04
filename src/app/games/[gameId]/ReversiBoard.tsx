'use client';

import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { gameStore } from '@/store/gameStore';
import { getStateFlips } from '@/lib/boardState/getStateFlips';
import type { Reversi } from '@/types/reversi';
import { GamePiece } from '@/ui/reversi/GamePiece';
import { useOnMessage } from '@/hooks/useOnMessage';
import { useSendMessage } from '@/hooks/useSendMessage';

const Highlight: React.FC<{ highlight: boolean }> = ({ highlight }) => (
   <div
      className={clsx(
         'absolute top-0 left-0 right-0 bottom-0 border-2 border-yellow-600 opacity-0 transition-opacity transition-300',
         highlight && 'opacity-100'
      )}
   />
);

export default function ReversiBoard() {
   const boardState = gameStore((s) => s.boardState);
   const gameId = gameStore((s) => s.gameId);
   const role = gameStore((s) => s.role);

   const send = useSendMessage();

   const [highlights, setHighlights] = useState<number[]>([]);
   const [mouseoverIndex, setMouseoverIndex] = useState(-1);

   const handleClick = (index: number) => {
      if (boardState[index] !== null || gameId === null) return;
      send('player:move', gameId, index);
   };

   const handlePointerEnter = (index: number) => {
      setMouseoverIndex(index);

      if (role === null || role === 0 || boardState[index] !== null) return;

      const flippedPieces = getStateFlips(boardState, role, index);
      setHighlights(flippedPieces);
   };

   const handlePointerLeave = () => {
      setMouseoverIndex(-1);
      setHighlights([]);
   };

   const handleGameOver = useCallback(
      (_finalBoardState: Reversi['BoardState'], winner: Reversi['Role']) => {
         if (winner === 0) console.log("Game over: It's a tie!");
         else if (winner === role) console.log('Game over: You win!');
         else console.log('Game over: You lose!');
      },
      [role]
   );

   useOnMessage('game:end', handleGameOver);

   return (
      <div className="flex flex-col">
         <span>
            you are {role === 1 ? 'black' : role === -1 ? 'white' : 'observing'}
         </span>

         <div className="p-4 bg-stone-800 grid grid-cols-8 select-none user-drag:none">
            {boardState.map((piece, index) => (
               <div
                  key={index}
                  className="relative w-11 h-11 bg-green-700 border-2 border-stone-800"
                  onClick={() => handleClick(index)}
                  onPointerEnter={() => handlePointerEnter(index)}
                  onPointerLeave={handlePointerLeave}
               >
                  <Highlight highlight={highlights.includes(index)} />
                  <GamePiece
                     piece={piece}
                     preview={
                        mouseoverIndex === index && role !== 0 ? role : null
                     }
                  />
               </div>
            ))}
         </div>
      </div>
   );
}
