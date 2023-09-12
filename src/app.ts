import { appConfig } from '@infrastructure/config';

import app from '@api/http/app';
import uWSapp from '@api/ws/app';

app.listen({ port: appConfig.httpPort });

uWSapp.listen(appConfig.wsPort, (socket) => {
  if (socket) {
    console.log(`start listening WebSockets on port ${appConfig.wsPort} 🙉`);
  } else {
    console.log(`failed to start listening WS connections on port ${appConfig.wsPort}`);
  }
});
