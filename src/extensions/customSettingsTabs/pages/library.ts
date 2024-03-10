import eventManagerInstance from "../../../events/EventManager";

interface Workflow {
  name: string;
  description: string;
  version: string;
  author: string;
  url: string;
}

export const evenBetterLibraryTab = () => {
  const evenBetterTab = document.createElement("div");
  evenBetterTab.innerHTML = createEvenBetterLibraryHTML();
  evenBetterTab.classList.add("evenbetter-custom-tab");

  fetch(
    "https://raw.githubusercontent.com/bebiksior/EvenBetter/main/workflows/workflows.json?cache=" +
      new Date().getTime()
  ).then((response) => {
    response.json().then((data) => {
      data.workflows.forEach((plugin: Workflow) => {
        evenBetterTab
          .querySelector(".c-table__wrapper")
          .appendChild(createLibraryPluginElement(plugin));
      });
    });
  });
  
  return evenBetterTab;
};

const createWorkflow = (data: any) => {
  const payload = {
    operationName: "createWorkflow",
    query: `mutation createWorkflow($input: CreateWorkflowInput!) { \n createWorkflow(input: $input) { \n error { \n ... on WorkflowUserError { \n ...workflowUserErrorFull \n } \n ... on OtherUserError { \n ...otherUserErrorFull \n } \n } \n workflow { \n ...workflowFull \n } \n } \n} \nfragment workflowUserErrorFull on WorkflowUserError { \n ...userErrorFull \n nodeId \n message \n reason \n} \nfragment userErrorFull on UserError { \n __typename \n code \n} \nfragment otherUserErrorFull on OtherUserError { \n ...userErrorFull \n} \nfragment workflowFull on Workflow { \n __typename \n id \n kind \n name \n definition \n}`,
    variables: {
      input: {
        definition: {
          ...data,
        },
      },
    },
  };

  fetch(document.location.origin + "/graphql", {
    body: JSON.stringify(payload),
    method: "POST",
    headers: {
      Authorization:
        "Bearer " +
        JSON.parse(localStorage.getItem("CAIDO_AUTHENTICATION")).accessToken,
    },
  });
};

const createLibraryPluginElement = (plugin: Workflow) => {
  const evenBetterPlugin = document.createElement("div");
  evenBetterPlugin.classList.add("c-evenbetter_table-item-row");
  evenBetterPlugin.innerHTML = `
            <div class="c-evenbetter_item-row" data-is-selected="true">
                <div class="c-evenbetter_table-item-cell" data-column-id="name" data-align="start" style="--d40e2d02: max(20em, 56px);">
                    <div class="c-evenbetter_table-item-cell__inner">
                        <div class="c-evenbetter_table-item-row__name">
                            <div class="c-item-row__label">${sanitizeInput(
                              plugin.name
                            )}</div>
                        </div>
                    </div>
                </div>
                <div class="c-evenbetter_table-item-cell" data-column-id="version" data-align="start" style="--d40e2d02: max(7em, 56px);">
                    <div class="c-evenbetter_table-item-cell__inner">v${sanitizeInput(
                      plugin.version
                    )}</div>
                </div>
                <div class="c-evenbetter_table-item-cell" data-column-id="description" data-align="start" style="--d40e2d02: max(40em, 56px);">
                    <div class="c-evenbetter_table-item-cell__inner">${sanitizeInput(
                      plugin.description
                    )}
                    </div>
                </div>
                <div class="c-evenbetter_table-item-cell" data-column-id="author" data-align="start" style="--d40e2d02: max(10em, 56px);">
                    <div class="c-evenbetter_table-item-cell__inner">${sanitizeInput(
                      plugin.author
                    )}
                    </div>
                </div>
                <div class="c-evenbetter_table-item-cell" data-column-id="actions" data-align="start" style="--d40e2d02: max(10em, 56px);">
                    <div class="c-evenbetter_table-item-cell__inner">
                        <div class="c-evenbetter_table-item-row__actions">
                            <div class="c-evenbetter_item-row__select" data-onboarding="select-project">
                                <div class="c-evenbetter_button" data-plugin-url="${sanitizeInput(
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
                        </div>    
                    </div>
                </div>
            </div>
    `;

  evenBetterPlugin
    .querySelectorAll(".c-evenbetter_button__input")
    .forEach((element) => {
      element.addEventListener("click", (event) => {
        const target = event.target as HTMLButtonElement;
        const url = target
          .closest(".c-evenbetter_button")
          .getAttribute("data-plugin-url");

        fetch(url).then((response) => {
          response.json().then((data) => {
            createWorkflow(data);
            showWorkflowCount();

            const label = element.querySelector(".c-evenbetter_button__label");
            label.textContent = "Added";

            setTimeout(() => {
              label.textContent = "Add";
            }, 1000);
          });
        });
      });
    });

  return evenBetterPlugin;
};

