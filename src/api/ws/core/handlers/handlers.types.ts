import { HttpRequest, HttpResponse, WebSocket, us_socket_context_t } from 'uWebSockets.js';

import { UserData } from '../session.manager';

export type openHandler = (ws: WebSocket<UserData>) => void;

export type messageHandler = (ws: WebSocket<UserData>, message: ArrayBuffer, isBinary: boolean) => void;

export type drainHandler = (ws: WebSocket<UserData>) => void;

export type closeHandler = (ws: WebSocket<UserData>, code: number, message: ArrayBuffer) => void;

export type upgradeHandler = (
  res: HttpResponse,
  req: HttpRequest,
  context: us_socket_context_t,
) => Promise<void>;

export interface WsHandlers {
  open: openHandler;
  message: messageHandler;
  drain: drainHandler;
  close: closeHandler;
  upgrade: upgradeHandler;
}
