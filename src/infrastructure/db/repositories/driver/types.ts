import { Driver } from '@domain/driver';
import { WorkShift } from '@domain/work_shift';

export interface IWorkShiftQuery {
  start: string;
  end: string;
  work_shift_id: string;
  driver_id: string;
}

export interface IDriverQueryResult {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
}

export const mapDriverToDomain = (driver: IDriverQueryResult): Driver => {
  return {
    id: driver.id,
    password: driver.password,
    email: driver.email,
    phone: driver.phone,
    firstName: driver.first_name,
    lastName: driver.last_name,
  };
};

export interface IDriverWorkShiftsQueryResult extends IDriverQueryResult, Partial<IWorkShiftQuery> {}

export const mapDriversWorkShiftsToDomain = (driversWs: IDriverWorkShiftsQueryResult[]): Driver[] => {
  const workShifts = new Map<string, WorkShift[]>();

  for (const driverWs of driversWs) {
    if (driverWs.work_shift_id == null) continue;

    const value = workShifts.get(driverWs.id);

    if (value) {
      workShifts.set(driverWs.id, [
        {
          id: driverWs.work_shift_id,
          start: driverWs.start!,
          end: driverWs.end!,
          driverId: driverWs.driver_id!,
        },
        ...value,
      ]);
    } else {
      workShifts.set(driverWs.id, [
        {
          id: driverWs.work_shift_id,
          start: driverWs.start!,
          end: driverWs.end!,
          driverId: driverWs.driver_id!,
        },
      ]);
    }
  }

  return driversWs.map<Driver>((driver) => ({
    id: driver.id,
    email: driver.email,
    password: driver.password,
    firstName: driver.first_name,
    lastName: driver.last_name,
    workShifts: workShifts.get(driver.id),
  }));
};
