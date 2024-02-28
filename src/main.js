const { loadTheme } = require("./themes");
const {
  addMoveButtonsToSidebar,
  restoreSidebarGroupPositions,
} = require("./features/sidebarTweaks/rearrange");
const { getSetting, checkForUpdates } = require("./settings");
const {
  addGroupHideFunctionality,
  restoreSidebarGroupCollapsedStates,
} = require("./features/sidebarTweaks/hide");
const {
  evenBetterTab,
} = require("./features/customSettingsTab/evenBetterSettings");
const { replaceSSRFInstanceText } = require("./features/quickSSRFInstance");
const {
  observeHTTPRequests,
  colorizeHttpHistory,
} = require("./features/colorizeHTTP");
const { onScopeTabOpen } = require("./features/shareScope");
const { openModal } = require("./modal");
const { listenForRightClick } = require("./features/colorizeHTTP/manual");
const { debug, info } = require("./logging");

const detectOpenedTab = () => {
  navigation.addEventListener("navigate", (event) => {
    if (event.navigationType == "push") {
      const path = new URL(event.destination.url).hash;
      onTabOpen(path);
    }
  });
};

const onTabOpen = (path) => {
  debug("Tab opened:", path);

  switch (true) {
    case path.startsWith("#/settings/"):
      setTimeout(() => {
        const tabOpened = path.split("/")[2];
        onSettingsTabOpen(tabOpened);

        newSettingsTab("EvenBetter");
      }, 10);
      break;

    case path === "#/intercept" &&
      getSetting("highlightRowsFunctionality") === "true":
      setTimeout(() => {
        colorizeHttpHistory();
        observeHTTPRequests();
        listenForRightClick();
      }, 200);
      break;

    case path === "#/replay":
      setTimeout(() => {
        observeReplayInput();
      }, 25);
      break;

    case path === "#/scope":
      setTimeout(onScopeTabOpen, 10);
      break;

    default:
      break;
  }
};

const getSettingsTabElement = (tabName) => {
  const settingsTabs = document.querySelectorAll(
    ".c-settings__navigation .c-underline-nav .c-button"
  );
  return Array.from(settingsTabs)
    .find((tab) => tab.textContent.toLowerCase() === tabName)
    .closest(".c-underline-nav-item");
};

const onSettingsTabOpen = (tabName) => {
  debug("Settings tab opened: ", tabName);

  const settingsTab = getSettingsTabElement(tabName);
  setTabActive(settingsTab);

  const settingsContent = document.querySelector(".c-settings__content");

  switch (tabName) {
    case "developer":
      setTimeout(() => {
        const jsSaveButton = document.querySelector(".c-custom-js__footer");
        jsSaveButton.addEventListener("click", () => {
          setTimeout(() => {
            location.reload();
          }, 300);
        });
      }, 50);
      break;

    case "evenbetter":
      // hide the current content, we cant remove it because it will break caido :(
      settingsContent.children[0].style.display = "none";

      // remove old even better tab
      if (document.querySelector("#evenbetter-settings-content"))
        document.querySelector("#evenbetter-settings-content").remove();

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
  if (tab.getAttribute("data-is-active") != "true")
    tab.setAttribute("data-is-active", "true");

  const otherTabs = Array.from(
    document.querySelector(".c-settings__navigation .c-underline-nav").children
  ).filter((child) => child !== tab);

  otherTabs.forEach((tab) => tab.setAttribute("data-is-active", "false"));
};

const newSettingsTab = (name) => {
  const settingsNavigation = document.querySelector(
    ".c-settings__navigation .c-underline-nav"
  );

  const existingTab = document.querySelector(
    `#${name.toLowerCase()}-settings-tab`
  );
  if (existingTab) existingTab.remove();

  const firstElement = settingsNavigation.children[0];
  const newSettingsTab = firstElement.cloneNode(true);

  newSettingsTab.querySelector(".c-button__label").textContent =
    newSettingsTab.textContent.replace("General", name);
  newSettingsTab.setAttribute("data-is-active", "false");
  newSettingsTab.id = name.toLowerCase() + "-settings-tab";

  newSettingsTab.addEventListener("click", () => {
    const currentPath = new URL(location.href).hash.split("/")[2];
    const currentTab = getSettingsTabElement(currentPath);

    // add on click only one time
    currentTab.addEventListener("click", () => {
      setTabActive(currentTab);
      onSettingsTabOpen(currentPath);

      currentTab.removeEventListener("click", () => {});
    });

    setTabActive(newSettingsTab);
    onSettingsTabOpen(name.toLowerCase());
  });

  settingsNavigation.appendChild(newSettingsTab);
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
  info(
    `EvenBetter v${getSetting(
      "currentVersion"
    )} is loading, thanks for using it! 🎉`
  );

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
  if (getSetting("showOutdatedVersionWarning") === "true") {
    checkForUpdates().then(({ isLatest, message }) => {
      if (!isLatest) {
        openModal(
          "Update available!",
          "You are using an outdated version of EvenBetter. Please update to the latest version at https://github.com/bebiksior/EvenBetter. This popup can be disabled in the EvenBetter settings."
        );
      }
    });
  }

  const currentTab = new URL(location.href).hash;
  if (currentTab) setTimeout(() => onTabOpen(currentTab, 100));
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
    debug("Update status removed");
  }

  const settingsContent = document.querySelector(
    "#evenbetter-settings-content"
  );
  if (settingsContent) {
    settingsContent.remove();
    debug("Settings content removed");
  }

  const settingsTab = document.querySelector("#evenbetter-settings-tab");
  if (settingsTab) {
    settingsTab.remove();
    debug("Settings tab removed");
  }
};
