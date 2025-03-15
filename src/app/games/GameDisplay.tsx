import ActiveGame from '@/app/games/ActiveGame';
import type { ActiveGameInfo, WaitingGameInfo } from '@/types/socket';

interface GameDisplayProps {
   title: string;
   games: (WaitingGameInfo | ActiveGameInfo)[];
}

export default function GameDisplay({ title, games }: GameDisplayProps) {
   return (
      <div className="flex flex-col w-full gap-2 bg-slate-800 p-2">
         <h1 className="text-xl">{title}</h1>
         <div className="w-full flex gap-2 flex-wrap">
            {games.map((game) => (
               <ActiveGame
                  key={game.gameId}
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
