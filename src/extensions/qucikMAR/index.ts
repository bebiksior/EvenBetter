import eventManagerInstance from "../../events/EventManager";

export const quickMatchAndReplace = () => {
  eventManagerInstance.on("onContextMenuOpen", (element) => {
    if (
      !(
        window.location.hash == "#/replay" ||
        window.location.hash == "#/intercept"
      )
    )
      return;


    const selection = document.getSelection();
    if (selection.toString().trim() == "") return;

    const dropdown = element as HTMLElement;
    const menu = dropdown.querySelector(".c-menu");
    const dropdownItems = dropdown.querySelectorAll(".c-item");

    const newItem = dropdownItems[0].cloneNode(true) as HTMLElement;

    let insertBefore = dropdownItems[0];
    for (let i = 0; i < dropdownItems.length; i++) {
      if (
        dropdownItems[i].querySelector(".c-item__content").textContent ==
        "Send to Automate"
      ) {
        insertBefore = dropdownItems[i];
        break;
      }
    }

    newItem.querySelector(".c-item__content").textContent =
      "Send to Match & Replace";
    newItem.querySelector(".c-item__trailing-visual")?.remove();
    newItem.querySelector(".c-item__leading-visual")?.remove();

    // we can't just do `selection.toString()` in the `click` event because Safari clears it before click event is triggered :(
    let selectedText = "";
    document.addEventListener("mousedown", () => {
      selectedText = selection.toString().trim();
    });

    newItem.addEventListener("click", () => {
      const textToUse = selectedText;

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