import { Pool } from 'pg';

import { IDbContext } from '@domain/domain.interface';

import driverRepository from '../repositories/driver/driver.repository';
import { PoolClientDecorator } from './pool-client';

export interface IPgContext {
  connect: () => Promise<IDbContext>;
}

export default function (pool: Pool): IPgContext {
  return {
    async connect() {
      const client = new PoolClientDecorator(await pool.connect(), { logQueries: true });

      const session: IDbContext = {
        async begin() {
          await client.query('BEGIN;');
        },

        async commit() {
          await client.query('COMMIT;');
        },

        async rollback() {
          await client.query('ROLLBACK;');
        },

        get driverRepository() {
          return driverRepository(client);
        },

        // provide control over the transaction (commit/rollback) to the client code
        async beginTransaction(cb) {
          try {
            await this.begin();
            const data = await cb(this);

            return data;
          } catch (er) {
            console.log(er);
            throw new Error('Transactional error');
          } finally {
            client.release();
            // console.log({ total: pool.totalCount, waiting: pool.waitingCount, idle: pool.idleCount });
          }
        },

        // automatically runs begin, commit or rollback
        async withinTransaction(cb, ...params) {
          try {
            await this.begin();
            const data = await cb(...params);
            await this.commit();

            return data;
          } catch (er) {
            await this.rollback();
            console.log(er);
            throw new Error('Transactional error');
          } finally {
            client.release();
          }
        },
      };

      return session;
    },
  };
}
