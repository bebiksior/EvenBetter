import { onLocationChange } from "@/dom";
import { createFeature } from "@/features/manager";
import { type FrontendSDK } from "@/types";

let eventCancelFunction: (() => void) | undefined;
let clearAllButton: HTMLElement | undefined;

const deleteAllFindings = (sdk: FrontendSDK) => {
  eventCancelFunction = onLocationChange((data) => {
    if (data.newHash !== "#/findings") return;

    attachClearAllButton(sdk);
  });
};

const attachClearAllButton = (sdk: FrontendSDK) => {
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

        if (cursor !== undefined) {
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
    ".c-finding-table .c-card__header",
  ) as HTMLElement;
  if (cardHeader !== null) {
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
  onFlagEnabled: (sdk: FrontendSDK) => {
    deleteAllFindings(sdk);
  },
  onFlagDisabled: (sdk: FrontendSDK) => {
    cleanup();
  },
});
