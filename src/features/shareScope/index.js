let scopePresentsObserver;

export const onScopeTabOpen = () => {
  addImportButton();
  observeScopeTab();
};

const addImportButton = () => {
  const actions = document.querySelector(".c-header__actions");
  if (!actions) return;

  document.querySelector("#scope-presents-import")?.remove();

  const importButton = actions.children[0].cloneNode(true);

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
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        createNewScopePreset(data);
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

let scopeTabObserver;
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
          m.target.classList.contains("c-preset-form-create__header")
      )
    )
      return;

    attachDownloadButtonV2();
  });

  scopeTabObserver.observe(presetForm, {
    childList: true,
    attributes: true,
    subtree: true,
  });
};

const attachDownloadButtonV2 = () => {
  document.querySelector("#scope-presents-download")?.remove();

  const presetCreateHeader = document.querySelector(
    ".c-preset-form-create__header"
  );

  const downloadButton = presetCreateHeader
    .querySelector(".c-scope-tooltip")
    .cloneNode(true);
  downloadButton.id = "scope-presents-download";

  downloadButton.querySelector(
    "button"
  ).innerHTML = `<div data-v-f56ffbcc="" class="c-button__leading-icon"><i data-v-f56ffbcc="" class="c-icon fas fa-file-arrow-down"></i></div>Download`;
  downloadButton.querySelector("button").addEventListener("click", () => {
    const id = getActiveScopePreset();
    if (!id) return;

    getScopePreset(id).then((response) => {
      response.json().then((data) => {
        const json = JSON.stringify(data.data.scope, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "scope-" + data.data.scope.name + ".json";
        a.click();
      });
    });
  });

  presetCreateHeader.appendChild(downloadButton);
};

const createNewScopePreset = (data) => {
  const payload = {
    operationName: "createScope",
    query: `mutation createScope($input: CreateScopeInput!) {\n  createScope(input: $input) {\n    error {\n      ... on InvalidGlobTermsUserError {\n        ...invalidGlobTermsUserErrorFull\n      }\n      ... on OtherUserError {\n        ...otherUserErrorFull\n      }\n    }\n    scope {\n      ...scopeFull\n    }\n  }\n}\nfragment invalidGlobTermsUserErrorFull on InvalidGlobTermsUserError {\n  ...userErrorFull\n  terms\n}\nfragment userErrorFull on UserError {\n  __typename\n  code\n}\nfragment otherUserErrorFull on OtherUserError {\n  ...userErrorFull\n}\nfragment scopeFull on Scope {\n  __typename\n  id\n  name\n  allowlist\n  denylist\n  indexed\n}`,
    variables: {
      input: {
        allowlist: data.allowlist,
        denylist: data.denylist,
        name: data.name,
      },
    },
  };

  fetch(document.location.origin + "/graphql", {
    body: JSON.stringify(payload),
    method: "POST",
    headers: {
      Authorization:
        "Bearer " +
        JSON.parse(localStorage.getItem("CAIDO_AUTHENTICATION")).accessToken,
    },
  });
};

const getScopePreset = (id) => {
  const payload = {
    operationName: "scope",
    query: `query scope($id:ID!) {\n scope(id: $id){\n id\n name\n allowlist\n denylist \n }\n }`,
    variables: {
      id: `${id}`,
    },
  };

  return fetch(document.location.origin + "/graphql", {
    body: JSON.stringify(payload),
    method: "POST",
    headers: {
      Authorization:
        "Bearer " +
        JSON.parse(localStorage.getItem("CAIDO_AUTHENTICATION")).accessToken,
    },
  });
};

const getActiveScopePreset = () => {
  return document
    .querySelector(`.c-preset[data-is-selected="true"]`)
    ?.getAttribute("data-preset-id");
};
