import { addRow, clearTable, Table } from "../../components/table";
import eventManagerInstance from "../../events/EventManager";
import { PageOpenEvent } from "../../events/onPageOpen";
import { getSetting, setSetting } from "../../settings";
import { openModal } from "../../utils/Modal";
import { poll, register } from "./interactsh";

const CA_SSRF_INSTANCE_API_URL =
  "https://api.cvssadvisor.com/ssrf/api/instance";

declare const Caido: any;

interface SSRFInstance {
  id: string;
  url: string;

  privateKey?: CryptoKey;
  secretKey?: string;
}

export let ssrfInstance: SSRFInstance | null = null;

export const registerPage = () => {
  const ssrfPageContent = quickSSRFPage();
  Caido.navigation.addPage("/evenbetter/quick-ssrf", {
    body: ssrfPageContent,
  });

  Caido.sidebar.registerItem("Quick SSRF", "/evenbetter/quick-ssrf", {
    icon: "fas fa-compass",
    group: "EvenBetter",
  });
};

const headerHTML = () => {
  return `<header>
              <div class="header-left">
                <div class="header-title">
                    <h1>EvenBetter - Quick SSRF</h1>
                </div>
                <div class="header-description">
                    Quickly generate a unique SSRF instance for testing SSRF vulnerabilities
                </div>
              </div>
              <div class="header-right">
                <div class="evenbetter_quick-ssrf_switch">
                  <select>
                    <option value="ssrf.cvssadvisor.com">ssrf.cvssadvisor.com</option>
                    <option value="interactsh.com">interactsh.com</option>
                  </select>
                  <div class="evenbetter_quick-ssrf_button">
                    <i class="fas fa-sync-alt"></i>
                  </div>
                </div>
                <div class="evenbetter_quick-ssrf_copy">
                  <div class="c-text-input">
                    <div class="c-text-input__outer">
                      <div class="c-text-input__inner">
                        <input
                          spellcheck="false"
                          disabled
                          placeholder="N/A"
                          class="c-text-input__input ssrf-instance-url"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="evenbetter_quick-ssrf_button">
                    <i class="fas fa-copy" id="copy-ssrf-instance"></i>
                  </div>
                </div>
              </div>
            </header>`;
};

const quickSSRFPage = () => {
  const page = document.createElement("div");
  page.className = "c-evenbetter_quick-ssrf";

  page.innerHTML = `
      <div class="c-evenbetter_quick-ssrf">
        ${headerHTML()}
        <div class="divider"></div>
        <div class="c-evenbetter_quick-ssrf__content"></div>
      </div>
    `;

  const ssrfInstanceInput = page.querySelector(
    ".c-text-input__input"
  ) as HTMLInputElement;

  const tableColumns = [
    { name: "ID", width: "9em", content: "ID" },
    { name: "Time", width: "15em", content: "Time" },
    { name: "Type", width: "5em", content: "Type" },
    { name: "Request", width: "30em", content: "Request" },
    { name: "Source IP", width: "10em", content: "Source IP" },
  ];

  const data: Map<string, HTMLElement>[] = [];
  const table = Table({ columns: tableColumns, data, height: "65vh" });
  page.querySelector(".c-evenbetter_quick-ssrf__content")?.appendChild(table);

  const selectedTool = getSetting("ssrfInstanceTool");
  (
    page.querySelector(
      ".evenbetter_quick-ssrf_switch select"
    ) as HTMLSelectElement
  ).value = selectedTool;

  const copyIcon = page.querySelector(".fa-copy");
  copyIcon.parentElement.addEventListener("click", () => {
    const text = ssrfInstanceInput.value;
    navigator.clipboard.writeText(text);
  });

  const select = page.querySelector(
    ".evenbetter_quick-ssrf_switch select"
  ) as HTMLSelectElement;
  select.addEventListener("change", () => {
    refreshSSRFInstance(table, ssrfInstanceInput);
  });

  const refreshIcon = page.querySelector(".fa-sync-alt");
  refreshIcon.parentElement.addEventListener("click", () => {
    refreshSSRFInstance(table, ssrfInstanceInput);
  });

  refreshSSRFInstance(table, ssrfInstanceInput).then(() =>
    updateDataInterval(table, tableColumns, true)
  );

  return page;
};

