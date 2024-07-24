import { getEvenBetterAPI } from "../../utils/evenbetterapi";
import { getCaidoAPI } from "../../utils/caidoapi";
import { downloadFile } from "../../utils/files";

export const onMARTabOpen = () => {
  getEvenBetterAPI().eventManager.on("onPageOpen", (data: any) => {
    if (data.newUrl == "#/tamper") {
      addImportButton();
      observeMARTab();
    } else {
      if (marTabObserver) {
        marTabObserver.disconnect();
        marTabObserver = null;
      }
    }
  });
};

const addImportButton = () => {
  const ruleListHeader = document.querySelector(
    ".c-rule-list-header__new"
  ) as HTMLElement;
  if (!ruleListHeader) return;

  if (document.querySelector("#scope-presents-import")) return;

  ruleListHeader.style.display = "flex";
  ruleListHeader.style.gap = "0.5em";

  const parent = ruleListHeader.parentElement as HTMLElement;
  if (!parent) return;

  parent.style.display = "flex";
  parent.style.justifyContent = "space-between";
  parent.style.alignItems = "center";
  parent.style.padding = "var(--c-space-3)";

  const rulesLabel = document.createElement("div");
  rulesLabel.textContent = "Rules";
  rulesLabel.classList.add("c-header__title");

  parent.prepend(rulesLabel);

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
      reader.onload = async (e) => {
        const target = e.target as FileReader;
        const data = JSON.parse(target.result as string);

        const firstCollectionID = await getFirstCollcetionID();
        if (!firstCollectionID) return;

        getCaidoAPI().graphql.createTamperRule({
          input: {
            collectionId: firstCollectionID,
            name: data.name,
            condition: data.condition,
            isEnabled: data.isEnabled,
            isRegex: data.isRegex,
            matchTerm: data.matchTerm,
            replaceTerm: data.replaceTerm,
            strategy: data.strategy,
          },
        });

        setTimeout(() => {
          window.location.reload();
        }, 20);
      };
      reader.readAsText(file);
    });

    document.body.prepend(input);

    input.click();
    input.remove();
  });

  ruleListHeader.appendChild(importButton);
};

const getFirstCollcetionID = () => {
  return getCaidoAPI()
    .graphql.tamperRuleCollections()
    .then((data) => {
      return data.tamperRuleCollections?.nodes[0]?.id;
    });
};

let marTabObserver: MutationObserver | null = null;
const observeMARTab = () => {
  const cTamper = document.querySelector(".c-tamper");
  if (!cTamper) return;

  if (marTabObserver) {
    marTabObserver.disconnect();
    marTabObserver = null;
  }

  marTabObserver = new MutationObserver((m) => {
    if (
      m.some((m) => {
        const target = m.target as HTMLElement;

        for (let i = 0; i < m.addedNodes.length; i++) {
          const node = m.addedNodes[i] as HTMLElement;
          if (node.id == "rules-download") return true;
        }

        if (target.classList.contains("c-grid-item")) return true;

        return false;
      })
    )
      return;

    attachDownloadButton();
  });

  marTabObserver.observe(cTamper, {
    childList: true,
    attributes: true,
    subtree: true,
  });
};

const attachDownloadButton = () => {
  document.querySelector("#rules-download")?.remove();

  const formUpdateHeader = document.querySelector(
    ".c-rule-form-update__header"
  );
  if (!formUpdateHeader) return;

  const downloadButton = getCaidoAPI().ui.button({
    label: "Download",
    leadingIcon: "fas fa-file-arrow-down",
    variant: "tertiary",
    size: "small",
  });

  downloadButton.id = "rules-download";
  downloadButton.addEventListener("click", () => {
    const ruleID = getActiveRuleID();
    if (!ruleID) return;

    getCaidoAPI()
      .graphql.tamperRuleCollections()
      .then((data) => {
        const collections = data.tamperRuleCollections.nodes;
        collections.forEach((collection: any) => {
          const rules = collection.rules;
          rules.forEach((rule: any) => {
            if (rule.id == ruleID) {
              const ruleName = rule.name.replace(/[^a-zA-Z0-9]/g, "-");
              downloadFile("rule-" + ruleName + ".json", JSON.stringify(rule));
            }
          });
        });
      });
  });

  formUpdateHeader.appendChild(downloadButton);
};

const getActiveRuleID = () => {
  const ruleID = document
    .querySelector('.c-tree-item__subtree [data-is-active="true"]')
    ?.getAttribute("data-rule-id");
  return ruleID;
};
