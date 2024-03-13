// This function will close the dropdown menu when the user presses the ESC key
export const dropdownTweaks = () => {
   document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const contextMenu = document.querySelector(
        ".c-context-menu__floating > .c-menu"
      );

      if (contextMenu)
        contextMenu.remove();
    }
  });
};
