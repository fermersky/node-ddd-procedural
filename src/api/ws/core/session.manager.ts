import { WebSocket } from 'uWebSockets.js';

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

  delete(userId: string) {
    this.sessions.delete(userId);
  }
}

export default new SessionManager();
