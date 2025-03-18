import { getRandomId } from '@/lib/utils/getRandomId';
import type { GameInfoResponse } from '@/types/socket';

const firstPlayerArray = ['Player A', 'Player 1', 'Player N', 'Test Player'];
const secondPlayerArray = [
   'Player B',
   'Player 2',
   'Player M',
   'Another Player',
];

const randomFirstPlayer = () =>
   firstPlayerArray[Math.floor(firstPlayerArray.length * Math.random())];
const randomSecondPlayer = () =>
   secondPlayerArray[Math.floor(secondPlayerArray.length * Math.random())];
const randomPlayer = () =>
   Math.random() < 0.5 ? randomFirstPlayer() : randomSecondPlayer();

const active: GameInfoResponse['active'] = Array.from({ length: 8 }, () => ({
   gameId: getRandomId(),
   playerA: randomFirstPlayer(),
   playerB: randomSecondPlayer(),
   observerCount: Math.floor(5 * Math.random()),
}));

const pending: GameInfoResponse['pending'] = [
   {
      gameId: getRandomId(),
      playerA: randomPlayer(),
      playerB: null,
   },
];

const complete: GameInfoResponse['complete'] = Array.from(
   { length: 10 },
   () => {
      const halfScore = Math.floor(Math.random() * 45 + 5);
      return {
         gameId: getRandomId(),
         playerA: {
            name: randomFirstPlayer(),
            role: 1,
            score: halfScore,
         },
         playerB: {
            name: randomSecondPlayer(),
            role: -1,
            score: 64 - halfScore,
         },
      };
   }
);

export const testGames = {
   pending,
   active,
   complete,
};
