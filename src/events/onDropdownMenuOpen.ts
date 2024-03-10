import eventManagerInstance, { Event } from "./EventManager";

export class OnDropdownMenuOpen implements Event<Element> {
  private handlers: ((element: Element) => void)[] = [];

  addHandler(handler: (element: Element) => void): void {
    this.handlers.push(handler);
  }

  init() {
    let observers: MutationObserver[] = [];

    eventManagerInstance.on("onPageOpen", () => {
      setTimeout(() => {
        observers.forEach((observer) => observer.disconnect());
        observers = [];

        const contextMenus = document.querySelectorAll(
          ".c-context-menu__floating"
        );
        contextMenus.forEach((menu) => {
          const observer = new MutationObserver((mutations) => {
            if (
              mutations.reduce(
                (acc, mutation) => acc + mutation.addedNodes.length,
                0
              ) < 2
            ) {
              return;
            }

            this.trigger(menu);
          });

          observer.observe(menu, { childList: true });

          observers.push(observer);
        });
      }, 1000);
    });
  }

  trigger(element: Element): void {
    this.handlers.forEach((handler) => handler(element));
  }
}

export const onDropdownMenuOpen = new OnDropdownMenuOpen();
