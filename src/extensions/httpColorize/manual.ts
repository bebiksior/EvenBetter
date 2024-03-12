import eventManagerInstance from "../../events/EventManager";

export const highlightHTTPRow = () => {
  eventManagerInstance.on("onContextMenuOpen", (element) => {
    if (window.location.hash != "#/intercept") return;

    const activeRequestID = getActiveRequestID();
    if (!activeRequestID) return;

    modifyContextMenu(activeRequestID);
  });
};

const getActiveRequestID = () => {
  const selectedRequest = document.querySelector(
    ".c-item-row__overlay"
  ).parentElement;

  if (!selectedRequest) {
    return null;
  }

  const requestID = selectedRequest.querySelector("div[data-column-id=ID]");
  return requestID?.textContent;
};

const getRowElementByID = (rowID: string): HTMLElement | null => {
  const items = document.querySelectorAll(
    `.c-item-row .c-item-cell[data-column-id='ID']`
  );

  for (let i = 0; i < items.length; i++) {
    if (items[i].textContent === rowID) {
      return items[i].closest(".c-item-row");
    }
  }
};

const modifyContextMenu = (rowID: string) => {
  const contextMenu = document.querySelector(".c-menu");
  const contextItems = contextMenu.querySelectorAll(".c-item");
  const contextDividers = contextMenu.querySelectorAll(".c-divider");

  if (!contextMenu || !contextItems || !contextDividers) return;

  const row = getRowElementByID(rowID);
  if (!row) return;

  const clonedDivider = contextDividers[0].cloneNode(true);
  contextMenu.insertBefore(clonedDivider, contextItems[contextItems.length]);

  const highlightRowMenu = contextMenu
    .querySelector(".fa-caret-right")
    .parentElement.parentElement.cloneNode(true) as HTMLElement;

  highlightRowMenu.querySelector(".c-item__content").textContent =
    "Highlight row";

  highlightRowMenu.querySelector(".c-item__menu").outerHTML = `
        <div class="evenbetter__c-item__menu">
          <div class="evenbetter__c-menu">
            <div
              class="evenbetter__c-item"
            >
              <div class="evenbetter__c-item__content">None</div>
            </div>
            <div
              class="evenbetter__c-item"
            >
              <div class="evenbetter__c-item__content">Red</div>
            </div>
            <div
              class="evenbetter__c-item"
            >
              <div class="evenbetter__c-item__content">Green</div>
            </div>
            <div
              class="evenbetter__c-item"
            >
              <div class="evenbetter__c-item__content">Blue</div>
            </div>
            <div
              class="evenbetter__c-item"
            >
              <div class="evenbetter__c-item__content">Orange</div>
            </div>
          </div>
        </div>
      `;
  highlightRowMenu.id = "highlightRowMenu";

  const cItemMenu = highlightRowMenu.querySelector(
    ".evenbetter__c-item__menu"
  ) as HTMLElement;
  cItemMenu.style.display = "none";

  highlightRowMenu
    .querySelectorAll(".evenbetter__c-item")
    .forEach((item: HTMLElement) => {
      let color = item.querySelector(
        ".evenbetter__c-item__content"
      ).textContent;

      item.style.paddingLeft = "0.35rem";
      item.style.borderRadius = "0";

      if (color !== "None") {
        item.style.borderLeft = "3px solid";
        item.style.borderLeftColor = color;
      }
    });

  highlightRowMenu.addEventListener("mouseenter", () => {
    cItemMenu.style.display = "block";
    cItemMenu.style.left = "14em";
    cItemMenu.style.top = "220px";

    if (cItemMenu.getBoundingClientRect().right + 100 > window.innerWidth) {
      cItemMenu.style.left = "-6rem";
    }
  });

  contextItems.forEach((item) =>
    item.addEventListener("mouseenter", closeCustomContextMenu)
  );

  highlightRowMenu.querySelectorAll(".evenbetter__c-item").forEach((color) => {
    color.addEventListener("click", () => {
      let colorText = color.querySelector(
        ".evenbetter__c-item__content"
      ).textContent;

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
    (
      highlightRowMenu.querySelector(".evenbetter__c-item__menu") as HTMLElement
    ).style.display = "none";
  }
};

const storeHighlightedRow = (rowID: string, color: string) => {
  const highlightedRows =
    JSON.parse(localStorage.getItem(getProjectName() + ".highlightedRows")) ||
    {};

  highlightedRows[rowID] = color;

  localStorage.setItem(
    getProjectName() + ".highlightedRows",
    JSON.stringify(highlightedRows)
  );
};

const removeHighlightedRow = (rowID: string) => {
  const highlightedRows =
    JSON.parse(localStorage.getItem(getProjectName() + ".highlightedRows")) ||
    {};

  delete highlightedRows[rowID];

  localStorage.setItem(
    getProjectName() + ".highlightedRows",
    JSON.stringify(highlightedRows)
  );
};

export const isRowIDHighlighted = (rowID: string) => {
  const highlightedRows =
    JSON.parse(localStorage.getItem(getProjectName() + ".highlightedRows")) ||
    {};

  return highlightedRows[rowID] !== undefined;
};

export const getRowIDColor = (rowID: string) => {
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
