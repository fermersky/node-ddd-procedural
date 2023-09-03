import { PoolClient } from 'pg';

import { Driver, DriverDoesNotExistError, IDriverRepository } from '@domain/driver';

import { IDriverQueryResult } from './types';

export default function (client: PoolClient): IDriverRepository {
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
    async getAll() {
      const result = await client.query<IDriverQueryResult>('SELECT * FROM drivers');

      return mapToDomain(result.rows);
    },

    async findByEmail(email) {
      const result = await client.query<IDriverQueryResult>('SELECT * FROM drivers WHERE email = $1', [
        email,
      ]);

      if (result.rowCount === 0) {
        throw new DriverDoesNotExistError(email);
      }

      return mapToDomain(result.rows)[0];
    },
  };
}
