import { CaidoSDK } from "@/types";
import { createFeature } from "@/features/manager";
import { EvenBetterAPI } from "@bebiks/evenbetter-api";
import { downloadFile } from "@/utils/file-utils";

let shareMARElements: HTMLElement[] = [];
let cancelFunction: () => void;

export const shareMAR = createFeature("share-mar", {
  onFlagEnabled: (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
    cancelFunction = evenBetterAPI.eventManager.on(
      "onPageOpen",
      (data: { newUrl: string }) => {
        if (data.newUrl === "#/tamper") {
          addImportButton(sdk);
          observeMARTab(sdk);
        } else {
          cleanupObserver();
        }
      }
    );

    if (window.location.hash === "#/tamper") {
      addImportButton(sdk);
      observeMARTab(sdk);
    }
  },
  onFlagDisabled: () => {
    cleanupMARElements();
  },
});

const cleanupObserver = () => {
  if (marTabObserver) {
    marTabObserver.disconnect();
    marTabObserver = null;
  }
};

const cleanupMARElements = () => {
  if (cancelFunction) {
    cancelFunction();
  }

  cleanupObserver();

  shareMARElements.forEach((element) => {
    element.remove();
  });
  shareMARElements = [];

  const ruleListHeader = document.querySelector(
    ".c-rule-list-header__new"
  ) as HTMLElement;
  if (ruleListHeader) {
    ruleListHeader.style.removeProperty("display");
    ruleListHeader.style.removeProperty("gap");
  }

  const parent = ruleListHeader?.parentElement as HTMLElement;
  if (parent) {
    parent.style.removeProperty("display");
    parent.style.removeProperty("justify-content");
    parent.style.removeProperty("align-items");
    parent.style.removeProperty("padding");
  }

  document.querySelector("#scope-presents-import")?.remove();
  document.querySelector("#rules-download")?.remove();
};

const addImportButton = (sdk: CaidoSDK) => {
  const ruleListHeader = document.querySelector(
    ".c-rule-list-header__new"
  ) as HTMLElement;
  if (!ruleListHeader || document.querySelector("#scope-presents-import"))
    return;

  ruleListHeader.style.display = "flex";
  ruleListHeader.style.gap = "0.5em";

  const parent = ruleListHeader.parentElement as HTMLElement;
  if (!parent) return;

  parent.style.display = "flex";
  parent.style.justifyContent = "space-between";
  parent.style.alignItems = "center";
  parent.style.padding = "var(--c-space-3)";

  const rulesLabel = document.createElement("div");
  shareMARElements.push(rulesLabel);

  rulesLabel.textContent = "Rules";
  rulesLabel.classList.add("c-header__title");

  parent.prepend(rulesLabel);

  const importButton = sdk.ui.button({
    label: "Import",
    leadingIcon: "fas fa-file-upload",
    variant: "primary",
  });
  shareMARElements.push(importButton);

  importButton.id = "scope-presents-import";
  importButton.addEventListener("click", () => {
    handleImportButtonClick(sdk);
  });

  ruleListHeader.appendChild(importButton);
};

const handleImportButtonClick = (sdk: CaidoSDK) => {
  const input = document.createElement("input");
  shareMARElements.push(input);

  input.type = "file";
  input.accept = ".json";
  input.style.display = "none";
  input.addEventListener("change", (event) => {
    handleFileSelection(event, sdk);
  });

  document.body.prepend(input);
  input.click();
  input.remove();
};
const handleFileSelection = (event: Event, sdk: CaidoSDK) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || !target.files.length) return;

  const file = target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const target = e.target as FileReader;
    const data = JSON.parse(target.result as string);

    const firstCollectionID = await getFirstCollectionID(sdk);
    if (!firstCollectionID) return;

    const transformedSection = transformSection(data.section);

    await sdk.graphql.createTamperRule({
      input: {
        collectionId: firstCollectionID,
        name: data.name,
        condition: data.condition,
        section: transformedSection,
      },
    });

    location.reload();
  };
  reader.readAsText(file);
};