const showWorkflowCount = () => {
  document.querySelectorAll(".c-sidebar-item__content").forEach((element) => {
    if (element.textContent != "Workflows") return;

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
      newCountLabel.setAttribute("data-v-d4548a6d", "");
      newCountLabel.classList.add("c-sidebar-item__count-label");
      newCountLabel.textContent = "1";
      countElement.appendChild(newCountLabel);
    }
  });
};

const createEvenBetterLibraryHTML = () => {
  const htmlContent = `
    <div class="c-evenbetter_library" id="evenbetter-library-content">
        <div class="c-evenbetter_library-table">
            <div class="c-evenbetter_table" tabindex="-1" style="--5b42590e: 42px;">
                <div class="c-evenbetter_library_card" style="--6ac6656c: 0.25em; --7a039a1d: 0.25em; --9309e9b0: 0.25em; --09ed17ff: 0.25em;">
                    <header>
                        <div class="header-title">
                            <h1>EvenBetter - Library</h1>
                        </div>
                        <div class="header-description">
                            Install workflows into your Caido project with a single click
                        </div>
                    </header>
                    <div class="c-evenbetter_library_card-body">
                        <div class="c-evenbetter_table_card-body">
                            <div class="c-evenbetter_table-container" data-is-empty="false" data-is-loading="false" style="overflow-y: auto;">
                                <div class="c-evenbetter_table_header-row">
                                    <div class="c-evenbetter_table_header-cell" data-sortable="true" data-resizable="true" data-align="start" data-is-resizing="false" style="--1e00f3f4: 4rem; width: max(20em, 56px);">
                                        <div class="c-evenbetter_header-cell_wrapper">
                                            <div class="c-evenbetter_header-cell_content">Name</div>
                                        </div>
                                    </div><div class="c-evenbetter_table_header-cell" data-sortable="false" data-resizable="true" data-align="start" data-is-resizing="false" style="--1e00f3f4: 4rem; width: max(7em, 56px);">
                                        <div class="c-evenbetter_header-cell_wrapper">
                                            <div class="c-evenbetter_header-cell_content">Version</div>
                                        </div>
                                    </div><div class="c-evenbetter_table_header-cell" data-sortable="true" data-resizable="true" data-align="start" data-is-resizing="false" style="--1e00f3f4: 4rem; width: max(40em, 56px);">
                                        <div class="c-evenbetter_header-cell_wrapper">
                                            <div class="c-evenbetter_header-cell_content">
                                                Description
                                            </div>
                                        </div>
                                    </div><div class="c-evenbetter_table_header-cell" data-sortable="true" data-resizable="true" data-align="start" data-is-resizing="false" style="--1e00f3f4: 4rem; width: max(10em, 56px);">
                                        <div class="c-evenbetter_header-cell_wrapper">
                                            <div class="c-evenbetter_header-cell_content">
                                                Author
                                            </div>
                                        </div>
                                    </div><div class="c-evenbetter_table_header-cell" data-sortable="false" data-resizable="false" data-align="start" style="--1e00f3f4: 4rem; width: max(10em, 56px);">
                                        <div class="c-evenbetter_header-cell_wrapper">
                                            <div class="c-evenbetter_header-cell_content">Actions</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="c-table__wrapper" style="width: 100%; height: 250px; margin-top: 0px;">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <p class="c-evenbetter_library-footer-text">Want to contribute? <a href="https://github.com/bebiksior/EvenBetter/pulls" target="_blank">Create a pull request</a></p>
    </div>
    `;

  return htmlContent;
};

function sanitizeInput(input: string) {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
