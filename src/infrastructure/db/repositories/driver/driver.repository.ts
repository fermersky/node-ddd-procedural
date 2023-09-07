import { Driver, DriverDoesNotExistError, IDriverRepository } from '@domain/driver';

import { PoolClientDecorator } from '@infrastructure/db/pg';

import { IDriverQueryResult } from './types';

export default function (client: PoolClientDecorator): IDriverRepository {
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

    async getById(id: string) {
      const result = await client.query<IDriverQueryResult>('SELECT * FROM drivers where id = $1', [id]);

      if (result.rowCount === 0) {
        throw new DriverDoesNotExistError(id);
      }

      return mapToDomain(result.rows)[0];
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
