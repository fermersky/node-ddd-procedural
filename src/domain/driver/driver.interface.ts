import { IRepository } from '../domain.interface';
import { Driver } from './index';

export interface IDriverRepository extends IRepository<Driver> {
  findByEmail(email: string): Promise<Driver>;
  // ...other driver repository methods
}

export interface IDriverService {
  getAll(): Promise<Driver[]>;
  findByEmail(email: string): Promise<Driver>;
  authenticate(email: string, password: string): Promise<Driver>;
}
