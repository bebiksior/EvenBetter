import { createFeature } from "@/features/manager";
import { CaidoSDK } from "@/types";
import { downloadFile, importFile } from "@/utils/file-utils";
import { EvenBetterAPI } from "@bebiks/evenbetter-api";
import { PageOpenEvent } from "@bebiks/evenbetter-api/src/events/onPageOpen";

let filterTabObserver: MutationObserver | null = null;
let cancelListener: () => void;
let filterButtons: HTMLElement[] = [];

export const shareFilters = createFeature("share-filters", {
  onFlagEnabled: (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
    cancelListener = evenBetterAPI.eventManager.on(
      "onPageOpen",
      (data: PageOpenEvent) => {
        cleanupFilterElements();

        if (data.newUrl == "#/filter") {
          addImportButton(sdk);
          observeFilterTab(sdk, evenBetterAPI);
        }
      }
    );
  },
  onFlagDisabled: () => {
    cleanupFilterElements();
    if (cancelListener) {
      cancelListener();
    }
  },
});

const cleanupFilterElements = () => {
  if (filterTabObserver) {
    filterTabObserver.disconnect();
    filterTabObserver = null;
  }

  filterButtons.forEach((b) => b.remove());
  filterButtons = [];
};
const addImportButton = (sdk: CaidoSDK) => {
  const header = document.querySelector(".c-list-header") as HTMLElement;
  const actions = document.querySelector(
    ".c-list-header__actions"
  ) as HTMLElement;
  if (!actions || !header) return;

  if (document.querySelector("#filter-presets-import")) {
    return;
  }

  // Move title to header
  const title = document.querySelector(".c-list-header__title");
  if (title && title.parentElement === actions) {
    actions.removeChild(title);
    header.prepend(title);
  }

  // Style the header and actions
  header.style.alignItems = "center";
  header.style.flexDirection = "row";
  actions.style.width = "fit-content";
  actions.style.gap = "0.8rem";
  actions.style.display = "flex";

  const importButton = sdk.ui.button({
    label: "Import",
    leadingIcon: "fas fa-file-upload",
    variant: "primary",
  });
  filterButtons.push(importButton);

  importButton.id = "filter-presets-import";
  importButton.addEventListener("click", () => {
    importFile(".json", (content: string) => {
      try {
        const data = JSON.parse(content);

        sdk.graphql
          .createFilterPreset({
            input: {
              alias: data.alias,
              clause: data.clause,
              name: data.name,
            },
          })
          .then(() => {
            sdk.window.showToast("Filter preset imported successfully", {
              duration: 3000,
              variant: "success",
            });
          })
          .catch((error) => {
            sdk.window.showToast(
              `Failed to import filter preset: ${error.message}`,
              {
                duration: 3000,
                variant: "error",
              }
            );
          });
      } catch (error: any) {
        sdk.window.showToast(
          `Failed to import filter preset: ${error.message}`,
          {
            duration: 3000,
            variant: "error",
          }
        );
      }
    });
  });

  actions.appendChild(importButton);
};

const observeFilterTab = (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
  const formBody = document.querySelector(".c-form-body__actions");
  if (formBody) {
    attachDownloadButton(sdk, evenBetterAPI);
  }

  const filterContainer = document.querySelector(".c-filter");

  if (filterTabObserver) {
    filterTabObserver.disconnect();
    filterTabObserver = null;
  }

  filterTabObserver = new MutationObserver((mutations) => {
    if (mutations.every((m) => m.attributeName === "style")) return;

    if (!document.querySelector("#filter-presets-download")) {
      attachDownloadButton(sdk, evenBetterAPI);
    }
  });

  if (formBody) {
    filterTabObserver.observe(formBody, {
      childList: true,
      attributes: true,
      subtree: true,
    });
  }

  if (filterContainer) {
    filterTabObserver.observe(filterContainer, {
      childList: true,
      attributes: true,
      subtree: true,
    });
  }
};

const attachDownloadButton = (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
  if (document.querySelector("#filter-presets-download")) return;

  const formActions = document.querySelector(".c-form-body__actions");
  if (!formActions) return;

  const downloadButton = sdk.ui.button({
    label: "Download",
    leadingIcon: "fas fa-file-arrow-down",
    variant: "tertiary",
    size: "small",
  });
  filterButtons.push(downloadButton);

  downloadButton.id = "filter-presets-download";

  const button = downloadButton.querySelector("button");
  if (!button) return;

  button.addEventListener("click", () => {
    const id = getActiveFilterPreset();
    if (!id) {
      sdk.window.showToast("No filter preset selected", {
        duration: 3000,
        variant: "error",
      });
      return;
    }

    sdk.graphql
      .filterPresets()
      .then((response) => {
        const presets = response.filterPresets;
        const preset = presets.find((p: any) => p.id === id);

        if (!preset) {
          sdk.window.showToast("Filter preset not found", {
            duration: 3000,
            variant: "error",
          });
          return;
        }

        const presetData = {
          id: preset.id,
          alias: preset.alias,
          name: preset.name,
          clause: preset.clause,
        };

        downloadFile(`filter-${preset.alias}.json`, JSON.stringify(presetData));
        sdk.window.showToast("Filter preset downloaded successfully", {
          duration: 3000,
          variant: "success",
        });
      })
      .catch((error) => {
        sdk.window.showToast(
          `Failed to download filter preset: ${error.message}`,
          {
            duration: 3000,
            variant: "error",
          }
        );
      });
  });

  formActions.appendChild(downloadButton);
};

const getActiveFilterPreset = () => {
  return document
    .querySelector(`.c-preset[data-is-selected="true"]`)
    ?.getAttribute("data-preset-id");
};
