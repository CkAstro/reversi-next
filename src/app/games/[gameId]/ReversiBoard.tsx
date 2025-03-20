'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { useSocket } from '@/app/games/useSocket';
import { getStateFlips } from '@/lib/getStateFlips';

const Highlight: React.FC<{ highlight: boolean }> = ({ highlight }) => (
   <div
      className={clsx(
         'absolute top-0 left-0 right-0 bottom-0 border-2 border-yellow-600 opacity-0 transition-opacity transition-300',
         highlight && 'opacity-100'
      )}
   />
);

const BoardPiece: React.FC<{
   piece: 1 | -1 | null;
   preview: 1 | -1 | null;
}> = ({ piece, preview }) => {
   if (piece === null && preview === null) return null;

   return (
      <div
         className={clsx(
            'absolute top-1/10 left-1/10 right-1/10 bottom-1/10 rounded-full',
            piece === null && 'opacity-50',
            (piece ?? preview) === 1 && 'bg-black',
            (piece ?? preview) === -1 && 'bg-white'
         )}
      />
   );
};

export default function ReversiBoard() {
   const boardState = useSocket((s) => s.boardState);
   const send = useSocket((s) => s.send);
   const gameId = useSocket((s) => s.game);

   const [highlights, setHighlights] = useState<number[]>([]);
   const role = useSocket((s) => s.role);
   const [mouseoverIndex, setMouseoverIndex] = useState(-1);

   const handleClick = (index: number) => {
      if (boardState[index] !== null || gameId === null) return;
      send('player:move', gameId, index);
   };

   const handlePointerEnter = (index: number) => {
      setMouseoverIndex(index);

      if (role === null || boardState[index] !== null) return;

      const flippedPieces = getStateFlips(boardState, role, index);
      setHighlights(flippedPieces);
   };

   const handlePointerLeave = () => {
      setMouseoverIndex(-1);
      setHighlights([]);
   };

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
                  <BoardPiece
                     piece={piece}
                     preview={mouseoverIndex === index ? role : null}
                  />
               </div>
            ))}
         </div>
      </div>
   );
}
