import clsx from 'clsx';

export type GamePieceState = 1 | -1 | null;

interface GamePieceProps {
   piece: GamePieceState;
   preview: GamePieceState;
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
