import eventManagerInstance from "../../events/EventManager";

export const quickMatchAndReplace = () => {
  eventManagerInstance.on("onDropdownMenuOpen", (element) => {
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

    let item = Array.from(dropdownItems).find(
      (item) =>
        item.querySelector(".c-item__content").textContent.trim() ==
        "Send to Automate"
    );
    if (!item) {
      item = Array.from(dropdownItems).find(
        (item) =>
          item.querySelector(".c-item__content").textContent.trim() == "Copy"
      );
      if (!item) return;
    }

    const newItem = item.cloneNode(true) as HTMLElement;
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

    menu.insertBefore(newItem, item.nextSibling);
  });
};
