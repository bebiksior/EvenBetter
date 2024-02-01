const COLORIZE_PARAMETER_NAME = "_color",
  COLORIZE_HTTP_ROWS = true, // Set to false if you don't want to colorize HTTP rows
  SIDEBAR_HIDE_GROUPS = true, // Set to false if you don't want the hide groups functionality in the sidebar
  SIDEBAR_REARRANGE_GROUPS = true; // Set to false if you don't want the rearrange groups functionality in the sidebar

const addMoveButtonsToSidebar = () => {
  if (!SIDEBAR_REARRANGE_GROUPS) return;

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

const addGroupHideFunctionality = () => {
  if (!SIDEBAR_HIDE_GROUPS) return;

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

const moveGroup = (group, direction) => {
  const index = Array.from(group.parentElement.children).indexOf(group);

  if (
    (direction === "up" && index > 0) ||
    (direction === "down" && index < group.parentElement.children.length - 1)
  ) {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex == 0) {
      return;
    }

    const referenceNode =
      group.parentElement.children[newIndex + (direction === "up" ? 0 : 1)];
    group.parentElement.insertBefore(group, referenceNode);

    storeSidebarGroupPositions();
  }
};

const storeSidebarGroupPositions = () => {
  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const groupName = group.children[0].textContent.trim();
    const position = Array.from(group.parentElement.children).indexOf(group);
    localStorage.setItem(`evenbetter_${groupName}_position`, position);
  });
};

const restoreSidebarGroupPositions = () => {
  if (!SIDEBAR_REARRANGE_GROUPS) return;

  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const groupName = group.children[0].textContent.trim();
    const position = localStorage.getItem(`evenbetter_${groupName}_position`);
    if (position) {
      group.parentElement.insertBefore(
        group,
        group.parentElement.children[position]
      );
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
  if (!SIDEBAR_HIDE_GROUPS) return;

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

const colorizeHttpHistory = () => {
  if (!COLORIZE_HTTP_ROWS) return;

  const queryCells = document.querySelectorAll(
    '.c-item-cell[data-column-id="query"]'
  );

  queryCells.forEach((cell) => colorizeCell(cell));
};

const colorizeCell = (cell) => {
  const query = cell.textContent;

  const url = new URL("http://x.com?" + query);
  const color = url.searchParams.get(COLORIZE_PARAMETER_NAME);
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
          onTabOpened(firstChild.classList[0]);
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

const onTabOpened = (tabName) => {
  console.log("Tab opened: ", tabName);

  switch (tabName) {
    case "c-intercept":
      setTimeout(() => {
        colorizeHttpHistory();
        observeHTTPRequests();
      }, 100);
      break;
    case "c-replay":
      setTimeout(() => {
        observeReplayInput();
      }, 100);
      break;
    default:
      break;
  }
};

const observeReplayInput = () => {
  const replayInput = document.querySelector(".c-replay-entry .cm-content");
  if (!replayInput) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.textContent.includes("$ssrfinstance")) {
        // replace the $interactsh with example.com
        const text = mutation.target.textContent.replace(
          "$ssrfinstance",
          "example.com"
        );

        mutation.target.textContent = text;

        console.log("Sending request to ssrf api");
        fetch("https://api.cvssadvisor.com/ssrf/api/instance", {
          method: "POST",
        }).then((response) => response.json()).then((data) => {
          console.log(data);
        });
      }
    });
  });

  const config = {
    characterData: true,
    subtree: true,
  };

  observer.observe(replayInput, config);
};

const observeSidebarCollapse = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      onSidebarCollapsed(
        mutation.target.getAttribute("data-is-collapsed") === "true"
      );
    });
  });

  const config = {
    attributes: true,
    subtree: true,
  };
  observer.observe(document.querySelector(".c-sidebar__toggle"), config);
};

const onSidebarCollapsed = (isCollapsed) => {
  if (!isCollapsed) {
    addMoveButtonsToSidebar();
    addGroupHideFunctionality();

    restoreSidebarGroupPositions();
    restoreSidebarGroupCollapsedStates();
  }
};

const onSidebarContentLoaded = () => {
  addMoveButtonsToSidebar();
  addGroupHideFunctionality();
  detectOpenedTab();
  observeSidebarCollapse();

  restoreSidebarGroupPositions();
  restoreSidebarGroupCollapsedStates();

  const currentTab =
    document.querySelector(".c-content")?.children[0]?.classList[0];

  if (currentTab) onTabOpened(currentTab);
};

// Wait for sidebar to load, then run onSidebarContentLoaded
const interval = setInterval(() => {
  const sidebar = document.querySelector(".c-sidebar__body");
  if (sidebar) {
    clearInterval(interval);
    onSidebarContentLoaded();
  }
}, 100);
