// this is included because app/api/ws/route.ts does not allow for websocket
//    but pages/api/ws.ts is legacy supported
// reference : https://www.youtube.com/watch?v=ZbX4Ok9YX94&t=29330s
import type { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Socket } from 'net';
import { serializeBoardState } from '@/lib/boardState/serializeBoardState';

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
   if (!res.socket.server.io) {
      const path = '/api/ws';
      const httpServer: HTTPServer = res.socket.server;
      const io = new Server(httpServer, {
         path,
         addTrailingSlash: false,
      });

      res.socket.server.io = io;

      io.on('connection', (socket) => {
         console.log('client connected with id', socket.id);

         const boardState = Array.from({ length: 64 }).map((square, i) => {
            if ([27, 28, 35, 36, 37].includes(i)) return i % 2 === 0 ? 1 : -1;
            return null;
         });
         setTimeout(() => {
            console.log('sending board update');
            socket.emit('boardUpdate', serializeBoardState(boardState));
         }, 2000);

         socket.on('disconnect', (reason) => {
            console.log('client disconnected', reason);
         });
      });
   }

   res.end();
}
