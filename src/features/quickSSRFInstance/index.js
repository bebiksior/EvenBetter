const { getSetting } = require("../../settings");

const SSRF_INSTANCE_API_URL = "https://api.cvssadvisor.com/ssrf/api/instance",
  SSRF_INSTANCE_URL = "https://ssrf.cvssadvisor.com/instance/";

export const quickSSRFFunctionality = () => {
  observeReplayInput()
};

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

const replaceSSRFInstanceText = (mutation, originalTextContent) => {
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

      // This doesn't work on MacOS :/
      window.open(SSRF_INSTANCE_URL + data);
    })
    .catch(() => {
      const updatedText = newTextContent.replace(
        "$creating_instance",
        "$creating_instance_failed"
      );
      mutation.target.textContent = updatedText;
    });
};
