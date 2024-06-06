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

    const contextMenuContent = newItem.querySelector(
      ".c-context-menu__content"
    );
    if (!contextMenuContent) return;

    contextMenuContent.textContent = "Send to Match & Replace";
    newItem.querySelector(".c-context-menu__leading-visual")?.remove();
    newItem.querySelector(".c-context-menu__trailing-visual")?.remove();
    newItem.classList.remove("p-focus");

    newItem.addEventListener("mouseenter", () => {
      menu.childNodes.forEach((item: ChildNode) => {
        const element = item as HTMLElement;

        if (
          element.nodeName == "#text" ||
          !element.classList ||
          !element.classList.contains("p-focus")
        )
          return;

        element.classList.remove("p-focus");
        element.classList.remove("p-menuitem-active");
        element.classList.remove("p-highlight");

        const subMenu = element.querySelector("ul");
        if (subMenu) {
          subMenu.style.display = "none";

          element.addEventListener(
            "mouseenter",
            () => {
              subMenu.style.display = "block";
              element.classList.add("p-focus");
              element.classList.add("p-menuitem-active");
              element.classList.add("p-highlight");
            },
            { once: true }
          );
        }
      });

      newItem.classList.add("p-focus");
    });

    newItem.addEventListener("mouseleave", () => {
      newItem.classList.remove("p-focus");
    });

    newItem.addEventListener("click", async () => {
      const textToUse = getCaidoAPI()
        .window.getActiveEditor()
        ?.getSelectedText();
      if (!textToUse) return;

      getCaidoAPI().navigation.goTo("/tamper");
      await waitForPage();

      const newRuleButton = document.querySelector(
        ".c-rule-list-header__new button"
      ) as HTMLButtonElement;
      if (!newRuleButton) return;

      newRuleButton.click();
      await waitForFormUpdate();

      const searchInput = document.querySelector(
        ".c-tamper textarea"
      ) as HTMLInputElement;
      const nameInput = document.querySelector(
        ".c-rule-form-update__name input"
      ) as HTMLInputElement;

      if (!searchInput || !nameInput) return;

      let firstLine = textToUse.split("\n")[0];
      if (!firstLine) firstLine = textToUse;

      setValue(searchInput, textToUse);
      setValue(nameInput, firstLine);

      setTimeout(() => {
        const saveButton = document.querySelector(
          ".c-rule-form-update__save button"
        ) as HTMLButtonElement;
        if (!saveButton) return;

        saveButton.click();
      }, 25);
      

      menu.remove();
    });

    if (insertBefore) menu.insertBefore(newItem, insertBefore.nextSibling);
  });
};

const waitForPage = async () => {
  const formUpdate = document.querySelector(".c-rule-form-update");
  const formCreate = document.querySelector(".c-rule-form-create");
  if (formUpdate || formCreate) {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
  return waitForPage();
};

const waitForFormUpdate = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const formUpdate = document.querySelector(".c-rule-form-update__body");
  if (formUpdate) {
    return;
  }

  return waitForFormUpdate();
}

function setValue(element: HTMLInputElement, text: string) {
  const previousFocus = document.activeElement as HTMLElement;
  element.focus();

  element.value = "";

  for (let i = 0; i < text.length; i++) {
    element.value += text[i];

    let inputEvent = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(inputEvent);
  }

  let changeEvent = new Event("change", {
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(changeEvent);

  previousFocus?.focus();
}
