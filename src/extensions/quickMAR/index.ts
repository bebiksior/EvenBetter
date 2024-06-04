import { getEvenBetterAPI } from "../../utils/evenbetterapi";
import { getCaidoAPI } from "../../utils/caidoapi";

export const quickMatchAndReplace = () => {
  getEvenBetterAPI().eventManager.on("onContextMenuOpen", (element) => {
    if (
      !(
        window.location.hash == "#/replay" ||
        window.location.hash == "#/intercept"
      )
    )
      return;

    const selection = document.getSelection();
    if (!selection || selection.toString().trim() == "") return;

    const menu = (element as HTMLElement).querySelector("ul") as HTMLElement;
    const dropdownItems = menu.querySelectorAll(".p-menuitem");
    const firstItem = dropdownItems[0] as HTMLElement;
    if (!firstItem) return;

    const newItem = firstItem.cloneNode(true) as HTMLElement;

    let insertBefore = dropdownItems[0];
    for (let i = 0; i < dropdownItems.length; i++) {
      const item = dropdownItems[i];
      if (!item) continue;

      if (
        item.querySelector(".c-context-menu__content")?.textContent ==
        "Send to Automate"
      ) {
        insertBefore = item;
        break;
      }
    }

    const contextMenuContent = newItem.querySelector(".c-context-menu__content");
    if (!contextMenuContent) return;

    contextMenuContent.textContent = "Send to Match & Replace";
    newItem.querySelector(".c-context-menu__leading-visual")?.remove();
    newItem.querySelector(".c-context-menu__trailing-visual")?.remove();
    newItem.classList.remove("p-focus");

    newItem.addEventListener("mouseenter", () => {
      menu.childNodes.forEach((item: ChildNode) => {
        const element = item as HTMLElement;

        if (element.nodeName == "#text" || !element.classList || !element.classList.contains("p-focus")) return;

        element.classList.remove("p-focus");
        element.classList.remove("p-menuitem-active");
        element.classList.remove("p-highlight");

        const subMenu = element.querySelector("ul");
        if (subMenu) {
          subMenu.style.display = "none";

          element.addEventListener("mouseenter", () => {
            subMenu.style.display = "block";
            element.classList.add("p-focus");
            element.classList.add("p-menuitem-active");
            element.classList.add("p-highlight");
          }, { once: true });
        }
      });

      newItem.classList.add("p-focus");
    });

    newItem.addEventListener("mouseleave", () => {
      newItem.classList.remove("p-focus");
    });

    newItem.addEventListener("click", () => {
      const textToUse = getCaidoAPI().window.getActiveEditor()?.getSelectedText();
      if (!textToUse) return;

      window.location.hash = "#/tamper";
      let interval = setInterval(() => {
        const searchInput = document.querySelector(
          ".c-tamper textarea"
        ) as HTMLInputElement;
        const nameInput = document.querySelector(
          ".c-rule-form-update__name input"
        ) as HTMLInputElement;
        if (searchInput) {
          if (searchInput.value.length > 0) {
            document.querySelector(".c-rule-list-header__new button")?.click()
          }else{
            searchInput.value = textToUse;
            nameInput.value = textToUse;
            clearInterval(interval);
          }
        }
      }, 100);

      menu.remove();
    });

    if (insertBefore)
      menu.insertBefore(newItem, insertBefore.nextSibling);
  });
};