import type { Client } from '@/lib/client/Client';
import type { Game } from '@/lib/game/Game';

export function addObserver(this: Game, client: Client) {
   if (this._observers.has(client.playerId)) return;
   this._assignToGame(client, 0);
}
