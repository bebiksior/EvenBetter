import { getEvenBetterAPI } from "../../utils/evenbetterapi";
import { PageOpenEvent } from "@bebiks/evenbetter-api/src/events/onPageOpen";
import { getCaidoAPI } from "../../utils/caidoapi";

export const deleteAllFindings = () => {
  getEvenBetterAPI().eventManager.on("onPageOpen", (data: PageOpenEvent) => {
    if (data.newUrl !== "#/findings") return;

    attachClearAllButton();
  });
};

const attachClearAllButton = () => {
  if (document.querySelector("#clear-all-findings")) return;

  const clearAllButton = getCaidoAPI().ui.button({
    label: "Clear All",
    size: "small",
    variant: "primary",
    leadingIcon: "fas fa-trash",
  });

  clearAllButton.id = "clear-all-findings";
  clearAllButton.addEventListener("click", () => {
    getCaidoAPI().graphql
      .getFindingsByOffset({
        limit: 100000,
        offset: 0,
        filter: {},
        order: { by: "ID", ordering: "DESC" },
      })
      .then((res) => {
        getCaidoAPI().graphql.deleteFindings({
          ids: res.findingsByOffset.edges.map((finding) => finding.node.id),
        });
      });
  });

  document
    .querySelector(".c-finding-table .c-card__header")?.appendChild(clearAllButton);
};
