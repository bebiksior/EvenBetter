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
  navigationItem
    .querySelector("a")
    ?.setAttribute("href", "#/workflows/library");
  navigationItem
    .querySelector(".c-workflows__item")
    ?.setAttribute("data-is-active", "false");

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

const EXPANDED_SVG = `<button class="p-row-toggler p-link" type="button" aria-expanded="true" aria-controls="pv_id_10_0_expansion" aria-label="Row Expanded" data-pc-section="rowtoggler" data-pc-group-section="rowactionbutton"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon p-row-toggler-icon" aria-hidden="true" data-pc-section="rowtogglericon"><path d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z" fill="currentColor"></path></svg></button>`;
const COLLAPSED_SVG = `<svg width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon p-row-toggler-icon" aria-hidden="true" data-pc-section="rowtogglericon" viewbox="0 0 14 14"><path d="M4.38708 13C4.28408 13.0005 4.18203 12.9804 4.08691 12.9409C3.99178 12.9014 3.9055 12.8433 3.83313 12.7701C3.68634 12.6231 3.60388 12.4238 3.60388 12.2161C3.60388 12.0084 3.68634 11.8091 3.83313 11.6622L8.50507 6.99022L3.83313 2.31827C3.69467 2.16968 3.61928 1.97313 3.62287 1.77005C3.62645 1.56698 3.70872 1.37322 3.85234 1.22959C3.99596 1.08597 4.18972 1.00371 4.3928 1.00012C4.59588 0.996539 4.79242 1.07192 4.94102 1.21039L10.1669 6.43628C10.3137 6.58325 10.3962 6.78249 10.3962 6.99022C10.3962 7.19795 10.3137 7.39718 10.1669 7.54416L4.94102 12.7701C4.86865 12.8433 4.78237 12.9014 4.68724 12.9409C4.59212 12.9804 4.49007 13.0005 4.38708 13Z" fill="currentColor"></path></svg>`;

const expandArrowElement = (workflow: Workflow) => {
  const button = document.createElement("button");

  button.classList.add("p-row-toggler", "p-link");
  button.innerHTML = COLLAPSED_SVG;

  let isExpanded = false;
  const toggleArrow = () => {
    isExpanded = !isExpanded;
    button.innerHTML = isExpanded ? EXPANDED_SVG : COLLAPSED_SVG;
  };

  button.addEventListener("click", (event) => {
    event.preventDefault();

    if (isExpanded) {
      const target = event.target as HTMLElement;
      const tr = target.closest("tr");
      if (tr) {
        tr.nextElementSibling?.remove();
        toggleArrow();
      }
    } else {
      const target = event.target as HTMLElement;
      const tr = target.closest("tr");
      if (tr) {
        tr.after(workflowExpandElement(workflow));
        toggleArrow();
      }
    }
  });

  return button;
};

const workflowExpandElement = (workflow: Workflow) => {
  const tr = document.createElement("tr");
  tr.className = "p-datatable-row-expansion";
  tr.setAttribute("role", "row");
  tr.setAttribute("data-pc-section", "rowexpansion");

  const td = document.createElement("td");
  td.colSpan = 7;
  td.setAttribute("data-pc-section", "rowexpansioncell");

  const divTableExpansion = document.createElement("div");
  divTableExpansion.className = "c-table-expansion";

  const divMeta = document.createElement("div");
  divMeta.className = "c-table-expansion__meta";

  const h3Website = document.createElement("h3");
  h3Website.textContent = "URL";

  const aWebsite = document.createElement("a") as HTMLAnchorElement;
  aWebsite.href = workflow.url;
  aWebsite.textContent = workflow.url;

  const h3Description = document.createElement("h3");
  h3Description.textContent = "Description";

  const pDescription = document.createElement("p");
  pDescription.textContent = workflow.description;

  const h3Author = document.createElement("h3");
  h3Author.textContent = "Author";

  const pAuthor = document.createElement("p");
  pAuthor.textContent = workflow.author;

  aWebsite.addEventListener("click", (event) => {
    event.preventDefault();

    getEvenBetterAPI().helpers.openInBrowser(workflow.url);
  });

  divMeta.appendChild(h3Website);
  divMeta.appendChild(aWebsite);

  divMeta.appendChild(h3Description);
  divMeta.appendChild(pDescription);

  divMeta.appendChild(h3Author);
  divMeta.appendChild(pAuthor);

  const divWorkflows = document.createElement("div");
  divWorkflows.className = "c-table-expansion__workflows";

  divTableExpansion.appendChild(divMeta);
  divTableExpansion.appendChild(divWorkflows);
  td.appendChild(divTableExpansion);
  tr.appendChild(td);

  return tr;
};

