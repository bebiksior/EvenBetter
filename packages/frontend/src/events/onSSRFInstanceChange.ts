import { Event } from "@bebiks/evenbetter-api/src/events/EventManager";

export class OnSSRFInstanceChange implements Event {
  private handlers: (() => void)[] = [];

  addHandler(handler: () => void): void {
    this.handlers.push(handler);
  }

  init() {}

  trigger(): void {
    this.handlers.forEach((handler) => handler());
  }
}