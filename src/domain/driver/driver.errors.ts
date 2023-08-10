import { DomainError } from '@domain/domain.errors';

export class DriverDoesNotExistError extends DomainError {
  constructor(driverId: string) {
    super(`Driver with ID or Email ${driverId} not found`);
  }
}

export class CouldNotAuthenticateDriver extends DomainError {
  constructor() {
    super(`Could not authenticate the driver`);
  }
}
