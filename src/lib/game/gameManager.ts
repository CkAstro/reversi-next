import { addObserver } from '@/lib/game/addObserver';
import { addPlayer } from '@/lib/game/addPlayer';
import { completeGame } from '@/lib/game/completeGame';
import { createGame } from '@/lib/game/createGame';
import { getOpponent } from '@/lib/game/getOpponent';
import { getParticipants } from '@/lib/game/getParticipants';
import { removeObserver } from '@/lib/game/removeObserver';
import { removePlayer } from '@/lib/game/removePlayer';
import { requestMove } from '@/lib/game/requestMove';
import {
   getActiveGames,
   getCompletedGames,
   getLobby,
   getWaitingGames,
   saveGame,
} from '@/lib/game/gameCache';

export const gameManager = {
   createGame,
   completeGame,
   addPlayer,
   removePlayer,
   addObserver,
   removeObserver,
   requestMove,
   getOpponent,
   getParticipants,
   getActiveGames,
   getWaitingGames,
   getCompletedGames,
   saveGame,
   getLobby,
};
