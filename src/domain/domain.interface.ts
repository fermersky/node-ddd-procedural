import { IDriverRepository } from './driver';

export interface IRepository<T> {
  getAll(): Promise<T[]>;
  // ...other generic repository methods
}

export interface IDbContext {
  begin(): Promise<void>;
  commit(): Promise<void>;

  driverRepository: IDriverRepository;
}
