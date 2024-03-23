import eventManagerInstance, { Event } from "./events/EventManager";
import { onCaidoLoad } from "./events/onCaidoLoad";
import { onPageOpen } from "./events/onPageOpen";
import { onSettingsTabOpen } from "./events/onSettingsTabOpen";
import * as customSettingsTabs from "./extensions/customSettingsTabs";
import { quickSSRFFunctionality } from "./extensions/quickSSRFInstance";
import { onScopeTabOpen } from "./extensions/shareScope";
import { sidebarTweaks } from "./extensions/sidebarTweaks";
import { CURRENT_VERSION } from "./settings/constants";
import log from "./utils/Logger";
import { openModal } from "./utils/Modal";
import { onContextMenuOpen } from "./events/onContextMenuOpen";
import { quickMatchAndReplace } from "./extensions/qucikMAR";
import { quickDecode } from "./extensions/quickDecode";
import { dropdownTweaks } from "./extensions/dropdownTweaks";
import { register } from "./extensions/quickSSRFInstance/interactsh";

declare const Caido: any;

const init = () => {
  log.info(`EvenBetter ${CURRENT_VERSION} is loading, thanks for using it! 🎉`);

  eventManagerInstance.registerEvent("onCaidoLoad", onCaidoLoad);
  eventManagerInstance.registerEvent("onSettingsTabOpen", onSettingsTabOpen);
  eventManagerInstance.registerEvent("onPageOpen", onPageOpen);
  eventManagerInstance.registerEvent("onContextMenuOpen", onContextMenuOpen);

  customSettingsTabs.setup();

  eventManagerInstance.on("onCaidoLoad", (event: Event) => {
    quickSSRFFunctionality();
    onScopeTabOpen();
    sidebarTweaks();
    quickDecode();
    dropdownTweaks();
    setTimeout(() => quickMatchAndReplace(), 500);
    setTimeout(() => {
      let newUrl = window.location.hash;
      if (newUrl.includes("?custom-path=")) {
        newUrl = newUrl.split("?custom-path=")[1];
      }

      eventManagerInstance.triggerEvent("onPageOpen", {
        newUrl: newUrl,
        oldUrl: "",
      });
    }, (window.location.hash.startsWith("#/settings/") ? 50 : 400));

    const cssVersion = getComputedStyle(document.documentElement)
      .getPropertyValue("--evenbetter-css-version")
      .replace(/['"]+/g, "")
      .trim();

    if (cssVersion !== CURRENT_VERSION) {
      openModal({
        title: "Incompatible CSS version",
        content: `EvenBetter Custom CSS is not compatible with the current JS version of EvenBetter. Please update the EvenBetter CSS to the latest version.`,
      });
    }
  });

  eventManagerInstance.initEvents();
};

init();
