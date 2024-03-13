// EventManager.ts

import log from "../utils/Logger";

export interface Event<T = void> {
  init(): void;
  addHandler(handler: (data?: T) => void): void;
  trigger(data?: T): void;
}

export class EventManager {
  private events: { [eventName: string]: Event<any> } = {};

  registerEvent<T>(eventName: string, event: Event<T>) {
    this.events[eventName] = event;
  }

  triggerEvent<T>(eventName: string, data?: T) {
    const event = this.events[eventName];
    if (event) {
      event.trigger(data);
    } else {
      console.error(`Event "${eventName}" not registered.`);
    }
  }

  on<T>(eventName: string, handler: (data?: T) => void) {
    const event = this.events[eventName];
    if (event) {
      event.addHandler(handler);
    } else {
      console.error(`Event "${eventName}" not registered.`);
    }
  }

  initEvents() {
    log.info(`Initializing ${Object.keys(this.events).length} custom events`);
    for (const eventName in this.events) {
      this.events[eventName].init();
    }
  }
}

const eventManagerInstance = new EventManager();
export default eventManagerInstance;