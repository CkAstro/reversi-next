import { getUniqueId } from '@/lib/utils/getUniqueId';
// import type { ReversiGameId } from '@/types/reversi';
import type { InitResponse } from '@/types/socket';

const active: InitResponse['active'] = Array.from({ length: 8 }, () => ({
   gameId: getUniqueId(),
   playerA: ['Player A', 'Player 1', 'Player N', 'Test Player'][
      Math.floor(4 * Math.random())
   ],
   playerB: ['Player B', 'Player 2', 'Player M', 'Another Player'][
      Math.floor(4 * Math.random())
   ],
   observerCount: Math.floor(5 * Math.random()),
}));

const waiting: InitResponse['waiting'] = [
   { gameId: getUniqueId(), playerA: 'Player A', playerB: null },
];

const complete: InitResponse['complete'] = Array.from({ length: 10 }, () => {
   const halfScore = Math.floor(Math.random() * 45 + 5);
   return {
      gameId: getUniqueId(),
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
});

// const getActiveGames = (): ReversiGameId[] => [];
// const getCompletedGames = (amount: number, page = 0): ReversiGameId[] => [];
// const getIncompleteGames = (): ReversiGameId[] => [];

// const requestJoinGame = () => undefined;
// const requestNewGame = () => undefined;
// const requestObserveGame = () => undefined;

// const saveGameToServer = () => undefined;

export const getCurrentState = (): InitResponse => {
   return {
      active,
      complete,
      waiting,
   };
};
