import {
   getPendingGames,
   getActiveGames,
   getCompletedGames,
} from '@/lib/game/cacheInterface';
import type { GameInfoResponse } from '@/types/socket';
import { requestMove } from './requestMove';
import { observe } from './observe';
import { leave } from './leave';
import { join } from './join';
import { create } from './create';
import { getBoardState } from './getBoardState';

const getLobby = async (): Promise<GameInfoResponse> => {
   const pending = await getPendingGames();
   const active = await getActiveGames();
   const complete = await getCompletedGames();

   return {
      pending,
      active,
      complete,
   };
};

export const gameManager = {
   getLobby,
   create,
   join,
   leave,
   observe,
   getBoardState,
   requestMove,
};
