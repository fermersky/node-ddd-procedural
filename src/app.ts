import { appConfig } from '@infrastructure/config';

import app from '@api/http/app';

app.listen({ port: appConfig.httpPort });
