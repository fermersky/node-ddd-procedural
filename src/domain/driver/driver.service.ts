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
      await db.begin();
      const drivers = await db.driverRepository.getAll();
      await db.commit();

      return drivers;
    },

    async findByEmail(email: string): Promise<Driver> {
      await db.begin();
      const driver = await db.driverRepository.findByEmail(email);
      await db.commit();

      if (!driver) {
        throw new DriverDoesNotExistError(email);
      }

      return driver;
    },

    async authenticate(email: string, password: string): Promise<Driver> {
      await db.begin();
      const driver = await db.driverRepository.findByEmail(email);
      await db.commit();

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
