const settings = {
  colorizeParameterName:
    localStorage.getItem("evenbetter_colorize-parameter-name") || "_color",
  ssrfInstancePlaceholder:
    localStorage.getItem("evenbetter_ssrf-instance-placeholder") ||
    "$ssrfinstance",

  colorizeHttpRows:
    localStorage.getItem("evenbetter_colorize-http-rows") === "true",
  sidebarHideGroups:
    localStorage.getItem("evenbetter_sidebar-hide-groups") === "true",
  sidebarRearrangeGroups:
    localStorage.getItem("evenbetter_sidebar-rearrange-groups") === "true",
  ssrfInstanceFunctionality:
    localStorage.getItem("evenbetter_ssrf-instance-functionality") === "true",

  evenBetterVersionCheckUrl:
    "https://raw.githubusercontent.com/bebiksior/EvenBetter/main/version.txt",
  currentVersion: "v1.2",
};

// Created some themes with ChatGPT, feel free to add more themes and make a PR :D
const themes = {
  evendarker: {
    name: "Even Darker",
    "--c-header-cell-border": "#101010",
    "--c-bg-default": "#050607",
    "--c-bg-subtle": "#090a0c",
    "--c-table-item-row": "#08090a",
    "--c-table-item-row-hover": "#0f1012",
    "--header-cell-width": "1px",
    "--c-table-even-item-row": "#08090a",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--replay-text-color": "#fff",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)",
  },
  caido: {
    name: "Caido Default",
    "--c-header-cell-border": "#101010",
    "--c-bg-default": "#25272d",
    "--c-bg-subtle": "var(--c-gray-800)",
    "--c-table-item-row": "#08090a",
    "--c-table-item-row-hover": "#25272d",
    "--header-cell-width": "0px",
    "--c-table-even-item-row": "#353942",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--replay-text-color": "#fff",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)",
  },
  gray: {
    name: "Gray",
    "--c-header-cell-border": "#101010",
    "--c-bg-default": "#202020",
    "--c-bg-subtle": "#252525",
    "--c-table-item-row": "#252525",
    "--c-table-item-row-hover": "#303030",
    "--header-cell-width": "1px",
    "--c-table-even-item-row": "#252525",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--replay-text-color": "#fff",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)",
  },
  oceanblue: {
    name: "Ocean Blue",
    "--c-header-cell-border": "#116699",
    "--c-bg-default": "#1a2b3c",
    "--c-bg-subtle": "#2a3b4c",
    "--c-table-item-row": "#1c2d3e",
    "--c-table-item-row-hover": "#2a3b4c",
    "--header-cell-width": "0px",
    "--c-table-even-item-row": "#2c3d4e",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--replay-text-color": "#fff",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)",
  },
  solarized: {
    name: "Solarized",
    "--c-header-cell-border": "#93a1a1",
    "--c-bg-default": "#002b36",
    "--c-bg-subtle": "#073642",
    "--c-table-item-row": "#073642",
    "--c-table-item-row-hover": "#586e75",
    "--header-cell-width": "1px",
    "--c-table-even-item-row": "#073642",
    "--c-fg-default": "#93a1a1",
    "--c-fg-subtle": "#657b83",
    "--replay-text-color": "#fdf6e3",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "#073642",
  },
  black: {
    name: "Black",
    "--c-header-cell-border": "#000000",
    "--c-bg-default": "#111111",
    "--c-bg-subtle": "#070707",
    "--c-table-item-row": "#050505",
    "--c-table-item-row-hover": "#222222",
    "--header-cell-width": "0px",
    "--c-table-even-item-row": "#111111",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--replay-text-color": "#fff",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)",
  },
};

