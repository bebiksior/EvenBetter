import * as customTabs from "./extensions/customTabs";
import { quickSSRFFunctionality } from "./extensions/quickSSRFInstance";
import { onScopeTabOpen } from "./extensions/shareScope";
import { sidebarTweaks } from "./extensions/sidebarTweaks";
import { CURRENT_VERSION } from "./settings/constants";
import log from "./utils/Logger";
import { quickMatchAndReplace } from "./extensions/qucikMAR";
import { quickDecode } from "./extensions/quickDecode";
import { dropdownTweaks } from "./extensions/dropdownTweaks";
import { getSetting } from "./settings";
import EvenBetterAPI from "@bebiks/evenbetter-api";
import { loadTheme } from "./appearance/themes";
import { Caido } from "@caido/sdk-frontend";
import { loadFont } from "./appearance/fonts";
import { customLibraryTab } from "./extensions/customTabs/ebLibrary/library";
import { OnSSRFHit } from "./extensions/events/onSSRFHit";
import { extendedCommands } from "./extensions/extendedCommands";
import { deleteAllFindings } from "./extensions/clearAllFindings";
import { setupSuggestAICommand } from "./extensions/suggestQuery";
import { OnSSRFInstanceChange } from "./extensions/events/onSSRFInstanceChange";
import { dropAllButtonFeature } from "./extensions/dropAllBtn";

const init = () => {
  log.info(`EvenBetter ${CURRENT_VERSION} is loading, thanks for using it! 🎉`);

  EvenBetterAPI.hotReloading();
  customTabs.setup();

  const onSSRFHit = new OnSSRFHit();
  const onSSRFInstanceChange = new OnSSRFInstanceChange();
  EvenBetterAPI.eventManager.registerEvent("onSSRFHit", onSSRFHit);
  EvenBetterAPI.eventManager.registerEvent("onSSRFInstanceChange", onSSRFInstanceChange);

  Caido.commands.register("evenbetter:suggesthttpql", {
    name: "Suggest HTTPQL query",
    group: "EvenBetter: AI",
    run: () => {},
  });

  Caido.commandPalette.register("evenbetter:suggesthttpql");

  setupSuggestAICommand();

  EvenBetterAPI.eventManager.on("onPageOpen", () => {
    localStorage.setItem("previousPath", window.location.hash);

    const activeTab = document.querySelector(
      ".c-sidebar-item[data-is-active='true']"
    );
    if (activeTab) {
      let countElement = activeTab.querySelector(".c-sidebar-item__count");
      if (countElement) countElement.innerHTML = "";
    }
  });

  EvenBetterAPI.eventManager.on("onSettingsTabOpen", (data: string) => {
    switch (data) {
      case "developer":
        const jsSaveButton = document.querySelector(".c-custom-js__footer");
        jsSaveButton.removeEventListener("click", reloadPage);
        jsSaveButton.addEventListener("click", reloadPage);
    }
  });

  EvenBetterAPI.eventManager.on("onCaidoLoad", () => {
    loadTheme(getSetting("theme"));
    loadFont(getSetting("font"));

    deleteAllFindings();
    customLibraryTab();
    quickSSRFFunctionality();
    onScopeTabOpen();
    extendedCommands();
    quickDecode();
    dropdownTweaks();
    dropAllButtonFeature();
    setTimeout(() => {
      sidebarTweaks();
    }, 100);

    quickMatchAndReplace()
    setTimeout(
      () => {
        let newUrl = window.location.hash;
        if (newUrl.includes("?custom-path=")) {
          newUrl = newUrl.split("?custom-path=")[1];
        }

        document.querySelector(".c-content")?.setAttribute("data-page", newUrl);

        EvenBetterAPI.eventManager.triggerEvent("onPageOpen", {
          newUrl: newUrl,
          oldUrl: "",
        });
      },
      window.location.hash.startsWith("#/settings/") ? 10 : 100
    );

    const cssVersion = getComputedStyle(document.documentElement)
      .getPropertyValue("--evenbetter-css-version")
      .replace(/['"]+/g, "")
      .trim();

    if (cssVersion !== CURRENT_VERSION) {
      EvenBetterAPI.modal.openModal({
        title: "Incompatible CSS version",
        content: `EvenBetter Custom CSS isn't compatible with the current JS version of EvenBetter. Please update the EvenBetter CSS to the latest version.`,
      });
    }
  });
};

const reloadPage = () => {
  setTimeout(() => {
    location.reload();
  }, 250);
};

init();