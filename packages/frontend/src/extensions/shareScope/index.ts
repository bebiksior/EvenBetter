import { getEvenBetterAPI } from "../../utils/evenbetterapi";
import { downloadFile } from "../../utils/files";
import { getCaidoAPI } from "../../utils/caidoapi";

export const onScopeTabOpen = () => {
  getEvenBetterAPI().eventManager.on("onPageOpen", (data: any) => {
    if (data.newUrl == "#/scope") {
      addImportButton();
      observeScopeTab();
    } else {
      if (scopeTabObserver) {
        scopeTabObserver.disconnect();
        scopeTabObserver = null;
      }
    }
  });
};

const addImportButton = () => {
  const actions = document.querySelector(".c-header__actions") as HTMLElement;
  if (!actions) return;

  document.querySelector("#scope-presents-import")?.remove();

  const importButton = getCaidoAPI().ui.button({
    label: "Import",
    leadingIcon: "fas fa-file-upload",
    variant: "primary",
  });

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

        getCaidoAPI().scopes.createScope({
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

let scopeTabObserver: MutationObserver | null = null;
const observeScopeTab = () => {
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

    attachDownloadButton();
  });

  scopeTabObserver.observe(presetForm, {
    childList: true,
    attributes: true,
    subtree: true,
  });
};

const attachDownloadButton = () => {
  document.querySelector("#scope-presents-download")?.remove();

  const presetCreateHeader = document.querySelector(
    ".c-preset-form-create__header"
  );

  const downloadButton = getCaidoAPI().ui.button({
    label: "Download",
    leadingIcon: "fas fa-file-arrow-down",
    variant: "tertiary",
    size: "small",
  });

  downloadButton.id = "scope-presents-download";

  const button = downloadButton.querySelector("button");
  if (!button) return;

  button.addEventListener("click", () => {
    const id = getActiveScopePreset();
    if (!id) return;

    const scopes = getCaidoAPI().scopes.getScopes();
    const scope = scopes.find((s) => s.id === id);
    if (!scope) return;

    downloadFile("scope-" + scope.name + ".json", JSON.stringify(scope));
    getEvenBetterAPI().toast.showToast({
      message: "Scope preset downloaded successfully",
      duration: 3000,
      position: "bottom",
      type: "success",
    });
  });

  presetCreateHeader?.appendChild(downloadButton);
};

const getActiveScopePreset = () => {
  return document
    .querySelector(`.c-preset[data-is-selected="true"]`)
    ?.getAttribute("data-preset-id");
};
