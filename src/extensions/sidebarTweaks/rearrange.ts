import { getSetting } from "../../settings";

export const addMoveButtonsToSidebar = () => {
  if (getSetting("sidebarRearrangeGroups") !== "true") return;

  const sidebarGroupTitles = document.querySelectorAll(
    ".c-sidebar-group__title"
  );
  sidebarGroupTitles.forEach((title) => {
    const groupName = title.textContent;
    if (groupName && groupName !== "...") {
      attachMoveButtonsToGroup(title, groupName);
    }
  });

  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");

  sidebarGroups.forEach((group) => {
    const moveUpButton = group.querySelector(".c-sidebar-group__move-up");
    const moveDownButton = group.querySelector(".c-sidebar-group__move-down");

    if (!moveUpButton || !moveDownButton) {
      return;
    }

    moveUpButton.addEventListener("click", (event) => {
      moveGroup(group, "up");
      event.stopPropagation();
    });

    moveDownButton.addEventListener("click", (event) => {
      moveGroup(group, "down");
      event.stopPropagation();
    });
  });
};

const attachMoveButtonsToGroup = (element: Element, groupName: string) => {
  element.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">${groupName}
          <div class="c-sidebar-group__rearrange-arrows">
              <svg class="c-sidebar-group__move-up" width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg class="c-sidebar-group__move-down" width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
          </div>
        `;
};

const moveGroup = (group: Element, direction: "up" | "down") => {
  const parentElement = group.parentElement;
  if (!parentElement) return;

  const index = Array.from(parentElement.children).indexOf(group);

  if (
    (direction === "up" && index > 0) ||
    (direction === "down" && index < parentElement.children.length - 1)
  ) {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex == 0) {
      return;
    }

    const referenceNode = parentElement.children[newIndex + (direction === "up" ? 0 : 1)];

    if (referenceNode && referenceNode.classList.contains("c-sidebar__toggle-wrapper"))
      if (direction === "up")
        parentElement.prepend(group);
      else
        parentElement.insertBefore(group, referenceNode.nextSibling);
    else if (referenceNode)
      parentElement.insertBefore(group, referenceNode);
    else
      parentElement.appendChild(group);

    storeSidebarGroupPositions();
  }
};

const storeSidebarGroupPositions = () => {
  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const parentElement = group.parentElement;
    if (!parentElement) return;

    const groupName = group.children[0]?.textContent?.trim();
    if (!groupName) return;
    
    const position = Array.from(parentElement.children).indexOf(group);
    localStorage.setItem(`evenbetter_${groupName}_position`, String(position));
  });
};

export const restoreSidebarGroupPositions = () => {
  if (getSetting("sidebarRearrangeGroups") !== "true") return;

  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const parentElement = group.parentElement;
    if (!parentElement) return;
    
    const groupName = group.children[0]?.textContent?.trim();
    if (!groupName) return;

    const position = localStorage.getItem(`evenbetter_${groupName}_position`);
    const element = parentElement.children[Number(position)];
    if (element)
      parentElement.insertBefore(group, element);
  });
};