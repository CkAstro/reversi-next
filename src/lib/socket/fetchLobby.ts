import { gameManager } from '@/lib/gameManager/gameManager';
import type { SocketHandler } from '@/types/socket';

export const fetchLobby: SocketHandler['fetch:lobby'] = (client) => () => {
   gameManager.getLobby().then((games) => client.send('fetch:lobby', games));
};
