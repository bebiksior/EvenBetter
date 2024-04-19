import { Caido } from "@caido/sdk-frontend";
import EvenBetterAPI from "@bebiks/evenbetter-api";

export const quickMatchAndReplace = () => {
  EvenBetterAPI.eventManager.on("onContextMenuOpen", (element) => {
    if (
      !(
        window.location.hash == "#/replay" ||
        window.location.hash == "#/intercept"
      )
    )
      return;

    const selection = document.getSelection();
    if (selection.toString().trim() == "") return;

    const menu = (element as HTMLElement).querySelector("ul") as HTMLElement;
    const dropdownItems = menu.querySelectorAll(".p-menuitem");

    const newItem = dropdownItems[0].cloneNode(true) as HTMLElement;

    let insertBefore = dropdownItems[0];
    for (let i = 0; i < dropdownItems.length; i++) {
      if (
        dropdownItems[i].querySelector(".c-context-menu__content").textContent ==
        "Send to Automate"
      ) {
        insertBefore = dropdownItems[i];
        break;
      }
    }

    newItem.querySelector(".c-context-menu__content").textContent =
      "Send to Match & Replace";
    newItem.querySelector(".c-context-menu__leading-visual")?.remove();
    newItem.querySelector(".c-context-menu__trailing-visual")?.remove();
    newItem.classList.remove("p-focus");

    newItem.addEventListener("mouseenter", () => {
      menu.childNodes.forEach((item: Element) => {
        if (item.nodeName == "#text" || !item.classList || !item.classList.contains("p-focus")) return;

        item.classList.remove("p-focus");
        item.classList.remove("p-menuitem-active");
        item.classList.remove("p-highlight");

        const subMenu = item.querySelector("ul");
        if (subMenu) {
          subMenu.style.display = "none";

          item.addEventListener("mouseenter", () => {
            subMenu.style.display = "block";
            item.classList.add("p-focus");
            item.classList.add("p-menuitem-active");
            item.classList.add("p-highlight");
          }, { once: true });
        }
      });

      newItem.classList.add("p-focus");
    });

    newItem.addEventListener("mouseleave", () => {
      newItem.classList.remove("p-focus");
    });

    newItem.addEventListener("click", () => {
      const textToUse = Caido.window.getActiveEditor().getSelectedText();

      window.location.hash = "#/tamper";
      let interval = setInterval(() => {
        const searchInput = document.querySelector(
          ".c-tamper textarea"
        ) as HTMLInputElement;

        if (searchInput) {
          searchInput.value = textToUse;

          clearInterval(interval);
        }
      }, 2);

      menu.remove();
    });

    menu.insertBefore(newItem, insertBefore.nextSibling);
  });
};