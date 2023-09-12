import uWS from 'uWebSockets.js';

import { handlers } from './core/handlers/handlers';

const app = uWS
  .App({})
  .get('/anything', (res, req) => {
    console.log('plain http request');
    res.end('hi');
  })
  .ws('/ws', {
    compression: uWS.SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 10,

    open: handlers.open,
    upgrade: handlers.upgrade,
    close: handlers.close,
    drain: handlers.drain,
    message: handlers.message,
  });

export default app;
