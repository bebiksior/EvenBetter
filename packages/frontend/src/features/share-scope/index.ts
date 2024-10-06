import { createFeature } from "@/features/manager";
import { CaidoSDK } from "@/types";
import { downloadFile } from "@/utils/file-utils";
import { EvenBetterAPI } from "@bebiks/evenbetter-api";

let scopeTabObserver: MutationObserver | null = null;
let cancelListener: () => void;
let scopeButtons: HTMLElement[] = [];

export const shareScope = createFeature("share-scope", {
  onFlagEnabled: (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
    cancelListener = evenBetterAPI.eventManager.on(
      "onPageOpen",
      (data: any) => {
        if (data.newUrl == "#/scope") {
          addImportButton(sdk);
          observeScopeTab(sdk, evenBetterAPI);
        } else {
          if (scopeTabObserver) {
            scopeTabObserver.disconnect();
            scopeTabObserver = null;
          }
        }
      }
    );
  },
  onFlagDisabled: () => {
    if (scopeTabObserver) {
      scopeTabObserver.disconnect();
      scopeTabObserver = null;
    }
    if (cancelListener) {
      cancelListener();
    }
    scopeButtons.forEach((b) => b.remove());
    scopeButtons = [];
  },
});

const addImportButton = (sdk: CaidoSDK) => {
  const actions = document.querySelector(".c-header__actions") as HTMLElement;
  if (!actions) return;

  document.querySelector("#scope-presents-import")?.remove();

  const importButton = sdk.ui.button({
    label: "Import",
    leadingIcon: "fas fa-file-upload",
    variant: "primary",
  });
  scopeButtons.push(importButton);

  importButton.id = "scope-presents-import";
  importButton.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.style.display = "none";
    input.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      if (!target.files || !target.files.length) return;

      const file = target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const target = e.target as FileReader;
        const data = JSON.parse(target.result as string);

        sdk.scopes.createScope({
          name: data.name,
          allowlist: data.allowlist,
          denylist: data.denylist,
        });
      };
      reader.readAsText(file);
    });

    document.body.prepend(input);

    input.click();
    input.remove();
  });

  actions.style.gap = "0.8rem";
  actions.style.display = "flex";

  actions.appendChild(importButton);
};

const observeScopeTab = (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
  const presetForm = document.querySelector(
    ".c-preset-form-create"
  )?.parentElement;
  if (!presetForm) return;

  if (scopeTabObserver) {
    scopeTabObserver.disconnect();
    scopeTabObserver = null;
  }

  scopeTabObserver = new MutationObserver((m) => {
    if (
      m.some(
        (m) =>
          m.attributeName === "style" ||
          (m.target as HTMLElement).classList.contains(
            "c-preset-form-create__header"
          )
      )
    )
      return;

    attachDownloadButton(sdk, evenBetterAPI);
  });

  scopeTabObserver.observe(presetForm, {
    childList: true,
    attributes: true,
    subtree: true,
  });
};

const attachDownloadButton = (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
  document.querySelector("#scope-presents-download")?.remove();

  const presetCreateHeader = document.querySelector(
    ".c-preset-form-create__header"
  );

  const downloadButton = sdk.ui.button({
    label: "Download",
    leadingIcon: "fas fa-file-arrow-down",
    variant: "tertiary",
    size: "small",
  });
  scopeButtons.push(downloadButton);

  downloadButton.id = "scope-presents-download";

  const button = downloadButton.querySelector("button");
  if (!button) return;

  button.addEventListener("click", () => {
    const id = getActiveScopePreset();
    if (!id) return;

    const scopes = sdk.scopes.getScopes();
    const scope = scopes.find((s) => s.id === id);
    if (!scope) return;

    downloadFile("scope-" + scope.name + ".json", JSON.stringify(scope));
    sdk.window.showToast("Scope preset downloaded successfully", {
      duration: 3000,
      variant: "success",
    });
  });

  presetCreateHeader?.appendChild(downloadButton);
};

const getActiveScopePreset = () => {
  return document
    .querySelector(`.c-preset[data-is-selected="true"]`)
    ?.getAttribute("data-preset-id");
};
