// this is included because app/api/ws/route.ts does not allow for websocket
//    but pages/api/ws.ts is legacy supported
// reference : https://www.youtube.com/watch?v=ZbX4Ok9YX94&t=29330s
import type { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Socket } from 'net';
import { initConnection } from '@/lib/socket/initConnection';
import { logger } from '@/lib/utils/logger';

type NextApiResponseWS = NextApiResponse & {
   socket: Socket & {
      server: HTTPServer & {
         io?: Server;
      };
   };
};

export const config = {
   api: {
      bodyParser: false,
   },
};

export default function handler(req: NextApiRequest, res: NextApiResponseWS) {
   if (process.env.NEXT_PUBLIC_DEDICATED_SOCKET_SERVER === 'true')
      return res.end();

   if (res.socket.server.io) return res.end();
   const httpServer: HTTPServer = res.socket.server;
   const io = new Server(httpServer, {
      path: '/api/ws',
      addTrailingSlash: false,
      cors: {
         origin: '*',
      },
      connectionStateRecovery: {
         maxDisconnectionDuration: 2 * 60 * 1000,
         skipMiddlewares: true,
      },
   });

   io.on('connection', (socket) => {
      if (process.env.DEBUG === 'true')
         socket.use((packet, next) => {
            console.log('received', packet);
            next();
         });

      initConnection(socket);
   });

   logger('socket server running on http://localhost:3000/api/ws');
   res.socket.server.io = io;
   res.end();
}
