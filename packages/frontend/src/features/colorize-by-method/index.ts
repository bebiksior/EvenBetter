import { createFeature } from "@/features/manager";
import { CaidoSDK } from "@/types";
import { EvenBetterAPI } from "@bebiks/evenbetter-api";
import { PageOpenEvent } from "@bebiks/evenbetter-api/src/events/onPageOpen";
import "./style.css";

let abortController: AbortController | null = null;
let observer: MutationObserver | null = null;

function setTabMethodAttributes(caidoSDK: CaidoSDK) {
  const tabs = document.querySelectorAll(
    ".c-tab-list__body .c-tab-list__tab [data-session-id]",
  );

  const promises = Array.from(tabs).map(async (tab) => {
    const sessionId = tab.getAttribute("data-session-id");
    if (!sessionId) return;

    const method = await getHTTPMethod(sessionId, caidoSDK);
    tab.setAttribute("http-method", method);
  });

  Promise.all(promises).then(() => {
    setTimeout(() => {
      updateSelectedTabColor();
    }, 100);
  });
}

function updateCurrentTabHTTPMethod(newMethod: string) {
  const element = document.querySelector(
    ".c-tab-list__tab [data-is-selected=true][data-session-id]",
  );
  if (!element) return;

  element.setAttribute("http-method", newMethod);
}

function updateSelectedTabColor() {
  const httpMethod = document.querySelector(
    ".c-lang-http-request__method",
  )?.textContent;
  if (!httpMethod) return;

  updateCurrentTabHTTPMethod(httpMethod);
}

function liveUpdateHTTPMethod() {
  const controller = new AbortController();
  document.addEventListener(
    "keyup",
    () => {
      if (location.hash !== "#/replay") return;
      updateSelectedTabColor();
    },
    { signal: controller.signal },
  );
  return controller;
}

type HTTPMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "OPTIONS"
  | "PATCH"
  | "HEAD"
  | "TRACE"
  | "CONNECT"
  | "UNKNOWN";

async function getHTTPMethod(
  sessionId: string,
  caidoSDK: CaidoSDK,
): Promise<HTTPMethod> {
  const data = await caidoSDK.graphql.replayEntry({ id: sessionId });
  if (!data.replayEntry?.raw) return "UNKNOWN";

  const method = data.replayEntry.raw.split("\n")[0]?.split(" ")[0];
  return (method as HTTPMethod) || "UNKNOWN";
}

function handleTabListChanges(
  evenBetterAPI: EvenBetterAPI,
  caidoSDK: CaidoSDK,
) {
  setTabMethodAttributes(caidoSDK);

  const observer = new MutationObserver(() => {
    setTabMethodAttributes(caidoSDK);
  });

  const tabList = document.querySelector(".c-tab-list__body");
  if (tabList) {
    observer.observe(tabList, {
      childList: true,
    });
  }

  return observer;
}

const cleanup = () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  if (abortController) {
    abortController.abort();
    abortController = null;
  }
};

function setup(caidoSDK: CaidoSDK, evenBetterAPI: EvenBetterAPI) {
  cleanup();

  if (window.location.hash === "#/replay") {
    observer = handleTabListChanges(evenBetterAPI, caidoSDK);
  }
}

export const colorizeByMethod = createFeature("colorize-by-method", {
  onFlagEnabled: (caidoSDK, evenBetterAPI) => {
    setup(caidoSDK, evenBetterAPI);

    setTimeout(() => {
      abortController = liveUpdateHTTPMethod();
    }, 2000);

    evenBetterAPI.eventManager.on("onPageOpen", (data: PageOpenEvent) => {
      cleanup();

      if (data.newUrl === "#/replay") {
        observer = handleTabListChanges(evenBetterAPI, caidoSDK);
      }
    });

    evenBetterAPI.eventManager.on("onProjectChange", () => {
      let attempts = 0;
      const maxAttempts = 25;
      const interval = setInterval(() => {
        const tabList = document.querySelector(".c-tab-list__body");
        if (tabList) {
          setup(caidoSDK, evenBetterAPI);
          clearInterval(interval);
        }
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 200);
    });
  },
  onFlagDisabled: () => {
    cleanup();
  },
});
