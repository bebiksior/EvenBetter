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
const { openModal } = require("./modal");
const { debug, info } = require("./logging");
const { onTabOpen } = require("./events/tabOpen");
const { createCustomTab } = require("./features/customSettingsTab/customTabs");
const { evenBetterSettingsTab } = require("./features/customSettingsTab/evenBetterSettings");
const { evenBetterLibraryTab } = require("./features/customSettingsTab/evenBetterLibrary");

const detectOpenedTab = () => {
  navigation.addEventListener("navigate", (event) => {
    if (event.navigationType == "push") {
      const path = new URL(event.destination.url).hash;
      onTabOpen(path);
    }
  });
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

  // create custom tabs
  createCustomTab("EvenBetter", "evenbetter-settings", evenBetterSettingsTab(), `<div class="c-button__leading-icon"><i class="c-icon fas fa-bug"></i></div>`);
  createCustomTab("Library", "evenbetter-library", evenBetterLibraryTab(), `<div class="c-button__leading-icon"><i class="c-icon fas fa-book"></i></div>`);

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

  const customTabs = document.querySelectorAll(".evenbetter-custom-navigation-tab");
  customTabs.forEach((tab) => {
    tab.remove();
  });

  debug("Custom tabs removed");
};
