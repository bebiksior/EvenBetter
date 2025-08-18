import { onLocationChange } from "@/dom";
import { createFeature } from "@/features/manager";
import { type FrontendSDK } from "@/types";
import { downloadFile, importFile } from "@/utils/file-utils";

let scopeTabObserver: MutationObserver | undefined = undefined;
let cancelListener: () => void;
let scopeButtons: HTMLElement[] = [];
export const shareScope = createFeature("share-scope", {
  onFlagEnabled: (sdk: FrontendSDK) => {
    cancelListener = onLocationChange((data) => {
      if (data.newHash === "#/scope") {
        observeScopeTab(sdk);
        attachDownloadButton(sdk);
        addImportButton(sdk);
      } else {
        if (scopeTabObserver !== undefined) {
          scopeTabObserver.disconnect();
          scopeTabObserver = undefined;
        }
      }
    });
  },
  onFlagDisabled: () => {
    if (scopeTabObserver !== undefined) {
      scopeTabObserver.disconnect();
      scopeTabObserver = undefined;
    }
    if (cancelListener !== undefined) {
      cancelListener();
    }
    scopeButtons.forEach((b) => b.remove());
    scopeButtons = [];
  },
});

const addImportButton = (sdk: FrontendSDK) => {
  const topbarLeft = document.querySelector(
    ".c-topbar .c-topbar__left",
  ) as HTMLElement;
  if (
    topbarLeft === null ||
    document.querySelector("#scope-presents-import") !== null
  )
    return;

  const importButton = sdk.ui.button({
    label: "Import",
    leadingIcon: "fas fa-file-upload",
    variant: "tertiary",
    size: "small",
  });
  importButton.id = "scope-presents-import";
  importButton.addEventListener("click", () => {
    importFile(".json", (content: string) => {
      const data = JSON.parse(content);

      sdk.scopes.createScope({
        name: data.name,
        allowlist: data.allowlist,
        denylist: data.denylist,
      });
    });
  });

  scopeButtons.push(importButton);

  setTimeout(() => {
    topbarLeft.appendChild(importButton);
  }, 0);
};

const observeScopeTab = (sdk: FrontendSDK) => {
  const presetForm = document.querySelector(
    ".c-preset-form-create",
  )?.parentElement;
  if (presetForm === null || presetForm === undefined) return;

  if (scopeTabObserver !== undefined) {
    scopeTabObserver.disconnect();
    scopeTabObserver = undefined;
  }

  scopeTabObserver = new MutationObserver((m) => {
    if (
      m.some(
        (m) =>
          m.attributeName === "style" ||
          (m.target as HTMLElement).classList.contains(
            "c-preset-form-create__header",
          ),
      )
    )
      return;

    attachDownloadButton(sdk);
  });

  scopeTabObserver.observe(presetForm, {
    childList: true,
    attributes: true,
    subtree: true,
  });
};

const attachDownloadButton = (sdk: FrontendSDK) => {
  document.querySelector("#scope-presents-download")?.remove();

  const presetCreateHeader = document.querySelector(
    ".c-preset-form-create__header",
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
  if (button === null) return;

  button.addEventListener("click", () => {
    const id = getActiveScopePreset();
    if (id === undefined) return;

    const scopes = sdk.scopes.getScopes();
    const scope = scopes.find((s) => s.id === id);
    if (scope === undefined) return;

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
