import { WsHandlers } from './lifecycle.handlers.types';
import { jwtWsService } from './services';
import sessionManager, { UserData } from './session.manager';

export const handlers: WsHandlers = {
  open: (ws) => {
    const { id } = ws.getUserData();
    sessionManager.set(id, ws);

    console.log(`Established new WS connection ${id}`);
  },

  message: (ws, message, isBinary) => {
    console.log(JSON.parse(new TextDecoder('utf8').decode(message)));
    const ok = ws.send(message, isBinary);
  },

  drain: (ws) => {
    console.log('WebSocket backpressure: ' + ws.getBufferedAmount());
  },

  close: (ws, code, message) => {
    console.log('WebSocket closed');

    const address = new TextDecoder('utf8').decode(ws.getRemoteAddressAsText());
    sessionManager.delete(address);
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
