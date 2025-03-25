import { OrderedCache } from '@/lib/game/OrderedCache';
import type { Game } from '@/lib/game/Game';
import type { Reversi } from '@/types/reversi';
import type {
   ActiveGameInfo,
   CompletedGameInfo,
   PendingGameInfo,
} from '@/types/socket';
import { ReversiGame } from '@/lib/mongodb/reversiGame';
import { logger } from '@/lib/utils/logger';

// eventually move these to redis/mongo storage
export const gameCache = new OrderedCache<Reversi['GameId'], Game>();
export const pendingCache = new OrderedCache<
   Reversi['GameId'],
   PendingGameInfo
>();
export const activeCache = new OrderedCache<
   Reversi['GameId'],
   ActiveGameInfo
>();
export const completedCache = new OrderedCache<
   Reversi['GameId'],
   CompletedGameInfo
>();

export const saveToDatabase = (game: Game) => {
   const [playerA, playerB] = game.getPlayers();
   const score = game.getScore();
   const winner = score[1] < score[0] ? 1 : score[0] < score[1] ? -1 : 0;

   const completedGame = new ReversiGame({
      gameId: game.gameId,
      moveHistory: game.getReducedHistory(),
      finalState: game.getBoardState(),
      playerA: playerA ?? '',
      playerB: playerB ?? '',
      firstTurn: game.firstTurn,
      winner,
      score,
   });

   completedGame.save().then(() => {
      logger(`game ${game.gameId} successfully saved to database`);
   });
};

const playerAList = ['playerA', 'player 1', 'player N', 'test player'];
const playerBList = ['playerB', 'player 2', 'player M', 'other player'];
const getPlayer = (list?: 'A' | 'B'): string =>
   list === 'A'
      ? playerAList[Math.floor(Math.random() * playerAList.length)]
      : list === 'B'
      ? playerBList[Math.floor(Math.random() * playerBList.length)]
      : Math.random() < 0.5
      ? getPlayer('A')
      : getPlayer('B');

for (let i = 0; i < 2; i++) {
   pendingCache.insert(`pending${i}`, {
      gameId: `pending${i}`,
      player: getPlayer(),
   });
}

for (let i = 0; i < 30; i++) {
   activeCache.insert(`active${i}`, {
      gameId: `active${i}`,
      playerA: getPlayer('A'),
      playerB: getPlayer('B'),
      observerCount: Math.floor(Math.random() * 5),
   });
}

const completed = await ReversiGame.find({});

completed.forEach((game) => {
   const [aScore, bScore] = game.score;
   completedCache.insert(game.gameId, {
      gameId: game.gameId,
      playerA: {
         name: !!game.playerA ? game.playerA : getPlayer('A'),
         score: aScore,
         role: 1,
      },
      playerB: {
         name: !!game.playerB ? game.playerB : getPlayer('B'),
         score: bScore,
         role: -1,
      },
   });
});
