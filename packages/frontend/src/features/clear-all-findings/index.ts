import { createFeature } from "@/features/manager";
import { CaidoSDK } from "@/types";
import { EvenBetterAPI } from "@bebiks/evenbetter-api";
import { PageOpenEvent } from "@bebiks/evenbetter-api/src/events/onPageOpen";

let eventCancelFunction: (() => void) | undefined;
let clearAllButton: HTMLElement | undefined;

const deleteAllFindings = (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
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
  clearAllButton.addEventListener("click", async () => {
    try {
      const allFindingIds: string[] = [];
      let hasNextPage = true;
      let cursor: string | undefined = undefined;
      const batchSize = 1000;

      while (hasNextPage) {
        let response;

        if (cursor) {
          response = await sdk.graphql.getFindingsAfter({
            after: cursor,
            first: batchSize,
            filter: {},
            order: { by: "ID", ordering: "DESC" },
          });

          const findings = response.findings.edges;
          allFindingIds.push(...findings.map((finding) => finding.node.id));

          hasNextPage = response.findings.pageInfo.hasNextPage;
          cursor = response.findings.pageInfo.endCursor ?? undefined;
        } else {
          response = await sdk.graphql.getFindingsByOffset({
            limit: batchSize,
            offset: 0,
            filter: {},
            order: { by: "ID", ordering: "DESC" },
          });

          const findings = response.findingsByOffset.edges;
          allFindingIds.push(...findings.map((finding) => finding.node.id));

          hasNextPage = response.findingsByOffset.pageInfo.hasNextPage;
          cursor = response.findingsByOffset.pageInfo.endCursor ?? undefined;
        }
      }

      if (allFindingIds.length > 0) {
        await sdk.graphql.deleteFindings({
          input: {
            ids: allFindingIds,
          },
        });
      }
    } catch (error) {
      console.error("Error clearing all findings:", error);
    }
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