const transformSection = (section: any): any => {
  if (!section || !section.__typename) return section;

  switch (section.__typename) {
    case "TamperSectionRequestBody":
      return {
        requestBody: {
          operation: {
            raw: {
              matcher: transformMatcher(section.operation.matcher),
              replacer: transformReplacer(section.operation.replacer)
            }
          }
        }
      };
    case "TamperSectionRequestFirstLine":
      return {
        requestFirstLine: {
          operation: {
            raw: {
              matcher: transformMatcher(section.operation.matcher),
              replacer: transformReplacer(section.operation.replacer)
            }
          }
        }
      };
    case "TamperSectionRequestHeader":
      return {
        requestHeader: {
          operation: transformHeaderOperation(section.operation)
        }
      };
    case "TamperSectionRequestMethod":
      return {
        requestMethod: {
          operation: {
            update: {
              replacer: transformReplacer(section.operation.replacer)
            }
          }
        }
      };
    case "TamperSectionRequestPath":
      return {
        requestPath: {
          operation: {
            raw: {
              matcher: transformMatcher(section.operation.matcher),
              replacer: transformReplacer(section.operation.replacer)
            }
          }
        }
      };
    case "TamperSectionRequestQuery":
      return {
        requestQuery: {
          operation: transformQueryOperation(section.operation)
        }
      };
    case "TamperSectionResponseBody":
      return {
        responseBody: {
          operation: {
            raw: {
              matcher: transformMatcher(section.operation.matcher),
              replacer: transformReplacer(section.operation.replacer)
            }
          }
        }
      };
    case "TamperSectionResponseFirstLine":
      return {
        responseFirstLine: {
          operation: {
            raw: {
              matcher: transformMatcher(section.operation.matcher),
              replacer: transformReplacer(section.operation.replacer)
            }
          }
        }
      };
    case "TamperSectionResponseHeader":
      return {
        responseHeader: {
          operation: transformHeaderOperation(section.operation)
        }
      };
    case "TamperSectionResponseStatusCode":
      return {
        responseStatusCode: {
          operation: {
            update: {
              replacer: transformReplacer(section.operation.replacer)
            }
          }
        }
      };
    default:
      return section;
  }
};

const transformMatcher = (matcher: any): any => {
  if (!matcher || !matcher.__typename) return matcher;

  switch (matcher.__typename) {
    case "TamperMatcherFull":
      return { full: { full: true } };
    case "TamperMatcherRegex":
      return { regex: { regex: matcher.regex } };
    case "TamperMatcherValue":
      return { value: { value: matcher.value } };
    default:
      return matcher;
  }
};

const transformReplacer = (replacer: any): any => {
  if (!replacer || !replacer.__typename) return replacer;

  switch (replacer.__typename) {
    case "TamperReplacerTerm":
      return { term: { term: replacer.term } };
    case "TamperReplacerWorkflow":
      return { workflow: { id: replacer.id } };
    default:
      return replacer;
  }
};

const transformHeaderOperation = (operation: any): any => {
  if (!operation || !operation.__typename) return operation;

  switch (operation.__typename) {
    case "TamperOperationHeaderAdd":
      return {
        add: {
          matcher: { name: operation.matcher.name },
          replacer: transformReplacer(operation.replacer)
        }
      };
    case "TamperOperationHeaderRaw":
      return {
        raw: {
          matcher: transformMatcher(operation.matcher),
          replacer: transformReplacer(operation.replacer)
        }
      };
    case "TamperOperationHeaderRemove":
      return {
        remove: {
          matcher: { name: operation.matcher.name }
        }
      };
    case "TamperOperationHeaderUpdate":
      return {
        update: {
          matcher: { name: operation.matcher.name },
          replacer: transformReplacer(operation.replacer)
        }
      };
    default:
      return operation;
  }
};

