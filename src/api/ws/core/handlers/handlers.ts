import { handleMessage } from '../routes/routes';
import { WsMessage, WsMessageSchema } from '../routes/routes.types';
import { jwtWsService } from '../services';
import sessionManager, { UserData } from '../session.manager';
import { WsHandlers } from './handlers.types';

export const handlers: WsHandlers = {
  open: (ws) => {
    const { id } = ws.getUserData();
    sessionManager.set(id, ws);

    console.log(`Established new WS connection ${id}`);
  },

  message: async (ws, message, isBinary) => {
    try {
      const messageJson = JSON.parse(new TextDecoder('utf8').decode(message)) as WsMessage;
      await WsMessageSchema.parseAsync(messageJson);

      const result = await handleMessage(messageJson);

      ws.send(JSON.stringify(result), isBinary);
    } catch (er) {
      ws.send('Error');
      console.log(er);
    }
  },

  drain: (ws) => {
    console.log('WebSocket backpressure: ' + ws.getBufferedAmount());
  },

  close: (ws, code, message) => {
    const { id } = ws.getUserData();
    sessionManager.delete(id);

    console.log(`WebSocket closed, Goodbye ${id}`);
  },

  upgrade: async (res, req, context) => {
    console.log('An Http connection wants to become WebSocket, URL: ' + req.getUrl() + '!');
    const upgradeAborted = { aborted: false };

    const secWebSocketKey = req.getHeader('sec-websocket-key');
    const secWebSocketProtocol = req.getHeader('sec-websocket-protocol');
    const secWebSocketExtensions = req.getHeader('sec-websocket-extensions');

    res.onAborted(() => {
      /* We can simply signal that we were aborted */
      upgradeAborted.aborted = true;
    });

    try {
      const userData = await jwtWsService.validateRequest(req);

      if (upgradeAborted.aborted) {
        console.log('Ouch! Client disconnected before we could upgrade it!');
        return;
      }

      res.cork(() => {
        res.upgrade<UserData>(
          {
            id: userData.id,
            email: userData.email,
            ipAddress: '0.0.0.0',
          },
          /* Use our copies here */
          secWebSocketKey,
          secWebSocketProtocol,
          secWebSocketExtensions,
          context,
        );
      });
    } catch (er) {
      res.writeStatus('401');
      res.end(JSON.stringify({ error: 'authorization is failed' }));
    }
  },
};
