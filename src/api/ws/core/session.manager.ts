import { RecognizedString, WebSocket } from 'uWebSockets.js';

export interface UserData {
  id: string;
  email: string;
  ipAddress: string;
}

class SessionManager {
  private sessions: Map<string, WebSocket<UserData>>;
  constructor() {
    this.sessions = new Map();
  }

  set(userId: string, data: WebSocket<UserData>) {
    this.sessions.set(userId, data);
  }

  send(
    userId: string,
    message: RecognizedString,
    isBinary?: boolean,
    compress?: boolean,
  ): number | undefined {
    return this.sessions.get(userId)?.send(message, isBinary, compress);
  }

  delete(userId: string) {
    this.sessions.delete(userId);
  }
}

export default new SessionManager();
