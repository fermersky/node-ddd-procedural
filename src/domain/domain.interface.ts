import { IDriverRepository } from './driver';

export interface IRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T>;
  // ...other generic repository methods
}

export interface IDbContext {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;

  withinTransaction<F extends (...params: Parameters<F>) => ReturnType<F>>(
    cb: F,
    ...params: Parameters<F>
  ): Promise<ReturnType<F>>;

  transaction<T>(cb: (session: IDbContext) => Promise<T>): Promise<T>;

  driverRepository: IDriverRepository;
}
