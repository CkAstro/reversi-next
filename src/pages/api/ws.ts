// this is included because app/api/ws/route.ts does not allow for websocket
//    but pages/api/ws.ts is legacy supported
// reference : https://www.youtube.com/watch?v=ZbX4Ok9YX94&t=29330s
import type { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Socket } from 'net';
import { initConnection } from '@/lib/client/client';

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
   if (res.socket.server.io) return res.end();
   const path = '/api/ws';
   const httpServer: HTTPServer = res.socket.server;
   const io = new Server(httpServer, {
      path,
      addTrailingSlash: false,
      cors: {
         origin: '*',
         methods: ['GET', 'POST'],
      },
   });

   io.on('connection', initConnection);

   res.socket.server.io = io;
   res.end();
}
