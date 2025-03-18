import { Reversi } from '@/types/reversi';
import {
   getGame,
   addPendingGame,
   deletePendingGame,
   upgradePendingGame,
   upgradeActiveGame,
   getActiveGames,
   getPendingGames,
   getCompletedGames,
   saveGame,
   getLobby,
   _forTesting,
} from '../gameCache';

describe('getGame', () => {
   const { gameCache } = _forTesting;
   beforeEach(() => {
      Object.keys(gameCache).forEach((key) => delete gameCache[key]);
   });

   test('game not in cache and cacheOnly=true returns null game', () => {
      expect(getGame('testGame')).toBe(null);
   });

   test('game not in cache and cacheOnly=false returns null (for now)', () => {
      gameCache['differentGame'] = {} as unknown as Reversi['Game']; // non-null

      expect(getGame('testGame', false)).toBe(null);
   });

   test('game in cache returns game', () => {
      gameCache['testGame'] = {} as unknown as Reversi['Game']; // non-null

      expect(getGame('testGame', true)).not.toBe(null);
      expect(getGame('testGame', false)).not.toBe(null);
   });
});

describe('addPendingGame', () => {
   const { gameCache, pendingGames } = _forTesting;
   beforeEach(() => {
      Object.keys(gameCache).forEach((key) => delete gameCache[key]);
      pendingGames.forEach(() => pendingGames.shift());
   });

   test('addPendingGame adds gameId to empty pendingGames', () => {
      const game = { gameId: 'testGame' } as unknown as Reversi['Game'];
      addPendingGame(game);

      expect(pendingGames).toStrictEqual(['testGame']);
   });

   test('addPendingGame adds gameId to front of filled pendingGames', () => {
      pendingGames.push('game1');
      expect(pendingGames).toStrictEqual(['game1']);

      const game = { gameId: 'testGame' } as unknown as Reversi['Game'];
      addPendingGame(game);

      expect(pendingGames).toStrictEqual(['testGame', 'game1']);
   });

   test('addPendingGame adds game to gameCache as pointer', () => {
      expect(gameCache).toStrictEqual({});

      const game = { gameId: 'testGame' } as unknown as Reversi['Game'];
      addPendingGame(game);

      expect(gameCache).toStrictEqual({
         testGame: { gameId: 'testGame' },
      });

      expect(gameCache['testGame']).toBe(game);
   });
});

describe('deletePendingGame', () => {
   const { gameCache, pendingGames } = _forTesting;
   beforeEach(() => {
      Object.keys(gameCache).forEach((key) => delete gameCache[key]);
      while (pendingGames.length > 0) pendingGames.pop();
   });

   test('deletePendingGame removes gameId from filled pendingGames', () => {
      expect(pendingGames).toStrictEqual([]);
      pendingGames.push('game1', 'game2', 'game3');

      deletePendingGame('game2');
      expect(pendingGames).toStrictEqual(['game1', 'game3']);

      deletePendingGame('game3');
      expect(pendingGames).toStrictEqual(['game1']);

      deletePendingGame('game1');
      expect(pendingGames).toStrictEqual([]);
   });

   test('deletePendingGame does nothing if gameId is not present', () => {
      pendingGames.push('game1');
      expect(pendingGames).toStrictEqual(['game1']);

      deletePendingGame('testGame');
      expect(pendingGames).toStrictEqual(['game1']);
   });

   test('deletePendingGame does nothing with empty pendingGames', () => {
      expect(pendingGames).toStrictEqual([]);
      deletePendingGame('testGame');

      expect(pendingGames).toStrictEqual([]);
   });

   test('deletePendingGame removes game from cache', () => {
      gameCache['testGame'] = {} as unknown as Reversi['Game'];
      pendingGames.push('testGame');

      deletePendingGame('testGame');
      expect(gameCache).toStrictEqual({});
   });
});

describe('upgradePendingGame', () => {
   const { gameCache, pendingGames, activeGames } = _forTesting;
   beforeEach(() => {
      Object.keys(gameCache).forEach((key) => delete gameCache[key]);
      while (pendingGames.length > 0) pendingGames.pop();
      while (activeGames.length > 0) activeGames.pop();
   });

   test('upgrade transfers from pendingGames to activeGames', () => {
      pendingGames.push('testGame');
      expect(pendingGames.length).toBe(1);
      expect(activeGames.length).toBe(0);

      upgradePendingGame('testGame');
      expect(pendingGames.length).toBe(0);
      expect(activeGames).toStrictEqual(['testGame']);
   });

   test('upgrade does nothing if game is not present', () => {
      pendingGames.push('game2');
      activeGames.push('game1');
      upgradePendingGame('testGame');

      expect(pendingGames).toStrictEqual(['game2']);
      expect(activeGames).toStrictEqual(['game1']);
   });

   test('upgrade adds to start of activeGame list', () => {
      pendingGames.push('testGame');
      activeGames.push('game1');
      upgradePendingGame('testGame');

      expect(activeGames).toStrictEqual(['testGame', 'game1']);
   });
});

describe('upgradeActiveGame', () => {
   const { gameCache, activeGames, completedGames } = _forTesting;
   beforeEach(() => {
      Object.keys(gameCache).forEach((key) => delete gameCache[key]);
      while (activeGames.length > 0) activeGames.pop();
      while (completedGames.length > 0) completedGames.pop();
   });

   test('upgrade transfers from activeGames to completedGames', () => {
      activeGames.push('testGame');
      expect(activeGames.length).toBe(1);
      expect(completedGames.length).toBe(0);

      upgradeActiveGame('testGame');
      expect(activeGames.length).toBe(0);
      expect(completedGames).toStrictEqual(['testGame']);
   });

   test('upgrade does nothing if game is not present', () => {
      activeGames.push('game2');
      completedGames.push('game1');
      upgradeActiveGame('testGame');

      expect(activeGames).toStrictEqual(['game2']);
      expect(completedGames).toStrictEqual(['game1']);
   });

   test('upgrade adds to start of activeGame list', () => {
      activeGames.push('testGame');
      completedGames.push('game1');
      upgradeActiveGame('testGame');

      expect(completedGames).toStrictEqual(['testGame', 'game1']);
   });

   // test('upgrade ')
});

describe('getActiveGames', () => {
   //
});

describe('getPendingGames', () => {
   //
});

describe('getCompletedGames', () => {
   //
});

describe('saveGame', () => {
   //
});

describe('getLobby', () => {
   //
});
