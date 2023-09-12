import { jwtValidationService } from '@api/shared/services';

import jwtHttp from './jwt-http.service';

export const jwtHttpService = jwtHttp({ jwt: jwtValidationService });
