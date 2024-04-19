import EvenBetterAPI from "@bebiks/evenbetter-api";
import { escapeHTML } from "../../../utils/escapeHtml";
import { Request } from "../../events/onSSRFHit";
import reqHistoryCSS from "./reqHistory.css";
import loadCSS from "@bebiks/evenbetter-api/src/css";
import { navigationBar } from "../navigation/navigation";
import { TableAPI } from "@bebiks/evenbetter-api/src/components/table";

export let ssrfHitsTable: TableAPI;
export const reqHistoryPage = () => {
  loadCSS({
    id: "eb-quickssrf-reqhistory",
    cssText: reqHistoryCSS.toString(),
  });

  const pageContainer = document.createElement("div");
  pageContainer.className = "c-evenbetter_quick-ssrf";

  const pageContent = document.createElement("div");
  pageContent.className = "c-evenbetter_quick-ssrf__content";

  const navigation = navigationBar();
  pageContainer.appendChild(navigation);

  const tableColumns = [
    { name: "ID", width: "9em" },
    { name: "Time", width: "15em" },
    { name: "Type", width: "5em" },
    { name: "Request", width: "40em" },
    { name: "Source IP", width: "10em" },
  ];

  const table = EvenBetterAPI.components.createTable({
    columns: tableColumns,
    tableHeight: "100%",
  });
  ssrfHitsTable = table;

  EvenBetterAPI.eventManager.on("onSSRFHit", (request: Request) => {
    if (!window.location.hash.startsWith("#/evenbetter/quick-ssrf"))
      incrementHitsCount();

    ssrfHitsTable.addRow(
      [
        { columnName: "ID", value: labelElement(request.id) },
        {
          columnName: "Time",
          value: labelElement(new Date(request.timestamp).toLocaleString()),
        },
        { columnName: "Type", value: labelElement(request.protocol) },
        { columnName: "Request", value: labelElement(request.dump) },
        { columnName: "Source IP", value: labelElement(request.ip) },
      ],
      () => {
        EvenBetterAPI.modal.openModal({
          title: "Request",
          content: requestDumpToHTML(request),
        });
      }
    );
  });

  pageContent.appendChild(table.getHTMLElement());
  pageContainer.appendChild(pageContent);

  return pageContainer;
};

const incrementHitsCount = () => {
  document.querySelectorAll(".c-sidebar-item__content").forEach((element) => {
    if (element.textContent != "Quick SSRF") return;

    let countElement = element.parentNode.querySelector(
      ".c-sidebar-item__count"
    );
    let countLabel = countElement.querySelector(
      ".c-sidebar-item__count-label"
    ) as HTMLElement;

    if (countLabel) {
      countLabel.textContent = String(parseInt(countLabel.textContent) + 1);
    } else {
      let newCountLabel = document.createElement("div");
      newCountLabel.classList.add("c-sidebar-item__count-label");
      newCountLabel.textContent = "1";
      countElement.appendChild(newCountLabel);
    }
  });
};

const labelElement = (text: string) => {
  const label = document.createElement("div");
  label.innerHTML = escapeHTML(text);
  return label;
};

const requestDumpToHTML = (request: Request) => {
  const escapedDump = escapeHTML(request.dump);
  if (request.protocol !== "HTTP") return escapedDump.split("\n").join("<br>");

  const dumpLines = escapedDump.split("\n");
  const dumpHTML = document.createElement("div");

  let isHeaders = true;
  dumpLines.forEach((line, index) => {
    const lineElement = document.createElement("div");

    if (isHeaders && line.trim() === "") {
      isHeaders = false;
    }

    if (index === 0) {
      const method = line.split(" ")[0];
      const url = line.split(" ")[1];
      const httpVersion = line.split(" ")[2];

      const methodElement = document.createElement("span");
      methodElement.classList.add("http_method");
      methodElement.innerHTML = method + " ";

      const urlElement = document.createElement("span");
      urlElement.classList.add("http_url");
      urlElement.innerHTML = url + " ";

      const httpVersionElement = document.createElement("span");
      httpVersionElement.classList.add("http_version");
      httpVersionElement.innerHTML = httpVersion;

      lineElement.appendChild(methodElement);
      lineElement.appendChild(urlElement);
      lineElement.appendChild(httpVersionElement);
    }

    if (isHeaders) {
      if (line.includes(":")) {
        const [key, value] = line.split(":");
        const keyElement = document.createElement("span");
        keyElement.classList.add("http_header-key");
        keyElement.innerHTML = key + ":";

        const valueElement = document.createElement("span");
        valueElement.classList.add("http_header-value");
        valueElement.innerHTML = value;

        lineElement.appendChild(keyElement);
        lineElement.appendChild(valueElement);
      }
    } else {
      lineElement.innerHTML = line.split("\\n").join("<br>");
      lineElement.classList.add("http_body");

      if (
        lineElement.textContent == "\r" ||
        lineElement.textContent == "" ||
        lineElement.textContent == "\n"
      )
        lineElement.style.margin = "5px";
    }

    dumpHTML.appendChild(lineElement);
  });

  return dumpHTML.outerHTML;
};
