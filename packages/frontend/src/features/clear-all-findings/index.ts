import { createFeature } from "@/features/manager";
import { CaidoSDK } from "@/types";
import { EvenBetterAPI } from "@bebiks/evenbetter-api";
import { PageOpenEvent } from "@bebiks/evenbetter-api/src/events/onPageOpen";

let eventCancelFunction: (() => void) | undefined;
let clearAllButton: HTMLElement | undefined;

const deleteAllFindings = (
  sdk: CaidoSDK,
  evenBetterAPI: EvenBetterAPI
) => {
  eventCancelFunction = evenBetterAPI.eventManager.on(
    "onPageOpen",
    (data: PageOpenEvent) => {
      if (data.newUrl !== "#/findings") return;

      attachClearAllButton(sdk);
    }
  );
};

const attachClearAllButton = (sdk: CaidoSDK) => {
  if (document.querySelector("#clear-all-findings")) return;

  clearAllButton = sdk.ui.button({
    label: "Clear All",
    size: "small",
    variant: "primary",
    leadingIcon: "fas fa-trash",
  });

  clearAllButton.id = "clear-all-findings";
  clearAllButton.addEventListener("click", () => {
    sdk.graphql
      .getFindingsByOffset({
        limit: 100000,
        offset: 0,
        filter: {},
        order: { by: "ID", ordering: "DESC" },
      })
      .then((res) => {
        sdk.graphql.deleteFindings({
          ids: res.findingsByOffset.edges.map((finding) => finding.node.id),
        });
      });
  });

  const cardHeader = document.querySelector(
    ".c-finding-table .c-card__header"
  ) as HTMLElement;
  if (cardHeader) {
    cardHeader.appendChild(clearAllButton);
    cardHeader.style.display = "flex";
    cardHeader.style.justifyContent = "space-between";
    cardHeader.style.alignItems = "center";
  }
};

function cleanup() {
  if (clearAllButton) {
    clearAllButton.remove();
  }

  if (eventCancelFunction) {
    eventCancelFunction();
    eventCancelFunction = undefined;
  }
}

export const clearAllFindings = createFeature("clear-all-findings", {
  onFlagEnabled: (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
    deleteAllFindings(sdk, evenBetterAPI);
  },
  onFlagDisabled: (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
    cleanup();
  },
});
