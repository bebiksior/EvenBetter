const addMoveButtonsToSidebar = () => {
  const sidebarGroupTitles = document.querySelectorAll(
    ".c-sidebar-group__title"
  );
  sidebarGroupTitles.forEach((title) => {
    const groupName = title.textContent;
    if (groupName !== "...") {
      attachMoveButtonsToGroup(title, groupName);
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
      });
    }
  });
};

const attachMoveButtonsToGroup = (element, groupName) => {
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

const colorizeHttpHistory = () => {
  const queryCells = document.querySelectorAll(
    '.c-item-cell[data-column-id="query"]'
  );

  queryCells.forEach((cell) => colorizeCell(cell));
};

const colorizeCell = (cell) => {
  const query = cell.textContent;

  const url = new URL("http://x.com?" + query);
  const color = url.searchParams.get("_color");
  if (color) {
    const row = cell.parentElement;
    row.style.backgroundColor = color;
  } else {
    cell.parentElement.style.backgroundColor = "";
  }
};

let httpHistoryObserver;
const observeHTTPRequests = () => {
  const requests = document.querySelector(".c-table__wrapper");
  if (!requests) return;

  if (httpHistoryObserver) {
    httpHistoryObserver.disconnect();
    httpHistoryObserver = null;
  }

  httpHistoryObserver = new MutationObserver((mutations) => {
    colorizeHttpHistory();
  });

  const config = {
    childList: true,
    characterData: true,
    subtree: true,
  };

  httpHistoryObserver.observe(requests, config);
};

// This is a hacky way to detect when a new tab is opened
const detectOpenedTab = () => {
  const requestTable = document.querySelector(".c-content");
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.removedNodes.length > 0) return;

      const { target } = mutation;
      if (target.classList.contains("c-content")) {
        const firstChild = target.children[0];
        if (firstChild.classList.length === 1) {
          onTabOpen(firstChild.classList[0]);
        }
      }
    });
  });

  const config = {
    subtree: true,
    childList: true,
  };
  observer.observe(requestTable, config);
};

const onTabOpen = (tabName) => {
  switch (tabName) {
    case "c-intercept":
      setTimeout(() => {
        colorizeHttpHistory();
        observeHTTPRequests();
      }, 100);
      break;
    default:
      break;
  }
};

const onSidebarLoad = () => {
  addMoveButtonsToSidebar();
  addGroupHideFunctionality();
  detectOpenedTab();

  const currentTab =
    document.querySelector(".c-content").children[0].classList[0];

  if (currentTab) onTabOpen(currentTab);

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

// Wait for sidebar to load, then run onSidebarLoad
const interval = setInterval(() => {
  const sidebar = document.querySelector(".c-sidebar__body");
  if (sidebar) {
    clearInterval(interval);
    onSidebarLoad();
  }
}, 100);
