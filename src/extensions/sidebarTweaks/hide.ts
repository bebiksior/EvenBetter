import { getSetting } from "../../settings";

export const addGroupHideFunctionality = () => {
  if (getSetting("sidebarHideGroups") !== "true") return;

  const sidebarGroupTitles = document.querySelectorAll(
    ".c-sidebar-group__title"
  );
  sidebarGroupTitles.forEach((title) => {
    const groupName = title.textContent;
    if (groupName !== "...") {
      title.addEventListener("click", () => {
        const group = title.parentElement;
        const groupItems = group.querySelector(".c-sidebar-group__items") as HTMLElement;
        const isCollapsed = group.getAttribute("data-is-group-collapsed");

        groupItems.style.display = isCollapsed === "true" ? "block" : "none";
        group.setAttribute(
          "data-is-group-collapsed",
          isCollapsed === "true" ? "false" : "true"
        );

        storeSidebarGroupCollapsedStates();
      });
    }
  });
};

export const storeSidebarGroupCollapsedStates = () => {
  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const groupName = group.children[0].textContent.trim();
    const isCollapsed = group.getAttribute("data-is-group-collapsed");
    localStorage.setItem(`evenbetter_${groupName}_isCollapsed`, isCollapsed);
  });
};

export const restoreSidebarGroupCollapsedStates = () => {
  if (getSetting("sidebarHideGroups") !== "true") return;

  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const groupName = group.children[0].textContent.trim();
    const isCollapsed = localStorage.getItem(
      `evenbetter_${groupName}_isCollapsed`
    );

    if (isCollapsed) {
      group.setAttribute("data-is-group-collapsed", isCollapsed);
      const groupItems = group.querySelector(".c-sidebar-group__items") as HTMLElement;
      groupItems.style.display = isCollapsed === "true" ? "none" : "block";
    }
  });
};