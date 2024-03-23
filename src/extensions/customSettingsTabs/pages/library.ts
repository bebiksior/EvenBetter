import { Table, addRow } from "../../../components/table";
import eventManagerInstance from "../../../events/EventManager";
import { PageOpenEvent } from '../../../events/onPageOpen';

interface Workflow {
  name: string;
  description: string;
  version: string;
  author: string;
  os: string;
  url: string;
}

export const evenBetterLibraryTab = () => {
  const libraryColumns = [
    { name: "Name", width: "20em", content: "Name" },
    { name: "Version", width: "7em", content: "Version" },
    { name: "Description", width: "40em", content: "Description" },
    { name: "Author", width: "10em", content: "Author" },
    { name: "OS", width: "10em", content: "Supported OS" },
    { name: "Actions", width: "10em", content: "Actions" },
  ];

  const evenBetterTab = document.createElement("div");
  evenBetterTab.innerHTML = createEvenBetterLibraryHTML();

  const libraryData: Map<string, HTMLElement>[] = [];
  const libraryTable = Table({ columns: libraryColumns, data: libraryData, height: "300px"});

  fetch(
    "https://raw.githubusercontent.com/bebiksior/EvenBetter/main/workflows/workflows.json?cache=" +
      new Date().getTime()
  ).then((response) => {
    response.json().then((data) => {
      data.workflows.forEach((plugin: Workflow) => {
        const actionsButton = document.createElement("div");
        actionsButton.innerHTML = `
          <div class="c-evenbetter_table-item-row__actions">
              <div class="c-evenbetter_item-row__select" data-onboarding="select-project">
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
            .closest(".c-evenbetter_button")
            .getAttribute("data-plugin-url");

          fetch(url).then((response) => {
            response.json().then((data) => {
              createWorkflow(data);
              incrementWorkflowCount();

              const label = actionsButton.querySelector(
                ".c-evenbetter_button__label"
              );
              label.textContent = "Added";

              setTimeout(() => {
                label.textContent = "Add";
              }, 1000);
            });
          });
        });

        addRow(
          libraryTable,
          libraryColumns,
          new Map([
            ["Name", labelElement(escapeHTML(plugin.name))],
            ["Version", labelElement(escapeHTML(plugin.version))],
            ["Description", labelElement(escapeHTML(plugin.description))],
            ["Author", labelElement(escapeHTML(plugin.author))],
            ["OS", labelElement(escapeHTML(plugin.os || "All"))],
            ["Actions", actionsButton],
          ])
        );
      });
    });
  });

  evenBetterTab
    .querySelector("#library .c-evenbetter_library_card-body")
    .appendChild(libraryTable);

  return evenBetterTab;
};

const labelElement = (text: string) => {
  const label = document.createElement("div");
  label.textContent = text;
  return label;
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

const createEvenBetterLibraryHTML = () => {
  const htmlContent = `
    <div class="c-evenbetter_library" id="evenbetter-library-content">
      <div class="c-evenbetter_library-table" id="library">
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
                  </div>
              </div>
          </div>
      </div>
      <p class="c-evenbetter_library-footer-text">Want to contribute? <a href="https://github.com/bebiksior/EvenBetter/pulls" target="_blank">Create a pull request</a></p>
    </div>`;

  return htmlContent;
};

const incrementWorkflowCount = () => {
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
      newCountLabel.classList.add("c-sidebar-item__count-label");
      newCountLabel.textContent = "1";
      countElement.appendChild(newCountLabel);
    }
  });
};

function escapeHTML(input: string) {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}