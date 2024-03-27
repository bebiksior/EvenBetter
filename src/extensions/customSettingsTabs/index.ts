import eventManagerInstance from "../../events/EventManager";
import { OnPageOpen, PageOpenEvent } from "../../events/onPageOpen";
import log from "../../utils/Logger";
import { evenBetterSettingsTab } from "./pages/evenbetter";
import { evenBetterLibraryTab } from "./pages/library";

interface SettingsTab {
  name: string;
  icon: string;
  id: string;
  content: HTMLElement;
}

export const setup = () => {
  eventManagerInstance.on("onSettingsTabOpen", (data: string) => {
    adjustActiveTab(data);
  });

  eventManagerInstance.on("onPageOpen", (data: PageOpenEvent) => {
    if (
      data.newUrl.startsWith("#/settings/") &&
      !data.oldUrl.startsWith("#/settings/")
    ) {
      init();
    }
  });

  customSettingsTabs = [
    {
      name: "EvenBetter",
      icon: '<i class="c-icon fas fa-bug"></i>',
      id: "evenbetter",
      content: evenBetterSettingsTab(),
    },
    {
      name: "Library",
      icon: '<i class="c-icon fas fa-book"></i>',
      id: "library",
      content: evenBetterLibraryTab(),
    },
  ];
};

const init = () => {
  renderCustomTabs();

  grabNavigationItems().forEach((navItem) => {
    navItem.addEventListener("click", () => {
      setTabActive(navItem as HTMLElement);

      if (navItem.getAttribute("data-is-custom") !== "true") {
        const content = document.querySelector(
          ".c-settings__content"
        ) as HTMLElement;
        if (!content) {
          log.error("Couldn't find settings tab content, aborting...");
          return;
        }

        document.getElementById("custom-tab-content")?.remove();
        const tabContent = content.children[0] as HTMLElement;
        tabContent.style.display = "block";
      }
    });
  });

  const customPath = window.location.hash.split("?custom-path=")[1];
  if (customPath) {
    const settingsTab = customPath.split("/")[2];
    openCustomTab(getCustomSettingsTab(settingsTab));
  }
};

export const addCustomSettingsTab = (tab: SettingsTab) => {
  const tabExists = customSettingsTabs.some((t) => t.id === tab.id);
  if (tabExists) {
    log.warn(
      `Tab with id ${tab.id} already exists, skipping 'addCustomSettingsTab'...`
    );
    return;
  }

  customSettingsTabs.push(tab);
};

const grabNavigationItems = () => {
  const settingsTabs = document.querySelectorAll(
    ".c-settings .p-menubar-root-list .p-menuitem"
  );
  return settingsTabs;
};

const getNavItemData: (navItem: Element) => SettingsTab = (
  navItem: Element
) => {
  const name = navItem.querySelector(".p-menuitem-link span")?.textContent;
  const id = name?.toLowerCase();
  const icon = navItem.querySelector(".p-menuitem-link i")?.outerHTML;

  if (name && id && icon) {
    return {
      name,
      id,
      icon,
      content: document.createElement("div"),
    };
  }

  log.error("Couldn't get navitemdata");
  return null;
};

const getNavigationItem = (name: string): Element | null => {
  const settingsTabs = Array.from(
    document.querySelectorAll(".c-settings .p-menubar-root-list .p-menuitem")
  );

  const foundTab = settingsTabs.find((tab) => {
    const tabName = (
      tab.querySelector(".p-menuitem-link") as HTMLElement
    )?.textContent?.trim();
    return tabName && tabName.toLowerCase() === name.toLowerCase();
  });

  return foundTab || null;
};

export const renderCustomTabs = () => {
  const settingsNavigation = document.querySelector(
    ".c-settings .p-menubar-root-list"
  );
  if (!settingsNavigation) {
    log.error("Couldn't find settings navigation, aborting...");
    return;
  }

  const tabTemplate = settingsNavigation.querySelector(".p-menuitem");
  customSettingsTabs.forEach((tab) => {
    if (document.getElementById(tab.id)) return;

    const newTab = tabTemplate?.cloneNode(true) as HTMLElement;
    newTab.setAttribute("data-p-focused", "false");
    newTab.querySelector(".c-settings__item").setAttribute("data-is-active", "false");
    newTab.setAttribute("data-is-custom", "true");
    newTab.id = tab.id;

    newTab.addEventListener("mouseenter", () => {
      grabNavigationItems().forEach((navItem) => {
        navItem.classList.remove("p-focus");
      });
      
      newTab.classList.add("p-focus");
    });

    newTab.addEventListener("mouseleave", () => {
      newTab.classList.remove("p-focus");
    });

    const menuLink = newTab.querySelector(".p-menuitem-link") as HTMLElement;

    const newTabData = getNavItemData(newTab);
    if (newTabData) {
      newTabData.name = tab.name;
      newTabData.id = tab.id;
      newTabData.icon = tab.icon;
      newTabData.content = tab.content;

      menuLink.querySelector("i").outerHTML = tab.icon;
      menuLink.querySelector("span").textContent = tab.name;
      menuLink.removeAttribute("href");

      newTab.addEventListener("click", () => openCustomTab(tab));

      settingsNavigation.appendChild(newTab);
    }
  });
};

const openCustomTab = (tab: SettingsTab) => {
  const previousTab = window.location.hash.split("/")[2].split("?")[0];
  const content = document.querySelector(".c-settings__content") as HTMLElement;
  if (!content) {
    log.error("Couldn't find settings tab content, aborting...");
    return;
  }

  if (document.getElementById(`.${tab.id}`)) {
    return;
  }

  document.getElementById("custom-tab-content")?.remove();

  tab.content.id = "custom-tab-content";
  tab.content.classList.add(tab.id);
  content.appendChild(tab.content);

  const tabContent = content.children[0] as HTMLElement;
  tabContent.style.display = "none";
  window.location.hash =
    window.location.hash.split("?")[0] + `?custom-path=#/settings/${tab.id}`;

  adjustActiveTab(tab.id);

  getNavigationItem(previousTab)?.addEventListener("click", () => {
    window.location.hash = window.location.hash.split("?")[0];
  });
};

// Sometimes, caido doesn't show the correct active tab, so we need to adjust it :D
const adjustActiveTab = (openedSettingsTab: string) => {
  grabNavigationItems().forEach((navItem) => {
    navItem.setAttribute("data-p-focused", "false");
    navItem.querySelector(".c-settings__item").setAttribute("data-is-active", "false");

    const navItemData = getNavItemData(navItem);
    if (navItemData && navItemData.id === openedSettingsTab) {
      navItem.setAttribute("data-p-focused", "true");
      navItem.querySelector(".c-settings__item").setAttribute("data-is-active", "true");

      log.debug(`Adjusted active tab to ${openedSettingsTab}`);
    }
  });
};

// This function sets which nav item has this yellow underline that indicates active tab
export const setTabActive = (tabElement: HTMLElement) => {
  grabNavigationItems().forEach((navItem) => {
    navItem.setAttribute("data-p-focused", "false");
    tabElement.querySelector(".c-settings__item").setAttribute("data-is-active", "false");
  });

  tabElement.setAttribute("data-p-focused", "true");
  tabElement.querySelector(".c-settings__item").setAttribute("data-is-active", "true");
};

const getCustomSettingsTab = (id: string) => {
  return customSettingsTabs.find((tab) => tab.id === id);
};

let customSettingsTabs: SettingsTab[] = [];
export default customSettingsTabs;