const addMoveButtonsToSidebar = () => {
  if (!settings.sidebarRearrangeGroups) return;

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
  if (!settings.sidebarHideGroups) return;

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
  if (!settings.sidebarRearrangeGroups) return;

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
  if (!settings.sidebarHideGroups) return;

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

let lastExecutionTime = 0;
const cooldownDuration = 50;

// There's a cooldown to avoid performance issues
const colorizeHttpHistory = () => {
  if (!settings.colorizeHttpRows) return;

  const currentTime = Date.now();

  if (currentTime - lastExecutionTime < cooldownDuration) {
    return;
  }

  lastExecutionTime = currentTime;

  const queryCells = document.querySelectorAll(
    '.c-item-cell[data-column-id="query"]'
  );

  queryCells.forEach((cell) => colorizeCell(cell));
};

const colorizeCell = (cell) => {
  const query = cell.textContent;

  const url = new URL("http://x.com?" + query);
  const color = url.searchParams.get(settings.colorizeParameterName);
  const row = cell.parentElement.parentElement;
  if (color) {
    row.style.backgroundColor = color;
    row.setAttribute("colorized", "true");
  } else {
    row.style.backgroundColor = "";
    row.setAttribute("colorized", "false");
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

  httpHistoryObserver = new MutationObserver(() => {
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
let tabObserver;
const detectOpenedTab = () => {
  if (tabObserver) {
    tabObserver.disconnect();
    tabObserver = null;
  }

  const requestTable = document.querySelector(".c-content");
  tabObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.removedNodes.length > 0) return;
      if (mutation.addedNodes.length === 0) return;

      const { target } = mutation;
      if (target.classList.contains("c-content")) {
        const addedNode = mutation.addedNodes[0];
        if (!addedNode.classList) return;

        if (addedNode.classList.length === 1) {
          const tabName = addedNode.classList[0];
          if (!tabName.startsWith("c-")) return;

          onTabOpened(tabName);
        }
      }
    });
  });

  const config = {
    subtree: true,
    childList: true,
  };

  tabObserver.observe(requestTable, config);
};

const onTabOpened = (tabName) => {
  console.log("Tab opened: ", tabName);

  switch (tabName) {
    case "c-intercept":
      setTimeout(() => {
        colorizeHttpHistory();
        observeHTTPRequests();
      }, 50);
      break;
    case "c-replay":
      setTimeout(() => observeReplayInput(), 50);
      break;
    case "c-settings":
      setTimeout(() => {
        observeSettingsTab();
        modifySettingsTab();
      }, 10);
      break;
    default:
      break;
  }
};

let settingsObserver;
const observeSettingsTab = () => {
  const settingsNavigation = document.querySelector(
    ".c-settings__navigation .c-underline-nav"
  );
  if (!settingsNavigation) return;

  if (settingsObserver) {
    settingsObserver.disconnect();
    settingsObserver = null;
  }

  settingsObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const isActive = mutation.target.getAttribute("data-is-active");
      if (isActive === "true") {
        onSettingsTabOpened(mutation.target.textContent);
      }
    });
  });

  const config = {
    subtree: true,
    attributes: true,
  };

  settingsObserver.observe(settingsNavigation, config);
};

