import * as customTabs from "./extensions/customTabs";
import { quickSSRFFunctionality } from "./extensions/quickSSRFInstance";
import { onScopeTabOpen } from "./extensions/shareScope";
import { sidebarTweaks } from "./extensions/sidebarTweaks";
import { CURRENT_VERSION } from "./settings/constants";
import log from "./utils/Logger";
import { quickMatchAndReplace } from "./extensions/quickMAR";
import { quickDecode } from "./extensions/quickDecode";
import { dropdownTweaks } from "./extensions/dropdownTweaks";
import { getSetting } from "./settings";
import { loadTheme } from "./appearance/themes";
import { loadFont } from "./appearance/fonts";
import { customLibraryTab } from "./extensions/customTabs/ebLibrary/library";
import { OnSSRFHit } from "./events/onSSRFHit";
import { extendedCommands } from "./extensions/extendedCommands";
import { deleteAllFindings } from "./extensions/clearAllFindings";
import { setupSuggestAICommand } from "./extensions/suggestQuery";
import { OnSSRFInstanceChange } from "./events/onSSRFInstanceChange";
import { dropAllButtonFeature } from "./extensions/dropAllBtn";
import { collectionsShare } from "./extensions/shareCollections";
import { showResponse } from "./extensions/showResponse";
import { numbersPayload } from "./extensions/numbersPayload";
import { getCaidoAPI, setCaidoAPI } from "./utils/caidoapi";
import type { Caido } from "@caido/sdk-frontend";
import "./style.css";
import { onMARTabOpen } from "./extensions/shareMAR";
import { EvenBetterAPI } from "@bebiks/evenbetter-api";
import { setEvenBetterAPI } from "./utils/evenbetterapi";
import { excludeHostPathFunctionality } from "./extensions/excludeHostPath";

export const init = (caido: Caido) => {
  setCaidoAPI(caido);
  log.info(`EvenBetter ${CURRENT_VERSION} is loading, thanks for using it! 🎉`);

  const evenBetterAPI = new EvenBetterAPI(caido, {
    manifestID: "evenbetter-extensions",
    name: "EvenBetter: Extensions",
  });

  setEvenBetterAPI(evenBetterAPI);

  customTabs.setup();

  const onSSRFHit = new OnSSRFHit();
  const onSSRFInstanceChange = new OnSSRFInstanceChange();
  evenBetterAPI.eventManager.registerEvent("onSSRFHit", onSSRFHit);
  evenBetterAPI.eventManager.registerEvent(
    "onSSRFInstanceChange",
    onSSRFInstanceChange
  );

  getCaidoAPI().commands.register("evenbetter:suggesthttpql", {
    name: "Suggest HTTPQL query",
    group: "EvenBetter: AI",
    run: () => {},
  });

  getCaidoAPI().commandPalette.register("evenbetter:suggesthttpql");

  setupSuggestAICommand();

  evenBetterAPI.eventManager.on("onPageOpen", () => {
    localStorage.setItem("previousPath", window.location.hash);

    const activeTab = document.querySelector(
      ".c-sidebar-item[data-is-active='true']"
    );
    if (activeTab) {
      let countElement = activeTab.querySelector(".c-sidebar-item__count");
      if (countElement) countElement.innerHTML = "";
    }
  });

  evenBetterAPI.eventManager.on("onSettingsTabOpen", (data: string) => {
    switch (data) {
      case "developer":
        const jsSaveButton = document.querySelector(".c-custom-js__footer");
        if (!jsSaveButton) return;

        jsSaveButton.removeEventListener("click", reloadPage);
        jsSaveButton.addEventListener("click", reloadPage);
    }
  });

  evenBetterAPI.eventManager.on("onCaidoLoad", () => {
    loadTheme(getSetting("theme"));
    loadFont(getSetting("font"));

    deleteAllFindings();
    customLibraryTab();
    quickSSRFFunctionality();
    onScopeTabOpen();
    onMARTabOpen();
    extendedCommands();
    quickDecode();
    dropdownTweaks();
    dropAllButtonFeature();
    collectionsShare();
    showResponse();
    numbersPayload();
    sidebarTweaks();
    excludeHostPathFunctionality();

    quickMatchAndReplace();
    setTimeout(
      () => {
        const path = window.location.hash;
        document.querySelector(".c-content")?.setAttribute("data-page", path);

        evenBetterAPI.eventManager.triggerEvent("onPageOpen", {
          newUrl: path,
          oldUrl: "",
        });
      },
      window.location.hash.startsWith("#/settings/") ? 10 : 100
    );
  });
};

const reloadPage = () => {
  setTimeout(() => {
    location.reload();
  }, 250);
};
