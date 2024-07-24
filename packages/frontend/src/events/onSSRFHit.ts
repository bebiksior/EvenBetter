import { Event } from "@bebiks/evenbetter-api/src/events/EventManager";

export class OnSSRFHit implements Event<Request> {
  private handlers: ((request: Request) => void)[] = [];

  addHandler(handler: (request: Request) => void): void {
    this.handlers.push(handler);
  }

  init() {}

  trigger(request: Request): void {
    this.handlers.forEach((handler) => handler(request));
  }
}

export interface Request {
  id: string;
  protocol: string;
  dump: string;
  ip: string;
  timestamp: number;
}