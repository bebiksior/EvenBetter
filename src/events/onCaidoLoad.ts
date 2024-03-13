import { getSetting } from "../settings";
import { loadTheme } from "../themes";
import eventManagerInstance, { Event } from "./EventManager";

export class OnCaidoLoad implements Event {
  private handlers: (() => void)[] = [];

  addHandler(handler: () => void): void {
    this.handlers.push(handler);
  }

  init() {
    // wait for Caido to load
    const interval = setInterval(() => {
      if (isCaidoLoaded()) {
        clearInterval(interval);
        this.trigger();
      }
    }, 100);

    loadTheme(getSetting("theme"));
  }

  trigger(): void {
    this.handlers.forEach(handler => handler());
  }
}

const isCaidoLoaded = () => {
  return document.querySelector(".c-authenticated") !== null;
};

export const onCaidoLoad = new OnCaidoLoad();
