import { Caido } from "@caido/sdk-frontend";
import EvenBetterAPI from "@bebiks/evenbetter-api";

export const onScopeTabOpen = () => {
  EvenBetterAPI.eventManager.on("onPageOpen", (data: any) => {
    if (data.newUrl == "#/scope") {
      addImportButton();
      observeScopeTab();
    }
  });
};

const addImportButton = () => {
  const actions = document.querySelector(".c-header__actions") as HTMLElement;
  if (!actions) return;

  document.querySelector("#scope-presents-import")?.remove();

  const importButton = actions.children[0].cloneNode(true) as HTMLElement;

  importButton.querySelector(
    ".c-button__label"
  ).innerHTML = `<div class="c-button__leading-icon"><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 13V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V13" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M12 3L12 15M12 15L8.5 11.5M12 15L15.5 11.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg></div><p style="
        margin: 0;
    ">Import</p>`;

  importButton.id = "scope-presents-import";
  importButton.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.style.display = "none";
    input.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const target = e.target as FileReader;
        const data = JSON.parse(target.result as string);

        Caido.scopes.createScope({
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
  ).parentElement;
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

  const downloadButton = presetCreateHeader
    .querySelector(".c-scope-tooltip")
    .cloneNode(true) as HTMLElement;

  downloadButton.id = "scope-presents-download";

  downloadButton.querySelector(
    "button"
  ).innerHTML = `<div class="c-button__leading-icon"><i class="c-icon fas fa-file-arrow-down"></i></div>Download`;
  downloadButton.querySelector("button").addEventListener("click", () => {
    const id = getActiveScopePreset();
    if (!id) return;

    const scopes = Caido.scopes.getScopes();
    const scope = scopes.find((s) => s.id === id);
    if (!scope) return;

    const json = JSON.stringify(scope, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "scope-" + scope.name + ".json";
    a.click();
  });

  presetCreateHeader.appendChild(downloadButton);
};

const getActiveScopePreset = () => {
  return document
    .querySelector(`.c-preset[data-is-selected="true"]`)
    ?.getAttribute("data-preset-id");
};
