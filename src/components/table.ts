interface TableProps {
  columns: Column[];
  data: Map<string, HTMLElement>[];
  height: string;
}

interface Column {
  name: string;
  width: string;
}

const generateTableHTML = (height: string, columns: Column[]) => {
  const htmlContent = `
        <div class="c-evenbetter_table_card-body">
            <div class="c-evenbetter_table-container" data-is-empty="false" data-is-loading="false" style="overflow-y: auto;">
                <div class="c-evenbetter_table_header-row">
                    ${columns
                      .map((column) => {
                        return `<div class="c-evenbetter_table_header-cell" data-sortable="true" data-resizable="true" data-align="start" data-is-resizing="false" style="--1e00f3f4: 4rem; width: max(${column.width}, 56px);"><div class="c-evenbetter_header-cell_wrapper"><div class="c-evenbetter_header-cell_content">${column.name}</div></div></div>`;
                      })
                      .join("")}
                </div>
                <div class="c-table__wrapper" style="width: 100%; height: ${height}; margin-top: 0px;">
                </div>
            </div>
        </div>
  `;

  return htmlContent;
};

const generateItemRow = (columns: Column[], item: Map<string, HTMLElement>) => {
  const itemRow = document.createElement("div");
  itemRow.className = "c-evenbetter_table-item-row";

  columns.forEach((column) => {
    const cell = document.createElement("div");
    cell.className = "c-evenbetter_table-item-cell";
    cell.setAttribute("data-column-id", column.name);
    cell.setAttribute("data-align", "start");
    cell.style.setProperty("--d40e2d02", `max(${column.width}, 56px)`);
    const cellInner = document.createElement("div");
    cellInner.className = "c-evenbetter_table-item-cell__inner";
    cellInner.appendChild(item.get(column.name));
    cell.appendChild(cellInner);
    itemRow.appendChild(cell);
  });

  return itemRow;
};

export const Table = ({ columns, data, height }: TableProps) => {
  const table = document.createElement("div");
  table.className = "c-evenbetter_table";
  table.innerHTML = generateTableHTML(height, columns);

  const tableWrapper = table.querySelector(".c-table__wrapper");

  data.forEach((item) => {
    const itemRow = document.createElement("div");
    itemRow.className = "c-evenbetter_table_row";
    itemRow.appendChild(generateItemRow(columns, item));
    tableWrapper.appendChild(itemRow);
  });

  return table;
};

const refreshRows = (table: HTMLElement) => {
  const rows = table.querySelectorAll(".c-evenbetter_table_row");
  rows.forEach((row, index) => {
    row.setAttribute("data-is-even", index % 2 === 0 ? "true" : "false");
  });
}

export const addRow = (
  table: HTMLElement,
  columns: Column[],
  item: Map<string, HTMLElement>,
  onClick?: (item: Map<string, HTMLElement>) => void
) => {
  const tableWrapper = table.querySelector(".c-table__wrapper");
  const itemRow = document.createElement("div");
  itemRow.className = "c-evenbetter_table_row";
  itemRow.appendChild(generateItemRow(columns, item));
  if (onClick) {
    itemRow.addEventListener("click", () => {
      onClick(item);
    });
  }
  tableWrapper.appendChild(itemRow);

  refreshRows(table);
};

export const clearTable = (table: HTMLElement) => {
  const tableWrapper = table.querySelector(".c-table__wrapper");
  tableWrapper.innerHTML = "";
}