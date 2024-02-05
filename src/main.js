const { themes, loadTheme } = require("./themes/themes");
const {
  addMoveButtonsToSidebar,
  restoreSidebarGroupPositions,
} = require("./sidebar/rearrange");
const { getSetting, checkForUpdates } = require("./settings/settings");
const {
  addGroupHideFunctionality,
  restoreSidebarGroupCollapsedStates,
} = require("./sidebar/hide");
const { evenBetterTab } = require("./settings/tabs/evenBetter");
const { replaceSSRFInstanceText } = require("./ssrftool/ssrfinstance");
const {
  observeHTTPRequests,
  colorizeHttpHistory,
} = require("./colorizehttp/colorizehttp");
const { onScopeTabOpened } = require("./scope/scope");

// This is a hacky way to detect when a new tab is opened
let sidebarTabObserver;
const detectOpenedTab = () => {
  if (sidebarTabObserver) {
    sidebarTabObserver.disconnect();
    sidebarTabObserver = null;
  }

  const requestTable = document.querySelector(".c-content");
  sidebarTabObserver = new MutationObserver((mutations) => {
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

  sidebarTabObserver.observe(requestTable, config);
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

    case "c-scope":
      setTimeout(() => {
        onScopeTabOpened()
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

  switch (tabName) {
    case "Developer":
      setTimeout(() => {
        const jsSaveButton = document.querySelector(".c-custom-js__footer");
        jsSaveButton.addEventListener("click", () => {
          setTimeout(() => {
            location.reload();
          }, 300);
        });
      }, 50);
      break;

    case "EvenBetter":
      settingsContent.children[0].style.display = "none";
      settingsContent.appendChild(evenBetterTab());
      return;

    default:
      break;
  }

  document
    .querySelector("#evenbetter-settings-tab")
    ?.setAttribute("data-is-active", "false");
  settingsContent.children[0].style.display = "block";
  document.querySelector("#evenbetter-settings-content")?.remove();
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

// This function observers input in the request body within the replay tab
let replayInputObserver;
const observeReplayInput = () => {
  if (getSetting("ssrfInstanceFunctionality") !== "true") return;

  const replayInput = document.querySelector(".c-replay-entry .cm-content");
  if (!replayInput) return;

  if (replayInputObserver) {
    replayInputObserver.disconnect();
    replayInputObserver = null;
  }

  replayInputObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const originalTextContent = mutation.target.textContent;

      if (originalTextContent.includes(getSetting("ssrfInstancePlaceholder"))) {
        replaceSSRFInstanceText(mutation, originalTextContent);
      }
    });
  });

  const config = {
    characterData: true,
    subtree: true,
  };

  replayInputObserver.observe(replayInput, config);
};

// Init sidebar collapse observer
let sidebarCollapseObserver;
const observeSidebarCollapse = () => {
  if (sidebarCollapseObserver) {
    sidebarCollapseObserver.disconnect();
    sidebarCollapseObserver = null;
  }

  sidebarCollapseObserver = new MutationObserver((mutations) => {
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
  sidebarCollapseObserver.observe(
    document.querySelector(".c-sidebar__toggle"),
    config
  );
};

// This function is called when the sidebar is collapsed or expanded
const onSidebarCollapsed = (isCollapsed) => {
  if (!isCollapsed) {
    addMoveButtonsToSidebar();
    addGroupHideFunctionality();

    restoreSidebarGroupPositions();
    restoreSidebarGroupCollapsedStates();
  }
};

// This function is called when Caido is fully loaded
const onSidebarContentLoaded = () => {
  cleanUp();
  loadTheme(getSetting("theme"));

  // Sidebar functionalities
  addMoveButtonsToSidebar();
  addGroupHideFunctionality();

  // Listeners
  detectOpenedTab();
  observeSidebarCollapse();

  // Restore states
  restoreSidebarGroupPositions();
  restoreSidebarGroupCollapsedStates();

  // Check for updates
  checkForUpdates().then((message) => {
    if (message.includes("New EvenBetter version available")) {
      const updateStatus = document.createElement("div");
      updateStatus.id = "evenbetter-update-status";
      updateStatus.textContent = "[EvenBetter] Update available!";
      updateStatus.style.color = "gray";
      document.querySelector(".c-global-actions").prepend(updateStatus);
    }
  });

  // Run onTabOpened on current tab
  const currentTab =
    document.querySelector(".c-content")?.children[0]?.classList[0];

  if (currentTab) onTabOpened(currentTab);

  // Fix UI issues in settings tab
  if (currentTab === "c-settings") {
    fixSettingsTab();
  }
};

// Fix UI issue where after refresh, caido shows wrong selected settings tab
const fixSettingsTab = () => {
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
