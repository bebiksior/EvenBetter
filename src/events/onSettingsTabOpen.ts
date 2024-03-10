import log from "../utils/Logger";
import { Event } from "./EventManager";

export class OnSettingsTabOpen implements Event<string> {
  private handlers: ((data?: string) => void)[] = [];

  addHandler(handler: (data?: string) => void): void {
    this.handlers.push(handler);
  }

  init() {}

  trigger(data: string) {
    log.info(`Settings tab opened: ${data}`);

    switch (data) {
      case "developer":
        const jsSaveButton = document.querySelector(".c-custom-js__footer");
        jsSaveButton.removeEventListener("click", reloadPage);
        jsSaveButton.addEventListener("click", reloadPage);
    }

    this.handlers.forEach((handler) => handler(data));
  }
}

const reloadPage = () => {
  setTimeout(() => {
    location.reload();
  }, 250);
};

export const onSettingsTabOpen = new OnSettingsTabOpen();
