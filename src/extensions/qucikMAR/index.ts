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

    if (document.getSelection().toString().trim() == "") return;

    const dropdown = element as HTMLElement;
    const menu = dropdown.querySelector(".c-menu");
    const dropdownItems = dropdown.querySelectorAll(".c-item");

    const newItem = dropdownItems[0].cloneNode(true) as HTMLElement;
    
    let insertBefore = dropdownItems[0];
    for (let i = 0; i < dropdownItems.length; i++) {
      if (dropdownItems[i].querySelector(".c-item__content").textContent == "Send to Automate") {
        insertBefore = dropdownItems[i];
        break;
      }
    }

    newItem.querySelector(".c-item__content").textContent =
      "Send to Match & Replace";
    newItem.querySelector(".c-item__trailing-visual")?.remove();
    newItem.querySelector(".c-item__leading-visual")?.remove();
    newItem.addEventListener("click", () => {
      const selectedText = document.getSelection().toString();

      window.location.hash = "#/tamper";
      setTimeout(() => {
        (
          document.querySelector(
            ".c-rule-form-create__search textarea"
          ) as HTMLInputElement
        ).value = selectedText;
      }, 5);

      menu.remove();
    });

    menu.insertBefore(newItem, insertBefore.nextSibling);
  });
};
