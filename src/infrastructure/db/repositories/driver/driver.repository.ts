import { Driver, DriverDoesNotExistError, IDriverRepository } from '@domain/driver';

import { IPgContext } from '@infrastructure/db/pg/context';

import { IDriverQueryResult } from './types';

export default function (dbContext: IPgContext): IDriverRepository {
  const mapToDomain = (rows: IDriverQueryResult[]): Driver[] => {
    return rows.map((row) => ({
      id: row.id,
      password: row.password,
      email: row.email,
      phone: row.phone,
      first_name: row.first_name,
      last_name: row.last_name,
    }));
  };

  return {
    async getAll(): Promise<Driver[]> {
      const result = await dbContext.client.query<IDriverQueryResult>('SELECT * FROM drivers');
      return mapToDomain(result.rows);
    },

    async findByEmail(email: string): Promise<Driver> {
      const result = await dbContext.client.query<IDriverQueryResult>(
        'SELECT * FROM drivers WHERE email = $1',
        [email],
      );

      if (result.rowCount === 0) {
        throw new DriverDoesNotExistError(email);
      }

      return mapToDomain(result.rows)[0];
    },
  };
}
