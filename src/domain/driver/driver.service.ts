import { CouldNotAuthenticateDriver, DriverDoesNotExistError } from '@domain/driver/driver.errors';
import { IDriverService } from '@domain/driver/driver.interface';
import { IDbContext } from '@domain/index';

import { IBcryptService } from '@infrastructure/crypto/bcrypt.service';

interface IDriverServiceDeps {
  db: IDbContext;
  bcrypt: IBcryptService;
}

export default function ({ db, bcrypt }: IDriverServiceDeps): IDriverService {
  return {
    async getAll() {
      return await db.withinTransaction(db.driverRepository.getAll);
    },

    async findByEmail(email) {
      const driver = await db.beginTransaction(async (session) => {
        const driver = await db.driverRepository.findByEmail(email);
        await session.commit();

        return driver;
      });

      if (!driver) {
        throw new DriverDoesNotExistError(email);
      }

      return driver;
    },

    async authenticate(email, password) {
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
