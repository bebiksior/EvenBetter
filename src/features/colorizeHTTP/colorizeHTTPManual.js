const listenForRightClick = () => {
  let items = document.querySelectorAll(".c-table__item-row");

  items.forEach(modifyItemRow);
};

const modifyItemRow = (item) => {
  item.removeEventListener("contextmenu", handleContextMenu);
  item.addEventListener("contextmenu", handleContextMenu);

  item.removeEventListener("click", handleClick);
  item.addEventListener("click", handleClick);
};

let activeRequestID = null;
const handleClick = (event) => {
  let row = event.target.closest(".c-item-row");

  if (!row) {
    return;
  }

  activeRequestID = row.querySelector(
    ".c-item-cell[data-column-id='ID']"
  ).textContent;
  setTimeout(() => {
    attachHighlightButton();
  }, 10);
};

const attachHighlightButton = () => {
  const requestBody = document.querySelector(".c-request-skeleton__body");
  if (!requestBody) {
    return;
  }

  requestBody.removeEventListener("contextmenu", handleContextMenu);
  requestBody.addEventListener("contextmenu", handleContextMenu);
};

const handleContextMenu = (event) => {
  const target = event.target;
  if (target.closest(".c-request-skeleton__body")) {
    setTimeout(() => modifyContextMenu(activeRequestID, null), 10);

    return;
  }

  const row = target.closest(".c-item-row");
  if (!row) {
    return;
  }

  const rowID = row.querySelector(
    ".c-item-cell[data-column-id='ID']"
  ).textContent;

  handleClick(event);

  setTimeout(() => modifyContextMenu(rowID, row), 10);
};

const getRowElementByID = (rowID) => {
  const items = document.querySelectorAll(
    `.c-item-row .c-item-cell[data-column-id='ID']`
  )

  for (let i = 0; i < items.length; i++) {
    if (items[i].textContent === rowID) {
      return items[i].closest(".c-item-row");
    }
  }
};


const modifyContextMenu = (rowID, row) => {
  const contextMenu = document.querySelector(".c-menu");
  const contextItems = contextMenu.querySelectorAll(".c-item");
  const contextDividers = contextMenu.querySelectorAll(".c-divider");

  if (!contextMenu || !contextItems || !contextDividers) {
    return;
  }

  if (!row) {
    row = getRowElementByID(rowID);
  }

  const clonedDivider = contextDividers[0].cloneNode(true);
  contextMenu.insertBefore(clonedDivider, contextItems[contextItems.length]);

  const highlightRowMenu = contextMenu.querySelector(".fa-caret-right").parentElement.parentElement.cloneNode(true);
  highlightRowMenu.querySelector(".c-item__content").textContent =
    "Highlight row";

  highlightRowMenu.querySelector(".c-item__menu").insertAdjacentHTML(
    "beforeend",
    `
        <div class="c-item__menu evenbetter__c-item__menu">
          <div class="c-menu evenbetter__c-menu">
            <div
              class="c-item evenbetter__c-item"
            >
              <div class="c-item__content evenbetter__c-item__content">None</div>
            </div>
            <div
              class="c-item evenbetter__c-item"
            >
              <div class="c-item__content evenbetter__c-item__content">Red</div>
            </div>
            <div
              class="c-item evenbetter__c-item"
            >
              <div class="c-item__content evenbetter__c-item__content">Green</div>
            </div>
            <div
              class="c-item evenbetter__c-item"
            >
              <div class="c-item__content evenbetter__c-item__content">Blue</div>
            </div>
            <div
              class="c-item evenbetter__c-item"
            >
              <div class="c-item__content evenbetter__c-item__content">Orange</div>
            </div>
          </div>
        </div>
      `
  );
  highlightRowMenu.id = "highlightRowMenu";
  highlightRowMenu.querySelector(".c-item__menu").style.display = "none";

  highlightRowMenu.querySelectorAll(".c-item").forEach((item) => {
    let color = item.querySelector(".c-item__content").textContent;

    item.style.paddingLeft = "0.35rem";
    item.style.borderRadius = 0;

    if (color === "None") {
      return;
    }

    item.style.borderLeft = "3px solid";
    item.style.borderLeftColor = color;
  });

  highlightRowMenu.addEventListener("mouseenter", () => {
    highlightRowMenu.querySelector(".c-item__menu").style.display = "block";

    const cItemMenu = highlightRowMenu.querySelector(".c-item__menu");
    cItemMenu.style.left = 0;
    cItemMenu.style.top = "120px";
  });

  contextItems.forEach((item) =>
    item.addEventListener("mouseenter", closeCustomContextMenu)
  );

  highlightRowMenu.querySelectorAll(".c-item").forEach((color) => {
    color.addEventListener("click", () => {
      let colorText = color.querySelector(".c-item__content").textContent;

      if (colorText === "None") {
        if (row) {
          row.style.backgroundColor = "";
          row.removeAttribute("highlighted");
        }
        removeHighlightedRow(rowID);
      } else {
        if (row) {
          row.style.backgroundColor = colorText;
          row.setAttribute("highlighted", colorText);
        }
        storeHighlightedRow(rowID, colorText);
      }

      closeCustomContextMenu();
    });
  });

  contextMenu.insertBefore(highlightRowMenu, contextItems[contextItems.length]);
};

const closeCustomContextMenu = () => {
  const highlightRowMenu = document.getElementById("highlightRowMenu");
  if (highlightRowMenu) {
    highlightRowMenu.querySelector(".c-item__menu").style.display = "none";
  }
};

const storeHighlightedRow = (rowID, color) => {
  const highlightedRows =
    JSON.parse(localStorage.getItem(getProjectName() + ".highlightedRows")) ||
    {};

  highlightedRows[rowID] = color;

  localStorage.setItem(
    getProjectName() + ".highlightedRows",
    JSON.stringify(highlightedRows)
  );
};

const removeHighlightedRow = (rowID) => {
  const highlightedRows =
    JSON.parse(localStorage.getItem(getProjectName() + ".highlightedRows")) ||
    {};

  delete highlightedRows[rowID];

  localStorage.setItem(
    getProjectName() + ".highlightedRows",
    JSON.stringify(highlightedRows)
  );
};

const isRowIDHighlighted = (rowID) => {
  const highlightedRows =
    JSON.parse(localStorage.getItem(getProjectName() + ".highlightedRows")) ||
    {};

  return highlightedRows[rowID] !== undefined;
};

const getRowIDColor = (rowID) => {
  const highlightedRows =
    JSON.parse(localStorage.getItem(getProjectName() + ".highlightedRows")) ||
    {};

  return highlightedRows[rowID];
};

const getProjectName = () => {
  let name = document.querySelector(
    ".c-current-project .c-current-project__right"
  )?.textContent;
  if (!name) {
    return "Untitled";
  }

  return name;
};

export {
  listenForRightClick,
  modifyContextMenu,
  storeHighlightedRow,
  removeHighlightedRow,
  isRowIDHighlighted as isHighlighted,
  getProjectName,
  modifyItemRow,
  getRowIDColor,
};
