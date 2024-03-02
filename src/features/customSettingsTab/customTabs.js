const { debug } = require("../../logging");

const customTabs = [];

const createCustomTab = (name, id, tabContentElement, icon) => {
  customTabs.push({
    name,
    id,
    tabContentElement,
    icon
  });
};

const getCustomTabs = () => {
  return customTabs;
};

const onSettingsTabOpen = (tabName) => {
  debug("Settings tab opened: ", tabName);

  customTabs.forEach((customTab) => {
    newSettingsTab(customTab);
  });

  const settingsTab = getSettingsNavigationTab(tabName);
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
    default:
      break;
  }

  // iterate custom tabs
  for (let i = 0; i < customTabs.length; i++) {
    const customTab = customTabs[i];
    if (tabName === customTab.id) {
      // hide the current content, we cant remove it because it will break caido :(
      settingsContent.children[0].style.display = "none";

      // remove old tabs
      document
        .querySelectorAll(".evenbetter-custom-tab-content")
        .forEach((tab) => {
          tab.remove();
        });

      customTab.tabContentElement.classList.add(
        "evenbetter-custom-tab-content"
      );
      settingsContent.appendChild(customTab.tabContentElement);

      return;
    }
  }

  document
    .querySelectorAll(".evenbetter-custom-navigation-tab")
    .forEach((tab) => {
      tab.setAttribute("data-is-active", "false");
    });
  settingsContent.children[0].style.display = "block";
  document.querySelectorAll(".evenbetter-custom-tab-content").forEach((tab) => {
    tab.remove();
  });
};

const getSettingsNavigationTab = (tabName) => {
  const settingsTabs = document.querySelectorAll(
    ".c-settings__navigation .c-underline-nav .c-button"
  );
  const navigationTab = Array.from(settingsTabs)
    .find((tab) => tab.textContent.toLowerCase() === tabName)
    ?.closest(".c-underline-nav-item");

  // If the tab is not found, it might be a custom tab
  if (!navigationTab) {
    const customTab = document.querySelector("#" + tabName);
    if (customTab) return customTab;

    debug("Tab not found: ", tabName);
  }

  return navigationTab;
};

const setTabActive = (tab) => {
  if (tab.getAttribute("data-is-active") != "true")
    tab.setAttribute("data-is-active", "true");

  const otherTabs = Array.from(
    document.querySelector(".c-settings__navigation .c-underline-nav").children
  ).filter((child) => child !== tab);

  otherTabs.forEach((tab) => tab.setAttribute("data-is-active", "false"));
};

// This function creates a new navigation item
const newSettingsTab = (customTab) => {
  const settingsNavigation = document.querySelector(
    ".c-settings__navigation .c-underline-nav"
  );

  // Remove the tab if it already exists
  const existingTab = document.querySelector(`#${customTab.id}`);
  if (existingTab) existingTab.remove();

  const firstElement = settingsNavigation.children[0];
  const newSettingsTab = firstElement.cloneNode(true);

  newSettingsTab.querySelector(".c-button__label").textContent =
    newSettingsTab.textContent.replace("General", customTab.name);

  if (customTab.icon) {
    const icon = document.createElement("div");
    icon.innerHTML = customTab.icon;
    newSettingsTab.querySelector(".c-button__label").prepend(icon);
  }
  
  newSettingsTab.setAttribute("data-is-active", "false");
  newSettingsTab.id = customTab.id;
  newSettingsTab.classList.add("evenbetter-custom-navigation-tab");

  newSettingsTab.addEventListener("click", () => {
    const currentPath = new URL(location.href).hash.split("/")[2];
    const currentTab = getSettingsNavigationTab(currentPath);

    currentTab.childNodes[0].addEventListener("click", () => {
      setTabActive(currentTab);
      onSettingsTabOpen(currentPath);

      currentTab.removeEventListener("click", () => {});
    });

    setTabActive(newSettingsTab);
    onSettingsTabOpen(customTab.id);
  });

  settingsNavigation.appendChild(newSettingsTab);
};

module.exports = {
  createCustomTab,
  getCustomTabs,
  onSettingsTabOpen,
};
