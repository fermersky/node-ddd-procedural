import { Pool, PoolClient } from 'pg';

import { IDbContext } from '@domain/domain.interface';

import driverRepository from '../repositories/driver/driver.repository';

export interface IPgContext extends IDbContext {
  client: PoolClient;
}

export default function (pool: Pool): IPgContext {
  let client: PoolClient;

  return {
    async begin() {
      client = await pool.connect();
      await client.query('BEGIN;');
    },

    async commit() {
      await client.query('COMMIT;');

      client.release();
      // console.log({ total: pool.totalCount, waiting: pool.waitingCount, idle: pool.idleCount });
    },

    get client() {
      return client;
    },

    get driverRepository() {
      return driverRepository(this);
    },
  };
}
