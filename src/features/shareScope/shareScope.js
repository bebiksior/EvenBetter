let scopePresentsObserver;

export const onScopeTabOpened = () => {
  observeScopePresents();
  addImportButton();
};

const observeScopePresents = () => {
  const entries = document.querySelector(".c-preset-list__well");
  if (!entries) return;

  if (scopePresentsObserver) {
    scopePresentsObserver.disconnect();
    scopePresentsObserver = null;
  }

  scopePresentsObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "data-is-active") {
        const isActive = mutation.target.getAttribute("data-is-active");
        if (isActive === "true") {
          setTimeout(() => onScopePresentsTabOpened(), 50);
        }
      }

      if (mutation.addedNodes.length > 0) {
        const addedNode = mutation.addedNodes[0];
        if (addedNode.classList.contains("c-preset-list__well-body")) {
          onScopePresentsTabOpened();
        }
      }
    });
  });

  if (
    document.querySelector(".c-preset-body__scope-form-value-input") !== null
  ) {
    onScopePresentsTabOpened();
  }

  scopePresentsObserver.observe(entries, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  console.log("Scope presents observer started");
};

const addImportButton = () => {
  const actions = document.querySelector(".c-scope-presets__body-actions");
  if (!actions) return;

  document.querySelector("#scope-presents-import")?.remove();

  const importButton = actions.children[0].cloneNode(true);
  importButton.querySelector(".c-button__label").innerHTML = `<div class="c-button__leading-icon"><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

  actions.appendChild(importButton);
};

const onScopePresentsTabOpened = () => {
  const header = document.querySelector(".c-header__read-only");
  if (!header) return;

  document.querySelector("#scope-presents-export")?.remove();

  const exportElement = document.createElement("div");
  exportElement.innerHTML = `
        <svg fill="#fff" height="13px" width="13px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                viewBox="0 0 492.022 492.022" xml:space="preserve">
            <g id="XMLID_607_">
                <path id="XMLID_609_" d="M317.88,113.728H58.729C26.348,113.728,0,140.078,0,172.459v259.15c0,32.381,26.348,58.729,58.729,58.729
                    H317.88c32.381,0,58.728-26.348,58.728-58.729v-259.15C376.608,140.078,350.261,113.728,317.88,113.728z M307.958,421.687H68.651
                    V182.378h239.307V421.687z"/>
                <path id="XMLID_608_" d="M406.609,1.685H260.308c-18.956,0-34.325,15.369-34.325,34.324c0,18.956,15.369,34.326,34.325,34.326
                    h146.302c9.236,0,16.762,7.525,16.762,16.76V233.4c0,18.955,15.368,34.324,34.325,34.324s34.326-15.369,34.326-34.324V87.095
                    C492.022,40,453.706,1.685,406.609,1.685z"/>
            </g>
        </svg>`;
  exportElement.id = "scope-presents-export";
  exportElement.addEventListener("click", () => {
    const entries = document.querySelectorAll(
      ".c-scope-list__well-entry:not([data-header])"
    );
    if (!entries) return;

    const presetName = document.querySelector(
      ".c-header__read-only label"
    ).textContent;

    const data = {
      presetName: presetName,
      allowlist: [],
      denylist: [],
    };

    entries.forEach((entry) => {
      const type = entry.querySelector(
        ".c-scope-list__well-entry-type"
      ).innerText;
      const name = entry.querySelector(
        ".c-scope-list__well-entry-value"
      ).innerText;

      if (type === "In Scope") {
        data.allowlist.push(name);
      } else {
        data.denylist.push(name);
      }
    });

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "scope-" + presetName + ".json";
    a.click();
  });

  header.appendChild(exportElement);
};

const createNewScopePreset = (data) => {
  const payload = {
    operationName: "createScope",
    query: `mutation createScope($input: CreateScopeInput!) {\n  createScope(input: $input) {\n    error {\n      ... on InvalidGlobTermsUserError {\n        ...invalidGlobTermsUserErrorFull\n      }\n      ... on OtherUserError {\n        ...otherUserErrorFull\n      }\n    }\n    scope {\n      ...scopeFull\n    }\n  }\n}\nfragment invalidGlobTermsUserErrorFull on InvalidGlobTermsUserError {\n  ...userErrorFull\n  terms\n}\nfragment userErrorFull on UserError {\n  __typename\n  code\n}\nfragment otherUserErrorFull on OtherUserError {\n  ...userErrorFull\n}\nfragment scopeFull on Scope {\n  __typename\n  id\n  name\n  allowlist\n  denylist\n  indexed\n}`,
    variables: {
      input: {
        allowlist: data.allowlist,
        denylist: data.denylist,
        name: data.presetName,
      },
    },
  };

  fetch(document.location.origin + "/graphql", {
    body: JSON.stringify(payload),
    method: "POST",
    headers: {
      "Authorization": "Bearer " + JSON.parse(localStorage.getItem("CAIDO_AUTHENTICATION")).accessToken,
    },
  });
};
