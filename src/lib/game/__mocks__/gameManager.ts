import type { GameInfoResponse } from '@/types/socket';

const active: GameInfoResponse['active'] = [
   {
      gameId: 'e3f58b4b-62b0-408d-b098-c5ab6695bc28',
      playerA: 'Player A',
      playerB: 'Player B',
      observerCount: 3,
   },
   {
      gameId: 'c4deb580-12d9-402e-aa28-377708d1ad49',
      playerA: 'Test Player',
      playerB: 'Another Test',
      observerCount: 0,
   },
];

const waiting: GameInfoResponse['waiting'] = [
   {
      gameId: '8fb96833-0f7b-4b7d-b619-dfa291993c1d',
      playerA: 'waiting player',
      playerB: null,
   },
];

const gameIds = [
   '1b37fa11-0d1b-46cf-8179-936346883ebb',
   '99df317d-26e0-47c8-ab80-a9af0d3a9cd1',
   'd5662f00-60ff-40f6-8f6f-b2f7956b9c7d',
   '0655c510-95f7-4a91-be25-6f9b18a79afb',
   '2e7c9ec4-34a9-4b54-92fe-a081952471d9',
   '85f1cfa7-5627-47ae-b068-f1d5ee059cf4',
   '57e083e0-7fb3-44d7-8aac-76e7a411ef9f',
   '23595854-beae-43f4-8c3e-51551425b7b1',
   '7e8526ec-04f7-439a-825e-78f1ac867529',
   '09339f39-e59f-41ad-ae3e-0d7997036ebf',
];

const complete: GameInfoResponse['complete'] = Array.from(
   { length: 10 },
   (_, i) => {
      const halfScore = Math.floor(Math.random() * 45 + 50);
      return {
         gameId: gameIds[i],
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

export const gameManager = {
   getCurrentState: () => ({ active, complete, waiting }),
};
