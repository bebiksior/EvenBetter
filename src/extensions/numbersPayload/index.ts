import { getEvenBetterAPI } from "../../utils/evenbetterapi";
import { PageOpenEvent } from "@bebiks/evenbetter-api/src/events/onPageOpen";
import { getCaidoAPI } from "../../utils/caidoapi";

let numbersContainer: HTMLElement;

export const numbersPayload = () => {
  getEvenBetterAPI().eventManager.on("onPageOpen", (event: PageOpenEvent) => {
    if (event.newUrl === "#/automate") {
      setTimeout(() => {
        observeSelectedSession();
      }, 100);
    }
  });

  getCaidoAPI().commandPalette.register("evenbetter:numbersPayload");
};

let selectedSessionObserver: MutationObserver;
const observeSelectedSession = () => {
  if (selectedSessionObserver) selectedSessionObserver.disconnect();

  const selectedSession = document.querySelector(
    ".p-tabview-panels"
  )?.parentElement;
  if (!selectedSession) return;

  selectedSessionObserver = new MutationObserver(() => {
    if (document.querySelector(".c-empty-state__body-content")) return;

    attachNumbersPayload();
    observeDropdown();
  });
  selectedSessionObserver.observe(selectedSession, {
    attributes: true,
    subtree: true,
  });
};

let dropdownObserver: MutationObserver;
const observeDropdown = () => {
  if (dropdownObserver) dropdownObserver.disconnect();

  const dropdownValue = document.querySelector(
    ".c-payload-settings__body .c-kind-dropdown .p-inputtext"
  )?.textContent;

  if (dropdownValue && numbersContainer)
    numbersContainer.style.display =
      dropdownValue === "Simple List" ? "block" : "none";

  const dropdown = document.querySelector(
    ".c-payload-settings__body .c-kind-dropdown"
  );
  if (!dropdown) return;

  dropdownObserver = new MutationObserver((mutations) => {
    if (!numbersContainer) return;

    mutations.forEach((mutation) => {
      if (mutation.attributeName === "aria-label") {
        const dropdownValue = document.querySelector(
          ".c-payload-settings__body .c-kind-dropdown .p-inputtext"
        )?.textContent;

        numbersContainer.style.display =
          dropdownValue === "Simple List" ? "block" : "none";
      }
    });
  });

  dropdownObserver.observe(dropdown, {
    attributes: true,
    subtree: true,
  });
};

const attachNumbersPayload = () => {
  if (document.getElementById("numbersPayload")) return;

  const payloadSettingsKind = document.querySelector(
    ".c-payload-settings__kind"
  ) as HTMLElement;
  if (!payloadSettingsKind) return;

  numbersContainer = document.createElement("div");
  numbersContainer.style.marginBottom = "0.5em";
  numbersContainer.style.display = "none";
  numbersContainer.id = "numbersPayload";

  const numbersTitle = document.createElement("label");
  numbersTitle.innerText = "Numbers";
  numbersTitle.style.fontSize = "var(--c-font-size-100)";
  numbersContainer.appendChild(numbersTitle);

  const inputsContainer = document.createElement("div");
  inputsContainer.style.display = "flex";
  inputsContainer.style.gap = "1em";

  const minInputElement = getEvenBetterAPI().components.createTextInput(
    "10em",
    "Min",
    false
  );
  inputsContainer.appendChild(minInputElement);

  const maxInputElement = getEvenBetterAPI().components.createTextInput(
    "10em",
    "Max",
    false
  );
  inputsContainer.appendChild(maxInputElement);

  const stepInputElement = getEvenBetterAPI().components.createTextInput(
    "10em",
    "Step",
    false
  );

  const minInput = minInputElement.querySelector("input") as HTMLInputElement;
  const maxInput = maxInputElement.querySelector("input") as HTMLInputElement;
  const stepInput = stepInputElement.querySelector("input") as HTMLInputElement;

  if (!minInput || !maxInput || !stepInput) return;

  stepInput.value = "1";
  inputsContainer.appendChild(stepInputElement);

  minInput.addEventListener("input", (e) => {
    if (!maxInput.value) return;
    const min = parseInt((e.target as HTMLInputElement).value);
    const max = parseInt(maxInput.value);
    const step = parseInt(stepInput.value);
    const range = getRange(min, max, step);
    updateSimpleList(range.join("\n"));
  });

  maxInput.addEventListener("input", (e) => {
    if (!minInput.value) return;
    const min = parseInt(minInput.value);
    const max = parseInt((e.target as HTMLInputElement).value);
    const step = parseInt(stepInput.value);
    const range = getRange(min, max, step);
    updateSimpleList(range.join("\n"));
  });

  stepInput.addEventListener("input", (e) => {
    if (!minInput.value || !maxInput.value) return;
    const min = parseInt(minInput.value);
    const max = parseInt(maxInput.value);
    const step = parseInt((e.target as HTMLInputElement).value);
    const range = getRange(min, max, step);
    updateSimpleList(range.join("\n"));
  });

  numbersContainer.appendChild(inputsContainer);
  payloadSettingsKind.prepend(numbersContainer);
};

const updateSimpleList = (newValue: string) => {
  const cmContent = document.querySelector(".c-simple-list__list .cm-content");
  if (!cmContent) return;
  
  cmContent.textContent = newValue;
};

const getRange = (min: number, max: number, step: number) => {
  const range = [];
  for (let i = min; i <= max; i += step) {
    range.push(i);
  }
  return range;
}