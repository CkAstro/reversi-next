'use client';

import { useEffect } from 'react';
import { useSendMessage } from '@/hooks/useSendMessage';
import { lobbyStore } from '@/store/lobbyStore';
import GridDisplay from '@/ui/GridDisplay';
import ActiveGame from './ActiveGame';

const blankGame = {
   gameId: null as unknown as string,
   player: '',
   observerCount: 0,
};

export default function Lobby() {
   const activeGames = lobbyStore((s) => s.active);
   const pendingGames = lobbyStore((s) => s.pending);
   const send = useSendMessage();

   useEffect(() => {
      send('fetch:lobby');
   }, [send]);

   return (
      <div className="w-full h-full flex flex-col gap-2">
         <div className="flex gap-2 w-full">
            <GridDisplay
               title="Waiting"
               columns={{ sm: 2, md: 3, lg: 4 }}
               className="grow"
            >
               {[blankGame, ...pendingGames].map((game) => (
                  <ActiveGame
                     key={game.gameId}
                     onClick={() =>
                        send(
                           // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                           game.gameId === null ? 'game:create' : 'game:join',
                           game.gameId
                        )
                     }
                     gameId={game.gameId}
                     playerA={game.player}
                     playerB={null}
                     observerCount={0}
                  />
               ))}
            </GridDisplay>
         </div>
         <GridDisplay columns={{ sm: 3, md: 3, lg: 4 }} title="Active">
            {activeGames.map((game) => (
               <ActiveGame
                  key={game.gameId}
                  onClick={() => send('game:join', game.gameId)}
                  gameId={game.gameId}
                  playerA={game.playerA}
                  playerB={game.playerB}
                  observerCount={game.observerCount}
               />
            ))}
         </GridDisplay>
      </div>
   );
}
