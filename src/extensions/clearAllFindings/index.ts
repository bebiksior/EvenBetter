import { Caido } from "@caido/sdk-frontend";
import EvenBetterAPI from "@bebiks/evenbetter-api";
import { PageOpenEvent } from "@bebiks/evenbetter-api/src/events/onPageOpen";

export const deleteAllFindings = () => {
  EvenBetterAPI.eventManager.on("onPageOpen", (data: PageOpenEvent) => {
    if (data.newUrl !== "#/findings") return;

    attachClearAllButton();
  });
};

const attachClearAllButton = () => {
  if (document.querySelector("#clear-all-findings")) return;

  const clearAllButton = Caido.ui.button({
    label: "Clear All",
    size: "small",
    variant: "primary",
    leadingIcon: "fas fa-trash",
  });

  clearAllButton.id = "clear-all-findings";
  clearAllButton.addEventListener("click", () => {
    Caido.graphql
      .getFindingsByOffset({
        limit: 100000,
        offset: 0,
        filter: {},
        order: { by: "ID", ordering: "DESC" },
      })
      .then((res) => {
        Caido.graphql.deleteFindings({
          ids: res.findingsByOffset.edges.map((finding) => finding.node.id),
        });
      });
  });

  document
    .querySelector(".c-finding-table .c-card__header")
    .appendChild(clearAllButton);
};