let addedIDs: string[] = [];
const updateDataInterval = (table: HTMLElement, tableColumns: any, startTimeoutLoop?: boolean) => {
  const addRequest = (request: Request) => {
    if (window.location.hash !== "#/evenbetter/quick-ssrf")
      incrementHitsCount();

    addRow(
      table,
      tableColumns,
      new Map([
        ["ID", labelElement(request.id)],
        ["Time", labelElement(new Date(request.timestamp).toLocaleString())],
        ["Type", labelElement(request.protocol)],
        ["Request", labelElement(request.dump)],
        ["Source IP", labelElement(request.ip)],
      ]),
      () => {
        openModal({
          title: "Request",
          content: requestDumpToHTML(request),
        });
      }
    );
  };

  switch (getSelectedSSRFTool()) {
    case "ssrf.cvssadvisor.com":
      fetch(CA_SSRF_INSTANCE_API_URL + "/" + ssrfInstance.id)
        .then((response) => response.json())
        .then((data) => {
          const requestsHistory = data.requests_history;
          if (!requestsHistory || requestsHistory?.length === 0) return;

          requestsHistory.forEach((request: Request) => {
            if (addedIDs.includes(request.id)) return;

            request.timestamp = request.timestamp * 1000;
            addRequest(request);

            addedIDs.push(request.id);
          });
        });
      break;
    case "interactsh.com":
      poll(
        ssrfInstance.secretKey,
        ssrfInstance.id,
        ssrfInstance.privateKey
      ).then((data) => {
        if (!data || !data.decodedData) return;

        data.decodedData.forEach((item) => {
          const request: Request = {
            id: item.uniqueId,
            protocol: item.protocol.toUpperCase(),
            dump: item.rawRequest,
            ip: item.remoteAddress,
            timestamp: new Date(item.timestamp).getTime(),
          };

          addRequest(request);
        });
      });
      break;
  }

  if (startTimeoutLoop) {
    const nextExecutionTime =
      window.location.hash === "#/evenbetter/quick-ssrf" ? 1500 : 8000;

    setTimeout(() => updateDataInterval(table, tableColumns, true), nextExecutionTime);
  }

  eventManagerInstance.on("onPageOpen", (data: PageOpenEvent) => {
    if (data.newUrl === "#/evenbetter/quick-ssrf") {
      updateDataInterval(table, tableColumns);
    }
  });
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
  label.textContent = text;
  return label;
};

const refreshSSRFInstance = async (
  table: HTMLElement,
  ssrfInstanceInput: HTMLInputElement
) => {
  clearTable(table);
  const selectedTool = getSelectedSSRFTool();

  switch (selectedTool) {
    case "ssrf.cvssadvisor.com":
      ssrfInstanceInput.value = "Creating...";
      return fetch(CA_SSRF_INSTANCE_API_URL, {
        method: "POST",
      })
        .then((response) => response.json())
        .then((data) => {
          ssrfInstance = { id: data, url: data + ".c5.rs" };
          ssrfInstanceInput.value = ssrfInstance.url;
          clearTable(table);
          addedIDs = [];

          setSetting("ssrfInstanceTool", selectedTool);
          setSetting("ssrfInstanceHostname", ssrfInstance.url);
        });
    case "interactsh.com":
      ssrfInstanceInput.value = "Creating...";
      return register().then((data) => {
        if (data.responseStatusCode !== 200) {
          openModal({
            title: "Error",
            content: "Failed to create interactsh instance",
          });

          return;
        }

        ssrfInstance = {
          id: data.correlationId,
          url: data.hostname,
          secretKey: data.secretKey,
          privateKey: data.privateKey,
        };
        ssrfInstanceInput.value = ssrfInstance.url;

        setSetting("ssrfInstanceTool", selectedTool);
        setSetting("ssrfInstanceHostname", ssrfInstance.url);
      });
  }
};

const requestDumpToHTML = (request: Request) => {
  if (request.protocol !== "HTTP") return request.dump.split("\n").join("<br>");

  const dumpLines = request.dump.split("\n");
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
      methodElement.textContent = method + " ";

      const urlElement = document.createElement("span");
      urlElement.classList.add("http_url");
      urlElement.textContent = url + " ";

      const httpVersionElement = document.createElement("span");
      httpVersionElement.classList.add("http_version");
      httpVersionElement.textContent = httpVersion;

      lineElement.appendChild(methodElement);
      lineElement.appendChild(urlElement);
      lineElement.appendChild(httpVersionElement);
    }

    if (isHeaders) {
      if (line.includes(":")) {
        const [key, value] = line.split(":");
        const keyElement = document.createElement("span");
        keyElement.classList.add("http_header-key");
        keyElement.textContent = key + ":";

        const valueElement = document.createElement("span");
        valueElement.classList.add("http_header-value");
        valueElement.textContent = value;

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

interface Request {
  id: string;
  protocol: string;
  dump: string;
  ip: string;
  timestamp: number;
}

const getSelectedSSRFTool = () => {
  const select = document.querySelector(
    ".evenbetter_quick-ssrf_switch select"
  ) as HTMLSelectElement;

  if (!select) return getSetting("ssrfInstanceTool");

  return select.value;
};
