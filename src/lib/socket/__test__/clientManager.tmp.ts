import { initConnection } from '@/lib/socket/initConnection';
import type { WsClient } from '@/types/socket';
import type { Socket } from 'socket.io';

jest.mock('@/lib/game/gameManager', () => ({
   gameManager: {
      getCurrentState: jest.fn(() => ({ gameState: 'mocked_state' })),
   },
}));

describe('transferClient', () => {
   let mockPreviousSocket: jest.Mocked<Socket>;
   let mockCurrentSocket: jest.Mocked<Socket>;

   beforeEach(() => {
      mockPreviousSocket = {
         rooms: new Set(['room1', 'room2']),
         join: jest.fn(),
         leave: jest.fn((room) => mockPreviousSocket.rooms.delete(room)),
         disconnect: jest.fn(),
      } as unknown as jest.Mocked<Socket>;

      mockCurrentSocket = {
         rooms: new Set([]),
         join: jest.fn((room) => mockCurrentSocket.rooms.add(room)),
         leave: jest.fn(),
         disconnect: jest.fn(),
      } as unknown as jest.Mocked<Socket>;
   });

   test('previous socket leaves rooms', () => {
      expect(mockPreviousSocket.rooms.size).toBe(2);
      _forTesting.transferClient(mockPreviousSocket, mockCurrentSocket);
      expect(mockPreviousSocket.leave).toHaveBeenCalledTimes(2);
      expect(mockPreviousSocket.leave).toHaveBeenCalledWith('room1');
      expect(mockPreviousSocket.leave).toHaveBeenCalledWith('room2');
      expect(mockPreviousSocket.rooms.size).toBe(0);
   });

   test('current socket enters rooms', () => {
      expect(mockCurrentSocket.rooms.size).toBe(0);
      _forTesting.transferClient(mockPreviousSocket, mockCurrentSocket);
      expect(mockCurrentSocket.join).toHaveBeenCalledTimes(2);
      expect(mockCurrentSocket.join).toHaveBeenCalledWith('room1');
      expect(mockCurrentSocket.join).toHaveBeenCalledWith('room2');
      expect(mockCurrentSocket.rooms.size).toBe(2);
   });

   test('previous socket disconnects', () => {
      _forTesting.transferClient(mockPreviousSocket, mockCurrentSocket);
      expect(mockPreviousSocket.disconnect);
   });
});

describe('authenticate', () => {
   let socketMock: jest.Mocked<Socket>;
   let clientMock: WsClient;

   beforeEach(() => {
      socketMock = {
         id: 'mockSocketId',
         handshake: { auth: {} } as unknown as Socket['handshake'],
         emit: jest.fn(),
         disconnect: jest.fn(),
         removeAllListeners: jest.fn(),
         connected: true,
         join: jest.fn(),
         leave: jest.fn(),
         rooms: new Set(['room1', 'room2']),
         on: jest.fn(),
      } as unknown as jest.Mocked<Socket>;

      clientMock = {
         socketId: socketMock.id,
         socket: socketMock,
         authKey: null,
         isConnected: () => socketMock.connected,
         lastActive: Date.now(),
         username: null,
         currentGameId: null,
         playerStatus: 'idle',
         opponentId: null,
      };
   });

   test('should reject if no key is provided', () => {
      _forTesting.authenticate(clientMock);
      expect(socketMock.emit).toHaveBeenCalledWith('auth', 'reject');
      expect(socketMock.disconnect).toHaveBeenCalled();
   });

   test('should accept new client with key', () => {
      socketMock.handshake.auth.key = 'validKey';
      _forTesting.authenticate(clientMock);

      expect(socketMock.emit).toHaveBeenCalledWith('auth', 'accept');
      expect(socketMock.disconnect).not.toHaveBeenCalled();
   });

   test('should reconnect existing client', () => {
      const mockPreviousSocket = {
         ...socketMock,
         disconnect: jest.fn(),
      } as unknown as jest.Mocked<Socket>;
      const mockPreviousClient = { ...clientMock, socket: mockPreviousSocket };
      _forTesting.clientStore['validKey'] = mockPreviousClient;

      socketMock.handshake.auth.key = 'validKey';
      _forTesting.authenticate(clientMock);
      expect(mockPreviousSocket.disconnect).toHaveBeenCalled();
      expect(socketMock.disconnect).not.toHaveBeenCalled();
      expect(socketMock.emit).toHaveBeenCalledWith('auth', 'reconnect');
   });
});

describe('initConnection', () => {
   let socketMock: jest.Mocked<Socket>;

   beforeEach(() => {
      socketMock = {
         id: 'mockSocketId',
         handshake: { auth: {} } as unknown as Socket['handshake'],
         emit: jest.fn(),
         disconnect: jest.fn(),
         removeAllListeners: jest.fn(),
         connected: true,
         join: jest.fn(),
         leave: jest.fn(),
         on: jest.fn(),
      } as unknown as jest.Mocked<Socket>;
   });

   test('should remove all previous event listeners', () => {
      initConnection(socketMock);
      expect(socketMock.removeAllListeners).toHaveBeenCalled();
   });

   test('should add all necessary event listeners', () => {
      initConnection(socketMock);
      expect(socketMock.on).toHaveBeenCalledWith(
         'connection',
         expect.any(Function)
      );
      expect(socketMock.on).toHaveBeenCalledWith(
         'disconnect',
         expect.any(Function)
      );
   });

   test('should emit current game state', () => {
      initConnection(socketMock);
      expect(socketMock.emit).toHaveBeenCalledWith('init', {
         gameState: 'mocked_state',
      });
   });
});
