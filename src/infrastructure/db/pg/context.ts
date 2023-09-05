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

      const session = {
        async begin() {
          await client.query('BEGIN;');
        },

        async commit() {
          await client.query('COMMIT;');
          client.release();
          // console.log({ total: pool.totalCount, waiting: pool.waitingCount, idle: pool.idleCount });
        },

        async rollback() {
          await client.query('ROLLBACK;');
          client.release();
        },

        get driverRepository() {
          return driverRepository(client);
        },

        async withinTransaction<F extends (...params: unknown[]) => ReturnType<F>>(
          cb: F,
          ...params: Parameters<F>
        ): Promise<ReturnType<F>> {
          try {
            await this.begin();
            const data = await cb(...params);
            await this.commit();

            return data;
          } catch (er) {
            await this.rollback();
            console.log(er);
            throw new Error('Transactional error');
          }
        },
      };

      return session;
    },
  };
}
