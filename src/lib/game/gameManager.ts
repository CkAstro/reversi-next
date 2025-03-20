import {
   getPendingGames,
   getActiveGames,
   getCompletedGames,
} from '@/lib/game/gameCache';
import type { GameInfoResponse } from '@/types/socket';

const getLobby = (): GameInfoResponse => ({
   pending: getPendingGames(),
   active: getActiveGames(),
   complete: getCompletedGames(),
});

export const gameManager = {
   getLobby,
};
