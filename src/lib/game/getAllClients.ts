import type { Client } from '@/lib/client/Client';
import type { Game } from '@/lib/game/Game';

export function getAllClients(this: Game): Client[] {
   const clients = [...this._observers.values()];
   if (this._playerB !== null) clients.unshift(this._playerB);
   if (this._playerA !== null) clients.unshift(this._playerA);
   return clients;
}
