import ActiveGame from '@/app/games/ActiveGame';
import { useSocket } from '@/app/games/useSocket';
import type { ActiveGameInfo, WaitingGameInfo } from '@/types/socket';

interface GameDisplayProps {
   title: string;
   type: 'new' | 'waiting' | 'active';
   games: (WaitingGameInfo | ActiveGameInfo)[];
}

export default function GameDisplay({
   title,
   type,
   games = [],
}: GameDisplayProps) {
   const send = useSocket((s) => s.send);

   const handleClick = (gameId: string) => {
      if (type === 'waiting') send('game:join', gameId);
      else if (type === 'active') send('game:observe', gameId);
      else send('game:create');
   };

   return (
      <div className="flex flex-col w-full gap-2 bg-slate-800 p-2">
         <h1 className="text-xl">{title}</h1>
         <div className="w-full flex gap-2 flex-wrap">
            {games.map((game) => (
               <ActiveGame
                  key={game.gameId}
                  onClick={handleClick}
                  gameId={game.gameId}
                  playerA={game.playerA}
                  playerB={game.playerB}
                  observerCount={0}
               />
            ))}
         </div>
      </div>
   );
}
