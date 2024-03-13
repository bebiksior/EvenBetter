import eventManagerInstance from "../../events/EventManager";
import { PageOpenEvent } from "../../events/onPageOpen";
import { getSetting, setSetting } from "../../settings";

const SSRF_INSTANCE_API_URL = "https://api.cvssadvisor.com/ssrf/api/instance",
  SSRF_INSTANCE_URL = "https://ssrf.cvssadvisor.com/instance/",
  SSRF_TOOL_URL = "https://ssrf.cvssadvisor.com/";

declare const Caido: any;

export const quickSSRFFunctionality = () => {
  eventManagerInstance.on("onPageOpen", (data: PageOpenEvent) => {
    if (
      data.newUrl == "#/replay" &&
      getSetting("ssrfInstanceFunctionality") === "true"
    ) {
      setTimeout(() => observeReplayInput(), 1000);
    }
  });

  /*const ssrfPageContent = quickSSRFPage();
  Caido.navigation.addPage("/evenbetter/quick-ssrf", {
    body: ssrfPageContent
  })

  Caido.sidebar.registerItem("Quick SSRF", "/evenbetter/quick-ssrf", {
    icon: "fas fa-compass",
    group: "EvenBetter"
  });*/
};

let replayInputObserver: MutationObserver | null = null;
const observeReplayInput = () => {
  const replayInput = document.querySelector(".c-replay-entry .cm-content");
  if (!replayInput) return;

  if (replayInputObserver) {
    replayInputObserver.disconnect();
    replayInputObserver = null;
  }

  const ssrfInstancePlaceholder = getSetting("ssrfInstancePlaceholder");

  replayInputObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const originalTextContent = mutation.target.textContent;

      if (originalTextContent.includes(ssrfInstancePlaceholder)) {
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

const replaceSSRFInstanceText = (
  mutation: MutationRecord,
  originalTextContent: string
) => {
  const newTextContent = originalTextContent.replace(
    getSetting("ssrfInstancePlaceholder"),
    "$creating_instance"
  );
  mutation.target.textContent = newTextContent;

  fetch(SSRF_INSTANCE_API_URL, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      const updatedText = newTextContent.replace(
        "$creating_instance",
        "https://" + data + ".c5.rs"
      );
      mutation.target.textContent = updatedText;

      window.open(SSRF_INSTANCE_URL + data, "_blank");
    })
    .catch(() => {
      const updatedText = newTextContent.replace(
        "$creating_instance",
        "$creating_instance_failed"
      );
      mutation.target.textContent = updatedText;
    });
};
