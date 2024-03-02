const { quickSSRFFunctionality } = require("../features/quickSSRFInstance");
const {
  colorizeHttpHistory,
  observeHTTPRequests,
} = require("../features/colorizeHTTPHistory");
const {
  listenForRightClick,
} = require("../features/colorizeHTTPHistory/manual");
const { getSetting } = require("../settings");
const { onScopeTabOpen } = require("../features/shareScope");
const { debug } = require("../logging");
const {
  onSettingsTabOpen,
} = require("../features/customSettingsTab/customTabs");

export const onTabOpen = (path) => {
  debug("Tab opened: " + path);

  switch (true) {
    case path.startsWith("#/settings/"):
      setTimeout(() => {
        const tabOpened = path.split("/")[2];
        onSettingsTabOpen(tabOpened);
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
      setTimeout(() => quickSSRFFunctionality(), 25);
      break;

    case path === "#/scope":
      setTimeout(onScopeTabOpen, 10);
      break;

    case path === "#/workflows":
      document.querySelectorAll(".c-sidebar-item__content").forEach((element) => {
        if (element.textContent != "Workflows") return;

        let countElement = element.parentNode.querySelector(".c-sidebar-item__count");
        countElement.innerHTML = "";
      });
      break;

    default:
      break;
  }
};
