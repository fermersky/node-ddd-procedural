import { Pool } from 'pg';

import { IDbContext } from '@domain/domain.interface';

import driverRepository from '../repositories/driver/driver.repository';

export interface IPgContext {
  connect: () => Promise<IDbContext>;
}

export default function (pool: Pool): IPgContext {
  return {
    async connect() {
      const client = await pool.connect();

      return {
        async begin() {
          await client.query('BEGIN;');
        },

        async commit() {
          await client.query('COMMIT;');
          client.release();
          // console.log({ total: pool.totalCount, waiting: pool.waitingCount, idle: pool.idleCount });
        },

        get driverRepository() {
          return driverRepository(client);
        },
      };
    },
  };
}
