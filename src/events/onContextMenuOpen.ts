import { Event } from "./EventManager";

export class OnContextMenuOpen implements Event<Element> {
  private handlers: ((element: Element) => void)[] = [];

  addHandler(handler: (element: Element) => void): void {
    this.handlers.push(handler);
  }

  init() {
    const observerOptions = {
      childList: true,
      subtree: true,
    };

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        const target = mutation.target as HTMLElement;
        if (target.classList.contains("c-context-menu__floating")) {
          if (isContextMenuOpen()) {
            this.trigger(target);
          }
          break;
        }
      }
    });

    observer.observe(document.body, observerOptions);
  }

  trigger(element: Element): void {
    this.handlers.forEach((handler) => handler(element));
  }
}

const isContextMenuOpen = () => {
  return document.querySelector(".c-context-menu__floating .c-menu") !== null;
};

export const onContextMenuOpen = new OnContextMenuOpen();
