const addMoveButtonsToSidebar = () => {
  const sidebarTitles = document.querySelectorAll(".c-sidebar-group__title");
  sidebarTitles.forEach((title) => {
    const groupName = title.textContent;
    if (groupName !== "...") {
      addMoveButtonsToGroup(title, groupName);
    }
  });

  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");

  sidebarGroups.forEach((group) => {
    const moveUpButton = group.querySelector(".c-sidebar-group__move-up");
    const moveDownButton = group.querySelector(".c-sidebar-group__move-down");

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

const addGroupHideFunctionality = () => {
  const sidebarTitles = document.querySelectorAll(".c-sidebar-group__title");
  sidebarTitles.forEach((title) => {
    const groupName = title.textContent;
    if (groupName !== "...") {
      title.addEventListener("click", () => {
		console.log("clicked")
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
      });
    }
  });
};

const sidebarLoaded = () => {
  addMoveButtonsToSidebar();
  addGroupHideFunctionality();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.getAttribute("data-is-collapsed") === "false") {
        addMoveButtonsToSidebar();
		addGroupHideFunctionality();
      }
    });
  });

  const config = {
    attributes: true,
    subtree: true,
  };
  observer.observe(document.querySelector(".c-sidebar__toggle"), config);
};

// Wait for sidebar to load, then add move buttons
const interval = setInterval(() => {
  const sidebar = document.querySelector(".c-sidebar__body");
  if (sidebar) {
    clearInterval(interval);
    sidebarLoaded();
  }
}, 100);

const addMoveButtonsToGroup = (element, groupName) => {
  element.innerHTML = `
	<div style="display:flex;justify-content:space-between;align-items:center;">${groupName}
	  <div>
		  <svg class="c-sidebar-group__move-up" width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			  <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		  </svg>
		  <svg class="c-sidebar-group__move-down" width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			  <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		  </svg>
	  </div>
	`;
};

function moveGroup(group, direction) {
  const parent = group.parentElement;
  const siblings = Array.from(parent.children);
  const index = siblings.indexOf(group);

  if (
    (direction === "up" && index > 0) ||
    (direction === "down" && index < siblings.length - 1)
  ) {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const referenceNode =
      direction === "up" ? siblings[newIndex] : siblings[newIndex + 1];
    parent.insertBefore(group, referenceNode);
  }
}
