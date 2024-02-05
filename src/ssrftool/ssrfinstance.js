const { getSetting } = require("../settings/settings");

const SSRF_INSTANCE_API_URL = "https://api.cvssadvisor.com/ssrf/api/instance",
  SSRF_INSTANCE_URL = "https://ssrf.cvssadvisor.com/instance/";

export const replaceSSRFInstanceText = (mutation, originalTextContent) => {
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
