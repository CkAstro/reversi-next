import { OrderedCache } from '@/lib/game/OrderedCache';
import type { Game } from '@/lib/game/Game';
import type { Reversi } from '@/types/reversi';
import { ReversiGame, type SavedGame } from '@/lib/mongodb/reversiGame';
import { logger } from '@/lib/utils/logger';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getGameCache } from '@/lib/redis/gameCache';

export const liveGames = new OrderedCache<Reversi['GameId'], Game>();

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
export const getPlayer = (list?: 'A' | 'B'): string =>
   list === 'A'
      ? playerAList[Math.floor(Math.random() * playerAList.length)]
      : list === 'B'
      ? playerBList[Math.floor(Math.random() * playerBList.length)]
      : Math.random() < 0.5
      ? getPlayer('A')
      : getPlayer('B');

const cacheStatus = {
   promise: null as Promise<
      Pick<SavedGame, 'gameId' | 'score' | 'playerA' | 'playerB'>[]
   > | null,
   isLoaded: false,
};

export const fetchCompletedGames = async () => {
   if (cacheStatus.isLoaded) return;

   if (cacheStatus.promise === null) {
      await connectToDatabase();
      logger('fetching games from database');

      cacheStatus.promise = ReversiGame.find({})
         .sort({ endTime: -1 })
         .limit(10)
         .select('gameId score playerA playerB -_id')
         .exec();
   }

   try {
      const cache = await getGameCache();
      const completedGames = await cacheStatus.promise;
      completedGames
         .reverse()
         .forEach(({ gameId, playerA, playerB, score }) => {
            cache.addToComplete(gameId, playerA, playerB, score);
         });

      cacheStatus.isLoaded = true;
      return;
   } catch {
      return logger('unable to retrieve games from db.');
   }
};
