import EvenBetterAPI from "@bebiks/evenbetter-api";
import loadCSS from "@bebiks/evenbetter-api/src/css";
import settingsCSS from "./settings.css";
import { Caido } from "@caido/sdk-frontend";
import { customizeHTTPResponse, getCASSRFInstance } from "../providers/cvssadvisor";
import { navigationBar } from "../navigation/navigation";
import { ssrfInstance, SSRFInstanceType } from "../instance";

const isNumeric = (val: string) : boolean => {
  return !isNaN(Number(val));
}

const checkHeaderFormat = (str: string) => {
  const headerRegex = /^([A-Za-z-]+):([^:\s])/g;
  const matches = str.match(headerRegex);

  if (matches) {
    return matches.length === 0;
  } else {
    return true;
  }
};

export const settingsPage = () => {
  const pageContainer = document.createElement("div");
  pageContainer.className = "c-evenbetter_quick-ssrf";

  const pageContent = document.createElement("div");
  pageContent.className = "c-evenbetter_quick-ssrf__content";

  const navigation = navigationBar();
  pageContainer.appendChild(navigation);

  const settings = SettingsPageBody();
  pageContent.appendChild(settings);

  pageContainer.appendChild(pageContent);

  return pageContainer;
};

let settingsPageBody: HTMLElement;
const SettingsPageBody = () => {
  loadCSS({ id: "eb-quickssrf-settings", cssText: settingsCSS.toString() });

  const bodyContent = document.createElement("div");
  bodyContent.classList.add("eb-quickssrf__settings");
  bodyContent.innerHTML = `
    <div class="eb-quickssrf__settings-header">
        <div style="font-weight: 600; font-size: 17px;">
            EvenBetter: Quick SSRF - Settings
        </div>
        <div style="color: var(--c-fg-subtle); font-size: 15px;">
            Configure EvenBetter: Quick SSRF settings.
        </div>
    </div>
    <div class="eb-quickssrf__settings-content">
        <div class="eb-quickssrf__settings--group">
            <div class="eb-quickssrf__setting-title">Customize HTTP response</div>
            <div class="eb-quickssrf__setting" data-key="customResponse">
              <div class="eb-quickssrf__setting-warning" style="display:none">
                 Custom responses are only supported by <b>ssrf.cvssadvisor.com</b>
              </div>
              <!-- Status Code / Body / Headers inputs -->
              <div class="eb-quickssrf__setting-input" data-placeholder="200" data-key="customStatusCode">
                <div class="eb-quickssrf__setting-text">
                  <div class="eb-quickssrf__setting-input-label">Status Code</div>
                  <div class="eb-quickssrf__setting-input-description">
                    This is the HTTP status code of the response. You can try to use the redirect status codes to bypass SSRF protection.
                  </div>
                </div>
              </div>
              <div class="eb-quickssrf__setting-input" data-placeholder="Hello, World!" data-key="customBody">
                <div class="eb-quickssrf__setting-text">
                  <div class="eb-quickssrf__setting-input-label">Body</div>
                  <div class="eb-quickssrf__setting-input-description">
                    This is the body of the HTTP response.
                  </div>
                </div>
              </div>
              <div class="eb-quickssrf__setting-input" data-placeholder="Content-Type: text/html" data-key="customHeaders">
                <div class="eb-quickssrf__setting-text">
                  <div class="eb-quickssrf__setting-input-label">Headers</div>
                  <div class="eb-quickssrf__setting-input-description">
                    Headers are in the format of key: value. You can add multiple headers in new lines.
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>
  `;
  settingsPageBody = bodyContent;

  bodyContent
    .querySelectorAll(".eb-quickssrf__setting-input")
    .forEach((setting) => {
      const input = EvenBetterAPI.components.createTextInput(
        "100%",
        setting.getAttribute("data-placeholder")
      );
      setting.appendChild(input);
    });


  // convert headersInput to textarea
  let headersInput = bodyContent.querySelector(
    "[data-key='customHeaders'] input"
  ) as HTMLInputElement;

  headersInput.outerHTML = headersInput.outerHTML.replace(
    "<input",
    "<textarea"
  );

  headersInput = bodyContent.querySelector(
    "[data-key='customHeaders'] textarea"
  ) as HTMLInputElement;

  headersInput.style.height = "100px";

  // convert bodyInput to textarea
  let bodyInput = bodyContent.querySelector(
    "[data-key='customBody'] input"
  ) as HTMLInputElement;

  bodyInput.outerHTML = bodyInput.outerHTML.replace(
    "<input",
    "<textarea"
  );

  bodyInput = bodyContent.querySelector(
    "[data-key='customBody'] textarea"
  ) as HTMLInputElement;

  bodyInput.style.height = "100px";
  

  const customResponse = bodyContent.querySelector(
    "[data-key='customResponse']"
  );

  const saveButton = Caido.ui.button({
    label: "Save",
    variant: "primary",
    size: "small",
    leadingIcon: "fas fa-save",
  });

  saveButton.addEventListener("click", async () => {
    if (saveButton.ariaDisabled === "true") return;

    const statusCode = document.querySelector(
      "[data-key='customStatusCode'] input"
    ) as HTMLInputElement;

    if (!isNumeric(statusCode.value)) {
      EvenBetterAPI.toast.showToast({
        message: "Status code must be a number.",
        type: "error",
        duration: 2000,
        position: "bottom",
      });
      return;
    }

    const body = document.querySelector(
      "[data-key='customBody'] textarea"
    ) as HTMLInputElement;

    const headers = document.querySelector(
      "[data-key='customHeaders'] textarea"
    ) as HTMLInputElement;

    if (!checkHeaderFormat(headers.value)) {
      EvenBetterAPI.toast.showToast({
        message: "Headers must be in the format of `key: value`. Make sure you have a space after the colon.",
        type: "error",
        duration: 2000,
        position: "bottom",
      });
      return;
    }
    
    customizeHTTPResponse(ssrfInstance.id, parseInt(statusCode.value), body.value, headers.value).then((res) => {
      EvenBetterAPI.toast.showToast({
        message: "HTTP response customized successfully!",
        type: "success",
        duration: 2000,
        position: "bottom",
      });
    }).catch((err) => {
      EvenBetterAPI.toast.showToast({
        message: "Failed to customize HTTP response.",
        type: "error",
        duration: 2000,
        position: "bottom"
      });
      console.error(err);
    });
  });

  saveButton.id = "eb-quickssrf-save-button";
  saveButton.ariaDisabled = "true";
  customResponse.appendChild(saveButton);

  EvenBetterAPI.eventManager.on("onSSRFInstanceChange", () => {
    saveButton.ariaDisabled = "false";
    const warning = bodyContent.querySelector(
      ".eb-quickssrf__setting-warning"
    ) as HTMLElement;

    const inputs = bodyContent.querySelectorAll(".eb-quickssrf__setting-input");

    if (ssrfInstance.type === SSRFInstanceType.CVSSADVISOR) {
      warning.style.display = "none";
      inputs.forEach((input: HTMLElement) => (input.style.display = "flex"));
      saveButton.style.display = "block";

      refreshHTTPResponseInputs();
    } else {
      warning.style.display = "block";
      inputs.forEach((input: HTMLElement) => (input.style.display = "none"));
      saveButton.style.display = "none";
    }
  });

  bodyContent
    .querySelectorAll(".eb-quickssrf__setting-checkbox")
    .forEach((checkbox) => {
      const key = checkbox.getAttribute("data-key");
      const isChecked = localStorage.getItem(`eb-${key}`) === "true";

      const caidoCheckbox = EvenBetterAPI.components.createCheckbox();
      const input = caidoCheckbox.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      input.checked = isChecked;

      checkbox.appendChild(caidoCheckbox);
      checkbox.addEventListener("change", () => {
        localStorage.setItem(`eb-${key}`, input.checked ? "true" : "false");
      });
    });

  return bodyContent;
};

const refreshHTTPResponseInputs = async () => {
  if (!ssrfInstance || ssrfInstance.type !== SSRFInstanceType.CVSSADVISOR || !settingsPageBody)
    return;

  const instance = await getCASSRFInstance(ssrfInstance.id);
  const statusCode = settingsPageBody.querySelector(
    "[data-key='customStatusCode'] input"
  ) as HTMLInputElement;
  const body = settingsPageBody.querySelector(
    "[data-key='customBody'] textarea"
  ) as HTMLInputElement;
  const headers = settingsPageBody.querySelector(
    "[data-key='customHeaders'] textarea"
  ) as HTMLInputElement;

  statusCode.value = instance.response_data.status_code.toString();
  body.value = instance.response_data.body;
  headers.value = Object.entries(instance.response_data.headers)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
};
