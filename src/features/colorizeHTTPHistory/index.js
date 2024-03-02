const { getSetting } = require("../../settings");
const { modifyItemRow, isHighlighted, getRowIDColor } = require("./manual");

let httpHistoryObserver;
const observeHTTPRequests = () => {
  const requests = document.querySelector(".c-table__wrapper");
  if (!requests) return;

  if (httpHistoryObserver) {
    httpHistoryObserver.disconnect();
    httpHistoryObserver = null;
  }

  httpHistoryObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "highlighted") {
        const cell = mutation.target;
        colorizeCell(cell);
        return;
      }

      if (mutation.addedNodes.length === 0) return;

      const addedNode = mutation.addedNodes[0];
      if (addedNode.classList?.contains("c-table__item-row")) {
        if (addedNode.textContent.trim() == "Loading...") {
          setTimeout(() => {
            if (
              addedNode == null ||
              addedNode.textContent.trim() == "Loading..."
            ) {
              return;
            }

            modifyItemRow(addedNode);
          }, 1000);
          return;
        }

        modifyItemRow(addedNode);
      }
    });

    if (mutations.some((mutation) => mutation.target.getAttribute("colorized")))
      return;

    colorizeHttpHistory();
  });

  const config = {
    childList: true,
    characterData: true,
    attributes: true,
    subtree: true,
  };

  httpHistoryObserver.observe(requests, config);
};

const colorizeHttpHistory = () => {
  const queryCells = document.querySelectorAll(
    '.c-item-cell[data-column-id="REQ_QUERY"]'
  );

  queryCells.forEach((cell) => colorizeCell(cell));
};

const colorizeCell = (cell) => {
  const row = cell.parentElement;

  const rowID = row.querySelector(
    ".c-item-cell[data-column-id='ID']"
  ).textContent;

  if (isHighlighted(rowID)) {
    row.style.backgroundColor = getRowIDColor(rowID);
    row.setAttribute("colorized", "true");
  } else {
    row.style.backgroundColor = "";
    row.setAttribute("colorized", "false");
  }
};

export { observeHTTPRequests, colorizeHttpHistory };
