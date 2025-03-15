import type { ReversiSquareState } from '@/types/reversi';
import clsx from 'clsx';

interface GamePieceProps {
   piece: ReversiSquareState;
   preview: ReversiSquareState;
}

function GamePiece({ piece, preview }: GamePieceProps) {
   if (piece === null && preview === null) return null;

   return (
      <div
         className={clsx(
            'absolute top-1/10 left-1/10 right-1/10 bottom-1/10 rounded-full',
            piece === null && preview !== null && 'opacity-50',
            (piece ?? preview) === 1 && 'bg-black',
            (piece ?? preview) === -1 && 'bg-white'
         )}
      />
   );
}

export default GamePiece;
