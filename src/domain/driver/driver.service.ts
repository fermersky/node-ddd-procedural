import { CouldNotAuthenticateDriver, Driver, DriverDoesNotExistError, IDriverService } from '@domain/driver';
import { IDbContext } from '@domain/index';

import { IBcryptService } from '@infrastructure/crypto';

interface IDriverServiceDeps {
  db: IDbContext;
  bcrypt: IBcryptService;
}

export default function ({ db, bcrypt }: IDriverServiceDeps): IDriverService {
  return {
    async getAll(): Promise<Driver[]> {
      return await db.withinTransaction(db.driverRepository.getAll);
    },

    async findByEmail(email: string): Promise<Driver> {
      const driver = await db.withinTransaction(db.driverRepository.findByEmail, email);

      if (!driver) {
        throw new DriverDoesNotExistError(email);
      }

      return driver;
    },

    async authenticate(email: string, password: string): Promise<Driver> {
      const driver = await db.withinTransaction(db.driverRepository.findByEmail, email);

      if (driver == null) {
        throw new CouldNotAuthenticateDriver();
      }

      const passwordValid = await bcrypt.compare(password, driver.password);

      if (passwordValid) {
        return driver;
      }

      throw new CouldNotAuthenticateDriver();
    },
  };
}