const transformQueryOperation = (operation: any): any => {
  if (!operation || !operation.__typename) return operation;

  switch (operation.__typename) {
    case "TamperOperationQueryAdd":
      return {
        add: {
          matcher: { name: operation.matcher.name },
          replacer: transformReplacer(operation.replacer)
        }
      };
    case "TamperOperationQueryRaw":
      return {
        raw: {
          matcher: transformMatcher(operation.matcher),
          replacer: transformReplacer(operation.replacer)
        }
      };
    case "TamperOperationQueryRemove":
      return {
        remove: {
          matcher: { name: operation.matcher.name }
        }
      };
    case "TamperOperationQueryUpdate":
      return {
        update: {
          matcher: { name: operation.matcher.name },
          replacer: transformReplacer(operation.replacer)
        }
      };
    default:
      return operation;
  }
};

const getFirstCollectionID = (sdk: CaidoSDK) => {
  return sdk.graphql.tamperRuleCollections().then((data) => {
    if (
      data.tamperRuleCollections &&
      Array.isArray(data.tamperRuleCollections)
    ) {
      return data.tamperRuleCollections[0]?.id;
    }
    return null;
  });
};

let marTabObserver: MutationObserver | null = null;
const observeMARTab = (sdk: CaidoSDK) => {
  const cTamper = document.querySelector("[data-page='#/tamper']");
  if (!cTamper) return;

  cleanupObserver();

  marTabObserver = new MutationObserver((mutations) => {
    if (shouldSkipMutation(mutations)) return;
    attachDownloadButton(sdk);
  });

  marTabObserver.observe(cTamper, {
    childList: true,
    attributes: true,
    subtree: true,
  });
};

const shouldSkipMutation = (mutations: MutationRecord[]) => {
  return mutations.some((mutation) => {
    const target = mutation.target as HTMLElement;

    for (let i = 0; i < mutation.addedNodes.length; i++) {
      const node = mutation.addedNodes[i] as HTMLElement;
      if (node.id === "rules-download") return true;
    }

    if (target.classList.contains("c-grid-item")) return true;

    return false;
  });
};

const attachDownloadButton = (sdk: CaidoSDK) => {
  document.querySelector("#rules-download")?.remove();

  const cardFooter = document.querySelector(
    "[data-page='#/tamper'] .c-card__footer"
  ) as HTMLElement;
  if (!cardFooter) {
    return;
  }

  cardFooter.style.paddingRight = "1em";
  cardFooter.style.display = "flex";
  cardFooter.style.justifyContent = "space-between";
  cardFooter.style.alignItems = "center";

  const downloadButton = sdk.ui.button({
    label: "Download",
    leadingIcon: "fas fa-file-arrow-down",
    variant: "tertiary",
    size: "small",
  });
  shareMARElements.push(downloadButton);

  downloadButton.id = "rules-download";
  downloadButton.addEventListener("click", () => {
    handleDownloadButtonClick(sdk);
  });

  cardFooter.appendChild(downloadButton);
};

const handleDownloadButtonClick = (sdk: CaidoSDK) => {
  const ruleID = getActiveRuleID();
  if (!ruleID) {
    return;
  }

  sdk.graphql.tamperRuleCollections().then((data) => {
    if (!data.tamperRuleCollections) return;

    const collections = Array.isArray(data.tamperRuleCollections)
      ? data.tamperRuleCollections
      : data.tamperRuleCollections;

    collections.forEach((collection: any) => {
      const rules = collection.rules || [];
      rules.forEach((rule: any) => {
        if (rule.id === ruleID) {
          const ruleName = rule.name.replace(/[^a-zA-Z0-9]/g, "-");
          downloadFile(`rule-${ruleName}.json`, JSON.stringify(rule));
        }
      });
    });
  });
};

const getActiveRuleID = () => {
  return document
    .querySelector('.c-tree-item__subtree [data-is-active="true"]')
    ?.getAttribute("data-rule-id");
};
