import { getUniqueId } from '@/lib/utils/getUniqueId';
import type { ReversiGameId, ReversiPlayer } from '@/types/reversi';
import type { InitResponse } from '@/types/socket';

const active: InitResponse['active'] = [
   {
      gameId: getUniqueId(),
      playerA: 'Player A',
      playerB: 'Player B',
      observerCount: 3,
   },
   {
      gameId: getUniqueId(),
      playerA: 'Test Player',
      playerB: 'Another Test',
      observerCount: 0,
   },
];

const waiting: InitResponse['waiting'] = [
   { gameId: getUniqueId(), playerA: 'waiting player' },
];

const complete: InitResponse['complete'] = Array.from(
   { length: 10 },
   (_, i) => {
      const halfScore = Math.floor(Math.random() * 45 + 50);
      return {
         gameId: getUniqueId(),
         playerA: {
            name: `Player ${i * 2 + 1}`,
            role: 1,
            score: halfScore,
         },
         playerB: {
            name: `Player ${i * 2 + 2}`,
            role: -1,
            score: 64 - halfScore,
         },
      };
   }
);

const getActiveGames = (): ReversiGameId[] => [];
const getCompletedGames = (amount: number, page = 0): ReversiGameId[] => [];
const getIncompleteGames = (): ReversiGameId[] => [];

const requestJoinGame = () => undefined;
const requestNewGame = () => undefined;
const requestObserveGame = () => undefined;

const saveGameToServer = () => undefined;

export const getCurrentState = (): InitResponse => {
   return {
      active,
      complete,
      waiting,
   };
};
