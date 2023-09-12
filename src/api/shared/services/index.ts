import { appConfig } from '@infrastructure/config';
import { jwtService } from '@infrastructure/crypto';

import jwtValidation from './jwt-validation.service';

export const jwtValidationService = jwtValidation({ jwt: jwtService(), appConfig });

export * from './jwt-validation.service';
