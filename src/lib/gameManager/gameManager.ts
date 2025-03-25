import {
   getPendingGames,
   getActiveGames,
   getCompletedGames,
} from '@/lib/game/gameCache';
import type { GameInfoResponse } from '@/types/socket';
import { requestMove } from './requestMove';
import { observe } from './observe';
import { leave } from './leave';
import { join } from './join';
import { create } from './create';
import { getBoardState } from './getBoardState';

const getLobby = (): GameInfoResponse => ({
   pending: getPendingGames(),
   active: getActiveGames(30),
   complete: getCompletedGames(30),
});

export const gameManager = {
   getLobby,
   create,
   join,
   leave,
   observe,
   getBoardState,
   requestMove,
};
