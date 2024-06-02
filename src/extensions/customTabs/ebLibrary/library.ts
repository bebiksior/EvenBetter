import { escapeHTML } from "../../../utils/escapeHtml";
import { PageOpenEvent } from "@bebiks/evenbetter-api/src/events/onPageOpen";
import { setActiveSidebarItem } from "../../../utils/sidebar";
import "./library.css";
import { getCaidoAPI } from "../../../utils/caidoapi";
import { getEvenBetterAPI } from "../../../utils/evenbetterapi";

interface Workflow {
  name: string;
  description: string;
  version: string;
  author: string;
  os: string;
  url: string;
}

const attachToWorkflowsNavigation = () => {
  const rootList = document.querySelector(".p-menubar-root-list");
  if (!rootList) return;

  if (rootList.querySelector("#workflows-library")) return;

  const navigationItem = rootList.children[0]?.cloneNode(true) as HTMLElement;
  navigationItem.id = "workflows-library";
  
  const span = navigationItem.querySelector("span");
  if (!span) return;

  span.textContent = "Library";
  navigationItem.querySelector("a")?.setAttribute("href", "#/workflows/library");
  navigationItem
    .querySelector(".c-workflows__item")?.setAttribute("data-is-active", "false");

  rootList.appendChild(navigationItem);
};

export const customLibraryTab = () => {
  const libraryBody = evenBetterLibraryTab();
  if (!libraryBody) return;

  getCaidoAPI().navigation.addPage("workflows/library", {
    body: libraryBody,
  });

  getEvenBetterAPI().eventManager.on("onPageOpen", (event: PageOpenEvent) => {
    if (
      event.newUrl.startsWith("#/workflows/") &&
      event.newUrl !== "#/workflows/library"
    ) {
      attachToWorkflowsNavigation();
    }
  });

  getEvenBetterAPI().eventManager.on("onPageOpen", (data: PageOpenEvent) => {
    setActiveSidebarItem(
      "Workflows",
      window.location.hash.startsWith("#/workflows/") ? "true" : "false"
    );
  });
};

export const evenBetterLibraryTab = () => {
  const libraryColumns = [
    { name: "Name", width: "20em" },
    { name: "Description", width: "30em" },
    { name: "Version", width: "7em" },
    { name: "Author", width: "11em" },
    { name: "OS", width: "10em" },
    { name: "Actions", width: "10em" },
  ];

  const evenBetterTab = document.createElement("div");
  evenBetterTab.id = "evenbetter-library";

  const communityWorkflows = document.createElement("div");
  communityWorkflows.classList.add("c-workflows__repository-link");
  communityWorkflows.style.padding = "0 var(--c-space-4)";
  communityWorkflows.innerHTML = `
    <a style="font-size: var(--c-font-size-100); display: flex; align-items: center; gap: var(--c-space-2); cursor: pointer;">
      <i class="c-icon fas fa-external-link"></i>Community Workflows
    </a>
  `;

  const navigationBar = getEvenBetterAPI().components.createNavigationBar({
    title: "Workflows",
    items: [
      {
        title: "Passive",
        url: "#/workflows/passive",
      },
      {
        title: "Active",
        url: "#/workflows/active",
      },
      {
        title: "Convert",
        url: "#/workflows/convert",
      },
      {
        title: "Library",
        url: "#/workflows/library",
      },
    ],
    customButtons: [communityWorkflows],
  });

  evenBetterTab.appendChild(navigationBar);

  const bodyContainer = document.createElement("div");
  bodyContainer.classList.add("c-evenbetter_library-body");

  const header = document.createElement("div");
  header.classList.add("c-evenbetter_library-header");

  const newWorkflowButton = getCaidoAPI().ui.button({
    label: "New workflow",
    leadingIcon: "fas fa-plus",
    variant: "primary",
  });

  newWorkflowButton.addEventListener("click", () => {
    getCaidoAPI().navigation.goTo("/workflows/convert/new");
  });

  header.appendChild(newWorkflowButton);

  const searchInputElement = getEvenBetterAPI().components.createTextInput(
    "fit-content",
    "Search...",
    false,
    "fa-search"
  );

  const libraryTable = getEvenBetterAPI().components.createTable({
    columns: libraryColumns,
  });

  const searchInput = searchInputElement.querySelector("input");
  if (!searchInput) return;

  searchInput.addEventListener("input", (event) => {
    const searchValue = (event.target as HTMLInputElement).value;
    libraryTable.filterRows(searchValue);
  });
  header.appendChild(searchInputElement);

  const content = document.createElement("div");
  content.classList.add("c-evenbetter_library-content");

  const evenBetterLibrary = document.createElement("div");
  evenBetterLibrary.classList.add("c-evenbetter_library");
  evenBetterLibrary.id = "evenbetter-library-content";

  content.appendChild(evenBetterLibrary);

  bodyContainer.appendChild(header);
  bodyContainer.appendChild(content);

  evenBetterTab.appendChild(bodyContainer);

  fetch(
    "https://raw.githubusercontent.com/bebiksior/EvenBetter/main/workflows/workflows.json?cache=" +
      new Date().getTime()
  ).then((response) => {
    response.json().then((data) => {
      data.workflows.forEach((plugin: Workflow) => {
        const actionsButton = document.createElement("div");
        actionsButton.innerHTML = `
          <div class="evenbetter-table-actions">
              <div class="evenbetter-table-actions__select">
                  <div class="c-evenbetter_button" data-plugin-url="${escapeHTML(
                    plugin.url
                  )}" data-size="small" data-block="true" data-variant="secondary" data-outline="true" data-plain="false" style="--9bad4558: center;">
                      <div class="formkit-outer" data-family="button" data-type="button" data-empty="true">
                          <div class="formkit-wrapper">
                              <button class="formkit-input c-evenbetter_button__input" type="button" name="button_82" id="input_83">
                                  <div class="c-evenbetter_button__label">
                                      Add
                                  </div>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>`;

        actionsButton.addEventListener("click", (event) => {
          const target = event.target as HTMLButtonElement;
          const url = target
            .closest(".c-evenbetter_button")?.getAttribute("data-plugin-url");
          
          if (!url) return;

          fetch(url).then((response) => {
            response.json().then((data) => {
              getCaidoAPI().graphql.createWorkflow({
                input: {
                  definition: {
                    ...data,
                  },
                  global: false,
                },
              });

              const label = actionsButton.querySelector(
                ".c-evenbetter_button__label"
              );
              if (!label) return;
              
              label.textContent = "Added";

              getEvenBetterAPI().toast.showToast({
                message: "Workflow added successfully!",
                type: "success",
                duration: 1500,
                position: "bottom",
              });

              setTimeout(() => {
                label.textContent = "Add";
              }, 1000);
            });
          });
        });

        libraryTable.addRow([
          { columnName: "Name", value: labelElement(plugin.name) },
          {
            columnName: "Description",
            value: labelElement(plugin.description),
          },
          {
            columnName: "Version",
            value: labelElement(plugin.version),
          },
          {
            columnName: "Author",
            value: labelElement(plugin.author),
          },
          {
            columnName: "OS",
            value: labelElement(plugin.os || "All"),
          },
          { columnName: "Actions", value: actionsButton },
        ]);
      });
    });
  });

  evenBetterLibrary.appendChild(libraryTable.getHTMLElement());

  return evenBetterTab;
};

const labelElement = (text: string) => {
  const label = document.createElement("div");
  label.textContent = text;
  return label;
};