export const evenBetterLibraryTab = () => {
  const libraryColumns = [
    { name: "", width: "3em" },
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

  const addAllButton = getCaidoAPI().ui.button({
    label: "Add all",
    leadingIcon: "fas fa-plus",
    variant: "secondary",
    size: "small",
  });

  addAllButton.addEventListener("click", () => {
    const buttons = document.querySelectorAll(
      ".c-evenbetter_button__input"
    ) as NodeListOf<HTMLButtonElement>;

    buttons.forEach((button) => {
      button.click();
    });
  });

  const leftDiv = document.createElement("div");
  leftDiv.id = "evenbetter_library-left";
  const rightDiv = document.createElement("div");
  rightDiv.id = "evenbetter_library-right";

  leftDiv.appendChild(newWorkflowButton);
  leftDiv.appendChild(searchInputElement);
  rightDiv.appendChild(addAllButton);

  header.appendChild(leftDiv);
  header.appendChild(rightDiv);

  const content = document.createElement("div");
  content.classList.add("c-evenbetter_library-content");

  const evenBetterLibrary = document.createElement("div");
  evenBetterLibrary.classList.add("c-evenbetter_library");
  evenBetterLibrary.id = "evenbetter-library-content";

  content.appendChild(evenBetterLibrary);

  bodyContainer.appendChild(header);
  bodyContainer.appendChild(content);

  evenBetterTab.appendChild(bodyContainer);

  fetchWorkflows().then((workflows) => {
    workflows.forEach((workflow) => {
      const addButton = generateAddButton(workflow);

      addButton.addEventListener("click", async (event) => {
        const target = event.target as HTMLButtonElement;
        const url = target
          .closest(".c-evenbetter_button")
          ?.getAttribute("data-workflow-url");

        if (!url) return;

        await addWorkflow(workflow);

        const label = addButton.querySelector(
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

      libraryTable.addRow([
        { columnName: "", value: expandArrowElement(workflow) },
        { columnName: "Name", value: workflow.name },
        {
          columnName: "Description",
          value: workflow.description,
        },
        {
          columnName: "Version",
          value: workflow.version,
        },
        {
          columnName: "Author",
          value: workflow.author,
        },
        {
          columnName: "OS",
          value: workflow.os || "All",
        },
        { columnName: "Actions", value: addButton },
      ]);
    });
  });

  evenBetterLibrary.appendChild(libraryTable.getHTMLElement());

  return evenBetterTab;
};

const generateAddButton = (workflow: Workflow) => {
  const actionsButton = document.createElement("div");
  actionsButton.innerHTML = `
          <div class="evenbetter-table-actions">
              <div class="evenbetter-table-actions__select">
                  <div class="c-evenbetter_button" data-workflow-url="${escapeHTML(
                    workflow.url
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

  return actionsButton;
};

const fetchWorkflows = async (): Promise<Workflow[]> => {
  const response = await fetch(
    "https://raw.githubusercontent.com/bebiksior/EvenBetter/main/workflows/workflows.json?cache=" +
      new Date().getTime()
  );
  const data = await response.json();
  return data.workflows;
};

const addWorkflow = async (workflow: Workflow) => {
  const rawWorkflow = await fetch(workflow.url).then((response) =>
    response.json()
  );

  getCaidoAPI().graphql.createWorkflow({
    input: {
      definition: {
        ...rawWorkflow,
      },
      global: false,
    },
  });
};
