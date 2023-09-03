import { FastifyRouteHandlerFn } from '../controller.types';
import { DriverLoginResponseBody, GetDriverResponseBody, GetDriversResponseBody } from './driver.dto';

type GetAllHandler = FastifyRouteHandlerFn<GetDriversResponseBody>;
type GetMeHandler = FastifyRouteHandlerFn<GetDriverResponseBody>;
type LoginHandler = FastifyRouteHandlerFn<DriverLoginResponseBody>;

export interface IDriverController {
  getAll: GetAllHandler;
  me: GetMeHandler;
  login: LoginHandler;
}