const onSettingsTabOpened = (tabName) => {
  console.log("Settings tab opened: ", tabName);

  const settingsContent = document.querySelector(".c-settings__content");

  if (tabName === "Developer") {
    console.log("Developer tab opened");
    setTimeout(() => {
      const jsSaveButton = document.querySelector(".c-custom-js__footer");
      jsSaveButton.addEventListener("click", () => {
        setTimeout(() => {
          location.reload();
        }, 300);
      });
    }, 50);
  }

  if (tabName === "EvenBetter") {
    const currentTheme =
      localStorage.getItem("evenbetter_theme") || "evendarker";

    settingsContent.children[0].style.display = "none";
    const newDiv = document.createElement("div");
    newDiv.innerHTML = `
      <div class="even-better__container">
        <div class="even-better__header">
          <div class="even-better__header-title">EvenBetter - Settings</div>
          <div class="even-better__header-description">Customize EvenBetter plugin here and make your Caido even better :D</div>
        </div>
        <div class="even-better__main">
          <!-- Theme select --> 
          <div class="even-better__theme-select">
            <label class="even-better__label">Theme</label><br>
            <select class="even-better__select">
              ${Object.keys(themes)
                .map(
                  (theme) =>
                    `<option value="${theme}" ${
                      currentTheme == theme ? "selected" : ""
                    }>${themes[theme].name}</option>`
                )
                .join("")}
            </select>
          </div>

          <!-- General settings, should colorize http rows etc -->
          <div class="even-better__general-settings">
            <label class="even-better__label">General</label><br>
            <div class="even-better__settings">
              <div>
                <input type="checkbox" id="colorize-http-rows" name="colorize-http-rows" ${
                  settings.colorizeHttpRows ? "checked" : ""
                }>
                <label for="colorize-http-rows">Colorize HTTP rows</label><br>
              </div>
              <div>
                <input type="checkbox" id="sidebar-hide-groups" name="sidebar-hide-groups" ${
                  settings.sidebarHideGroups ? "checked" : ""
                }>
                <label for="sidebar-hide-groups">Hide groups functionality</label><br>
              </div>
              <div>
                <input type="checkbox" id="sidebar-rearrange-groups" name="sidebar-rearrange-groups" ${
                  settings.sidebarRearrangeGroups ? "checked" : ""
                }>
                <label for="sidebar-rearrange-groups">Rearrange groups functionality</label><br>
              </div>
              <div>
                <input type="checkbox" id="ssrf-instance-functionality" name="ssrf-instance-functionality" ${
                  settings.ssrfInstanceFunctionality ? "checked" : ""
                }>
                <label for="ssrf-instance-functionality">SSRF instance functionality</label><br>
              </div>
              <div>
                <label for="ssrf-instance-placeholder">SSRF instance placeholder</label><br>
                <input type="text" id="ssrf-instance-placeholder" name="ssrf-instance-placeholder" value="${
                  settings.ssrfInstancePlaceholder
                }">
              </div>
              <div>
                <label for="colorize-parameter-name">Colorize parameter name</label><br>
                <input type="text" id="colorize-parameter-name" name="colorize-parameter-name" value="${
                  settings.colorizeParameterName
                }">
              </div>
              <!-- check for updates -->
              <div>
                <button class="evenbetter__updates-button">Check for updates</button>
                <div class="evenbetter__update-status"> </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    newDiv.id = "evenbetter-settings-content";

    const select = newDiv.querySelector(".even-better__select");
    select.addEventListener("change", (event) => {
      const theme = event.target.value;
      localStorage.setItem("evenbetter_theme", theme);
      loadTheme(theme);
    });

    const checkboxes = newDiv.querySelectorAll("input[type=checkbox]");
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const name = event.target.name;
        const value = event.target.checked;

        localStorage.setItem(`evenbetter_${name}`, value);
        location.reload();
      });
    });

    const updateButton = newDiv.querySelector(".evenbetter__updates-button");
    const updateStatus = newDiv.querySelector(".evenbetter__update-status");
    updateButton.addEventListener("click", () => {
      updateStatus.textContent = "Checking for updates...";
      checkForUpdates().then((data) => {
        updateStatus.textContent = data.status;
      });
    });

    const inputs = newDiv.querySelectorAll("input[type=text]");

    let timeout;
    inputs.forEach((input) => {
      input.addEventListener("input", (event) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const name = event.target.name;
          const value = event.target.value;
          localStorage.setItem(`evenbetter_${name}`, value);

          location.reload();
        }, 1000);
      });
    });

    document.querySelector(".c-settings__content").appendChild(newDiv);
    return;
  }

  document
    .querySelector("#evenbetter-settings-tab")
    ?.setAttribute("data-is-active", "false");
  settingsContent.children[0].style.display = "block";
  document.querySelector("#evenbetter-settings-content")?.remove();
};

const checkForUpdates = async () => {
  return new Promise((resolve) => {
    resolve({
      status: "Checking for updates...",
    });
  })
    .then(() => {
      return fetch(settings.evenBetterVersionCheckUrl);
    })
    .then((response) => response.text())
    .then((data) => {
      const latestVersion = data.trim();
      if (latestVersion === settings.currentVersion) {
        return {
          status: "You are using the latest version! 🎉",
        };
      } else {
        return {
          status: `New EvenBetter version available: ${latestVersion}.`,
        };
      }
    })
    .catch(() => {
      return {
        status: "Failed to check for updates",
      };
    });
};

const loadTheme = (name) => {
  const theme = themes[name];
  if (!theme) return;

  Object.keys(theme).forEach((key) => {
    document.documentElement.style.setProperty(key, theme[key], "important");
  });
};

const setTabActive = (tab) => {
  if (tab.getAttribute("data-is-active") !== "true")
    tab.setAttribute("data-is-active", "true");

  const otherTabs = Array.from(
    document.querySelector(".c-settings__navigation .c-underline-nav").children
  ).filter((child) => child !== tab);
  otherTabs.forEach((tab) => tab.setAttribute("data-is-active", "false"));
};

const modifySettingsTab = () => {
  const settingsNavigation = document.querySelector(
    ".c-settings__navigation .c-underline-nav"
  );

  settingsNavigation.childNodes.forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelector(".c-settings__content").children[0].style.display =
        "block";
      setTabActive(tab);
    });
  });

  const firstElement = settingsNavigation.children[0];
  const newElement = firstElement.cloneNode(true);

  newElement.querySelector(".c-button__label").textContent =
    newElement.textContent.replace("General", "EvenBetter");
  newElement.setAttribute("data-is-active", "false");
  newElement.id = "evenbetter-settings-tab";

  newElement.addEventListener("click", () => {
    setTabActive(newElement);
  });

  settingsNavigation.appendChild(newElement);
};

const observeReplayInput = () => {
  if (!settings.ssrfInstanceFunctionality) return;

  const replayInput = document.querySelector(".c-replay-entry .cm-content");

  if (!replayInput) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const originalTextContent = mutation.target.textContent;

      if (originalTextContent.includes(settings.ssrfInstancePlaceholder)) {
        replaceSSRFInstanceText(mutation, originalTextContent);
      }
    });
  });

  const config = {
    characterData: true,
    subtree: true,
  };

  observer.observe(replayInput, config);

  function replaceSSRFInstanceText(mutation, originalTextContent) {
    const newTextContent = originalTextContent.replace(
      "$ssrfinstance",
      "$creating_instance"
    );
    mutation.target.textContent = newTextContent;

    fetch("https://api.cvssadvisor.com/ssrf/api/instance", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedText = newTextContent.replace(
          "$creating_instance",
          "https://" + data + ".c5.rs"
        );
        mutation.target.textContent = updatedText;

        window.open("https://ssrf.cvssadvisor.com/instance/" + data, "_blank");
      })
      .catch(() => {
        const updatedText = newTextContent.replace(
          "$creating_instance",
          "$creating_instance_failed"
        );
        mutation.target.textContent = updatedText;
      });
  }
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

const defaultSettings = () => {
  localStorage.setItem("evenbetter_colorize-http-rows", "true");
  localStorage.setItem("evenbetter_sidebar-hide-groups", "true");
  localStorage.setItem("evenbetter_sidebar-rearrange-groups", "true");
  localStorage.setItem("evenbetter_ssrf-instance-functionality", "true");

  localStorage.setItem("evenbetter_colorize-parameter-name", "_color");
  localStorage.setItem("evenbetter_ssrf-instance-placeholder", "$ssrfinstance");

  settings.colorizeHttpRows = true;
  settings.sidebarHideGroups = true;
  settings.sidebarRearrangeGroups = true;
  settings.ssrfInstanceFunctionality = true;
  settings.colorizeParameterName = "_color";
  settings.ssrfInstancePlaceholder = "$ssrfinstance";
};

const onSidebarContentLoaded = () => {
  cleanUp();
  loadTheme(localStorage.getItem("evenbetter_theme") || "evendarker");

  if (localStorage.getItem("firstTime") === null) {
    localStorage.setItem("firstTime", "false");
    defaultSettings();
  }

  addMoveButtonsToSidebar();
  addGroupHideFunctionality();
  detectOpenedTab();
  observeSidebarCollapse();

  restoreSidebarGroupPositions();
  restoreSidebarGroupCollapsedStates();

  const currentTab =
    document.querySelector(".c-content")?.children[0]?.classList[0];

  if (currentTab) onTabOpened(currentTab);

  if (currentTab === "c-settings") {
    adjustSettingsTab();
  }
};

// Fix UI issue where after refresh, caido shows wrong selected settings tab
const adjustSettingsTab = () => {
  const settingsTab = document.querySelector(".c-settings__content")
    ?.children[0]?.classList[0];

  const navigationTab =
    settingsTab.charAt(2).toUpperCase() + settingsTab.slice(3);

  const tabs = document.querySelectorAll(
    ".c-settings__navigation .c-underline-nav-item"
  );
  tabs.forEach((tab) => {
    if (tab.textContent === navigationTab) {
      setTabActive(tab);
      onSettingsTabOpened(navigationTab);
    }
  });
};

// Wait for sidebar to load, then run onSidebarContentLoaded
const interval = setInterval(() => {
  const sidebar = document.querySelector(".c-sidebar__body");
  if (sidebar) {
    clearInterval(interval);
    onSidebarContentLoaded();
  }
}, 100);

const cleanUp = () => {
  if (httpHistoryObserver) {
    httpHistoryObserver.disconnect();
    httpHistoryObserver = null;
    console.log("HTTP observer removed");
  }

  if (tabObserver) {
    tabObserver.disconnect();
    tabObserver = null;
    console.log("Tab observer removed");
  }

  if (settingsObserver) {
    settingsObserver.disconnect();
    settingsObserver = null;
    console.log("Settings observer removed");
  }

  const updateStatus = document.querySelector("#evenbetter-update-status");
  if (updateStatus) {
    updateStatus.remove();
    console.log("Update status removed");
  }

  const settingsContent = document.querySelector(
    "#evenbetter-settings-content"
  );
  if (settingsContent) {
    settingsContent.remove();
    console.log("Settings content removed");
  }

  const settingsTab = document.querySelector("#evenbetter-settings-tab");
  if (settingsTab) {
    settingsTab.remove();
    console.log("Settings tab removed");
  }
};
