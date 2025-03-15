import { useSocket } from '@/app/games/useSocket';

export default function GameHistory() {
   const history = useSocket((s) => s.recentGames);

   return (
      <div className="w-100 bg-slate-800 flex flex-col gap-2 p-2">
         {history.map((game) => (
            <div key={game.gameId} className="w-full bg-slate-600 flex p-2">
               {[game.playerA, game.playerB].map((player) => (
                  <div key={player.name} className="w-1/2 flex flex-col">
                     <span>{player.name}</span>
                     <span>{player.score}</span>
                  </div>
               ))}
            </div>
         ))}
      </div>
   );
}
