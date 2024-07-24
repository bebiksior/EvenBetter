import { getSetting } from "../../settings";

export const addGroupHideFunctionality = () => {
  if (getSetting("sidebarHideGroups") !== "true") return;

  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const title = group.querySelector(".c-sidebar-group__title");
    if (!title) return;

    addHideFunctionalityToGroup(group);
  });

  const targetNode = document.querySelector(".c-sidebar__body");

  if (targetNode) {
    const targetElement = targetNode as Element;

    const config: MutationObserverInit = { childList: true, subtree: true };

    const callback: MutationCallback = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
           mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              (node as Element).classList.contains("c-sidebar-group")
            ) {
              const title = (node as Element).querySelector(
                ".c-sidebar-group__title"
              );
              if (!title) return;

              if ((node as Element).getAttribute("modified") === "true") return;

              addHideFunctionalityToGroup(node as Element);
              restoreSidebarGroupCollapsedState(title.textContent?.trim() || "");
            }
          });
        }
      }
    };

    const observer = new MutationObserver(callback);

    observer.observe(targetElement, config);
  }
};

const addHideFunctionalityToGroup = (group: Element) => {
  const groupTitle = group.querySelector(".c-sidebar-group__title");
  if (!groupTitle) return;
  group.setAttribute("modified", "true")

  groupTitle.addEventListener("click", () => {
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

export const storeSidebarGroupCollapsedStates = () => {
  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const groupName = group.children[0]?.textContent?.trim();
    if (!groupName) return;
    
    const isCollapsed = group.getAttribute("data-is-group-collapsed");
    if (isCollapsed === null) return;

    localStorage.setItem(`evenbetter_${groupName}_isCollapsed`, isCollapsed);
  });
};

export const restoreSidebarGroupCollapsedStates = () => {
  if (getSetting("sidebarHideGroups") !== "true") return;

  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const groupName = group.children[0]?.textContent?.trim();
    if (!groupName) return;
    
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

export const restoreSidebarGroupCollapsedState = (groupName: string) => {
  if (getSetting("sidebarHideGroups") !== "true") return;

  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const name = group.children[0]?.textContent?.trim();
    if (!name) return;

    if (name === groupName) {
      const isCollapsed = localStorage.getItem(
        `evenbetter_${groupName}_isCollapsed`
      );

      if (isCollapsed) {
        group.setAttribute("data-is-group-collapsed", isCollapsed);
        const groupItems = group.querySelector(".c-sidebar-group__items") as HTMLElement;
        groupItems.style.display = isCollapsed === "true" ? "none" : "block";
      }
    }
  });
}