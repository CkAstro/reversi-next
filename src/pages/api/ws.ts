// this is included because app/api/ws/route.ts does not allow for websocket
//    but pages/api/ws.ts is legacy supported
// reference : https://www.youtube.com/watch?v=ZbX4Ok9YX94&t=29330s
import type { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Socket } from 'net';

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

         const tmp = { a: 3, b: 4 };
         socket.emit('custom', JSON.stringify(tmp));

         socket.on('disconnect', (reason) => {
            console.log('client disconnected', reason);
         });
      });
   }

   res.end();
}
