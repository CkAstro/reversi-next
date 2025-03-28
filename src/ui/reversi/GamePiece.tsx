import clsx from 'clsx';
import type { Reversi } from '@/types/reversi';
import styles from './GamePiece.module.scss';

type PieceState = Reversi['PlayerRole'] | null;
interface GamePieceProps {
   piece: PieceState;
   preview?: PieceState;
   detailed?: boolean;
}

export const GamePiece: React.FC<GamePieceProps> = ({
   piece,
   preview = null,
   detailed = true,
}) => {
   const isBlack = (piece ?? preview) === 1;
   if (piece === null && preview === null) return null;

   if (detailed)
      return (
         <div
            className={clsx(
               'absolute top-1/10 left-1/10 right-1/10 bottom-1/10 rounded-full bg-cover',
               piece === null && 'opacity-50',
               isBlack ? styles.black : styles.white
            )}
         >
            <div />
         </div>
      );

   return (
      <div
         className={clsx(
            'absolute top-1/10 left-1/10 right-1/10 bottom-1/10 rounded-full',
            isBlack ? styles.black_simple : styles.white_simple
         )}
      />
   );
};
