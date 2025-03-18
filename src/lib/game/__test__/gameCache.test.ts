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
import type { Reversi } from '@/types/reversi';

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

   test('upgrade removes tail of list if it is over max cached', () => {
      const { MAX_COMPLETED } = _forTesting;
      activeGames.push('testGame');
      completedGames.push(
         ...Array.from({ length: MAX_COMPLETED }, (_, i) => `game ${i}`)
      );

      const expectedLastItem = `game ${MAX_COMPLETED - 2}`;

      upgradeActiveGame('testGame');
      expect(completedGames.length).toBe(MAX_COMPLETED);
      expect(completedGames[0]).toBe('testGame');
      expect(completedGames[MAX_COMPLETED - 1]).toBe(expectedLastItem);
   });
});

describe('getActiveGames', () => {
   const { activeGames } = _forTesting;
   beforeEach(() => {
      while (activeGames.length > 0) activeGames.pop();
      activeGames.push(...Array.from({ length: 25 }, (_, i) => `game ${i}`));
   });

   test('active games returns full array if less than count', () => {
      expect(getActiveGames(30)).toStrictEqual(activeGames);
   });

   test('active games returns count if greater than count', () => {
      expect(getActiveGames(10)).toStrictEqual(activeGames.slice(0, 10));
   });

   test('pagination functions', () => {
      const count = 10;
      const page = 1;
      const start = count * page;
      expect(getActiveGames(count, page)).toStrictEqual(
         Array.from({ length: count }, (_, i) => `game ${i + start}`)
      );
   });

   test('last page returns partial', () => {
      expect(getActiveGames(10, 2)).toStrictEqual(
         Array.from({ length: 5 }, (_, i) => `game ${i + 20}`)
      );
   });

   test('extra pages returns empty array', () => {
      expect(getActiveGames(10, 3)).toStrictEqual([]);
   });

   test('negative page returns empty array', () => {
      expect(getActiveGames(10, -1)).toStrictEqual([]);
   });

   test('request on empty array returns empty array', () => {
      while (activeGames.length > 0) activeGames.pop();
      expect(getActiveGames(10)).toStrictEqual([]);
   });
});

describe('getPendingGames', () => {
   const { pendingGames } = _forTesting;
   beforeEach(() => {
      while (pendingGames.length > 0) pendingGames.pop();
      pendingGames.push(...Array.from({ length: 25 }, (_, i) => `game ${i}`));
   });

   test('active games returns full array if less than count', () => {
      expect(getPendingGames(30)).toStrictEqual(pendingGames);
   });

   test('active games returns count if greater than count', () => {
      expect(getPendingGames(10)).toStrictEqual(pendingGames.slice(0, 10));
   });

   test('pagination functions', () => {
      const count = 10;
      const page = 1;
      const start = count * page;
      expect(getPendingGames(count, page)).toStrictEqual(
         Array.from({ length: count }, (_, i) => `game ${i + start}`)
      );
   });

   test('last page returns partial', () => {
      expect(getPendingGames(10, 2)).toStrictEqual(
         Array.from({ length: 5 }, (_, i) => `game ${i + 20}`)
      );
   });

   test('extra pages returns empty array', () => {
      expect(getPendingGames(10, 3)).toStrictEqual([]);
   });

   test('negative page returns empty array', () => {
      expect(getPendingGames(10, -1)).toStrictEqual([]);
   });

   test('request on empty array returns empty array', () => {
      while (pendingGames.length > 0) pendingGames.pop();
      expect(getPendingGames(10)).toStrictEqual([]);
   });
});

describe('getCompletedGames', () => {
   const { completedGames } = _forTesting;
   beforeEach(() => {
      while (completedGames.length > 0) completedGames.pop();
      completedGames.push(...Array.from({ length: 25 }, (_, i) => `game ${i}`));
   });

   test('active games returns full array if less than count', () => {
      expect(getCompletedGames(30)).toStrictEqual(completedGames);
   });

   test('active games returns count if greater than count', () => {
      expect(getCompletedGames(10)).toStrictEqual(completedGames.slice(0, 10));
   });

   test('pagination functions', () => {
      const count = 10;
      const page = 1;
      const start = count * page;
      expect(getCompletedGames(count, page)).toStrictEqual(
         Array.from({ length: count }, (_, i) => `game ${i + start}`)
      );
   });

   test('last page returns partial', () => {
      expect(getCompletedGames(10, 2)).toStrictEqual(
         Array.from({ length: 5 }, (_, i) => `game ${i + 20}`)
      );
   });

   test('extra pages returns empty array', () => {
      expect(getCompletedGames(10, 3)).toStrictEqual([]);
   });

   test('negative page returns empty array', () => {
      expect(getCompletedGames(10, -1)).toStrictEqual([]);
   });

   test('request on empty array returns empty array', () => {
      while (completedGames.length > 0) completedGames.pop();
      expect(getCompletedGames(10)).toStrictEqual([]);
   });
});

describe('saveGame', () => {
   test('reminder to add tests', () => {
      expect(() => saveGame('testGame')).toThrow('not available');
   });
});

describe('getLobby', () => {
   const { pendingGames, activeGames, completedGames } = _forTesting;

   beforeEach(() => {
      while (pendingGames.length > 0) pendingGames.pop();
      while (activeGames.length > 0) activeGames.pop();
      while (completedGames.length > 0) completedGames.pop();
   });

   test('returns 10 of each', () => {
      pendingGames.push(
         ...Array.from({ length: 11 }, (_, i) => `pending ${i}`)
      );
      activeGames.push(...Array.from({ length: 11 }, (_, i) => `active ${i}`));
      completedGames.push(
         ...Array.from({ length: 11 }, (_, i) => `completed ${i}`)
      );

      const { pending, active, completed } = getLobby();
      expect(pending.length).toBe(10);
      expect(active.length).toBe(10);
      expect(completed.length).toBe(10);
   });

   test('functions correctly with less entries', () => {
      pendingGames.push(...Array.from({ length: 5 }, (_, i) => `pending ${i}`));
      activeGames.push(...Array.from({ length: 5 }, (_, i) => `active ${i}`));
      completedGames.push(
         ...Array.from({ length: 5 }, (_, i) => `completed ${i}`)
      );

      const { pending, active, completed } = getLobby();
      expect(pending.length).toBe(5);
      expect(active.length).toBe(5);
      expect(completed.length).toBe(5);
   });
});
