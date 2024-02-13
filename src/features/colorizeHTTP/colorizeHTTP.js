const { getSetting } = require("../../settings/settings");

let lastExecutionTime = 0;
let httpHistoryObserver;
const observeHTTPRequests = () => {
  const requests = document.querySelector(".c-table__wrapper");
  if (!requests) return;

  if (httpHistoryObserver) {
    httpHistoryObserver.disconnect();
    httpHistoryObserver = null;
  }

  httpHistoryObserver = new MutationObserver(() => {
    colorizeHttpHistory();
  });

  const config = {
    childList: true,
    characterData: true,
    subtree: true,
  };

  httpHistoryObserver.observe(requests, config);
};

const colorizeHttpHistory = () => {
  if (getSetting('colorizeHttpRows') !== "true") return;

  const currentTime = Date.now();

  if (currentTime - lastExecutionTime < 50) {
    return;
  }

  lastExecutionTime = currentTime;

  const queryCells = document.querySelectorAll(
    '.c-item-cell[data-column-id="query"]'
  );

  queryCells.forEach((cell) => colorizeCell(cell));
};

const colorizeCell = (cell) => {
  const query = cell.textContent;

  const url = new URL("http://x.com?" + query);
  const color = url.searchParams.get(getSetting("colorizeParameterName"));
  const row = cell.parentElement.parentElement;
  if (color) {
    row.style.backgroundColor = color;
    row.setAttribute("colorized", "true");
  } else {
    row.style.backgroundColor = "";
    row.setAttribute("colorized", "false");
  }
};


export { observeHTTPRequests, colorizeHttpHistory };