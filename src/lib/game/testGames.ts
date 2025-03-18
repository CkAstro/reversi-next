import { getRandomId } from '@/lib/utils/getRandomId';
import type { GameInfoResponse } from '@/types/socket';

const active: GameInfoResponse['active'] = Array.from({ length: 8 }, () => ({
   gameId: getRandomId(),
   playerA: ['Player A', 'Player 1', 'Player N', 'Test Player'][
      Math.floor(4 * Math.random())
   ],
   playerB: ['Player B', 'Player 2', 'Player M', 'Another Player'][
      Math.floor(4 * Math.random())
   ],
   observerCount: Math.floor(5 * Math.random()),
}));

const waiting: GameInfoResponse['waiting'] = [
   { gameId: getRandomId(), playerA: 'Player A', playerB: null },
];

const complete: GameInfoResponse['complete'] = Array.from(
   { length: 10 },
   () => {
      const halfScore = Math.floor(Math.random() * 45 + 5);
      return {
         gameId: getRandomId(),
         playerA: {
            name: ['Player A', 'Player 1', 'Player N', 'Test Player'][
               Math.floor(4 * Math.random())
            ],
            role: 1,
            score: halfScore,
         },
         playerB: {
            name: ['Player B', 'Player 2', 'Player M', 'Another Player'][
               Math.floor(4 * Math.random())
            ],
            role: -1,
            score: 64 - halfScore,
         },
      };
   }
);

export const testGames = {
   waiting,
   active,
   complete,
};
