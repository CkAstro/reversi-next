'use client';

import { useSocket } from '@/app/games/useSocket';
import GameDisplay from '@/app/games/GameDisplay';

const blankGame = {
   gameId: null as unknown as string,
   playerA: '',
   playerB: null,
};

export default function Lobby() {
   const activeGames = useSocket((s) => s.activeGames);
   const waitingGames = useSocket((s) => s.waitingGames);

   return (
      <div className="w-full h-full flex flex-col gap-2">
         <div className="flex gap-2 w-full">
            <GameDisplay title="New" type="new" games={[blankGame]} />
            <GameDisplay title="Waiting" type="waiting" games={waitingGames} />
         </div>
         <GameDisplay title="Active" type="active" games={activeGames} />
      </div>
   );
}
