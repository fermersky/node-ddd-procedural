import { jwtValidationService } from '@api/shared/services';

import jwtWs from './jwt-ws.service';

export const jwtWsService = jwtWs({ jwt: jwtValidationService });
