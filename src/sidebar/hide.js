const { getSetting } = require("../settings/settings");

const addGroupHideFunctionality = () => {
  if (getSetting('sidebarHideGroups') !== "true") return;

  const sidebarGroupTitles = document.querySelectorAll(
    ".c-sidebar-group__title"
  );
  sidebarGroupTitles.forEach((title) => {
    const groupName = title.textContent;
    if (groupName !== "...") {
      title.addEventListener("click", () => {
        const group = title.parentElement;
        const groupItems = group.querySelector(".c-sidebar-group__items");
        const isCollapsed = group.getAttribute("data-is-group-collapsed");
        if (isCollapsed === "true") {
          groupItems.style.display = "block";
          group.setAttribute("data-is-group-collapsed", "false");
        } else {
          groupItems.style.display = "none";
          group.setAttribute("data-is-group-collapsed", "true");
        }
        storeSidebarGroupCollapsedStates();
      });
    }
  });
};

const storeSidebarGroupCollapsedStates = () => {
  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const groupName = group.children[0].textContent.trim();
    const isCollapsed = group.getAttribute("data-is-group-collapsed");
    localStorage.setItem(`evenbetter_${groupName}_isCollapsed`, isCollapsed);
  });
};

const restoreSidebarGroupCollapsedStates = () => {
  if (getSetting('sidebarHideGroups') !== "true") return;

  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const groupName = group.children[0].textContent.trim();
    const isCollapsed = localStorage.getItem(
      `evenbetter_${groupName}_isCollapsed`
    );
    if (isCollapsed) {
      group.setAttribute("data-is-group-collapsed", isCollapsed);
      const groupItems = group.querySelector(".c-sidebar-group__items");
      groupItems.style.display = isCollapsed === "true" ? "none" : "block";
    }
  });
};

module.exports = { addGroupHideFunctionality, restoreSidebarGroupCollapsedStates, storeSidebarGroupCollapsedStates };