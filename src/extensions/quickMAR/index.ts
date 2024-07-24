import { getCaidoAPI } from "../../utils/caidoapi";

export const quickMatchAndReplace = () => {
  getCaidoAPI().commands.register("evenbetter:quickmar", {
    name: "Send to Match & Replace",
    run: async (context) => {
      if (context.type == "RequestContext" || context.type == "ResponseContext") {
        const selection = context.selection;
        sendToMatchAndReplace(selection);
      }
      
    },
  });

  getCaidoAPI().menu.registerItem({
    commandId: "evenbetter:quickmar",
    leadingIcon: "fas fa-wrench",
    type: "Request",
  });

  getCaidoAPI().menu.registerItem({
    commandId: "evenbetter:quickmar",
    leadingIcon: "fas fa-wrench",
    type: "Response",
  });
};

const sendToMatchAndReplace = async (selection: string) => {
  getCaidoAPI().navigation.goTo("/tamper");
  await waitForPage();

  const newRuleButton = document.querySelector(
    ".c-rule-list-header__new button"
  ) as HTMLButtonElement;
  if (!newRuleButton) return;

  newRuleButton.click();
  await waitForFormUpdate();

  const searchInput = document.querySelector(
    ".c-tamper textarea"
  ) as HTMLInputElement;
  const nameInput = document.querySelector(
    ".c-rule-form-update__name input"
  ) as HTMLInputElement;

  if (!searchInput || !nameInput) return;

  let firstLine = selection.split("\n")[0];
  if (!firstLine) firstLine = selection;

  firstLine = firstLine.substring(0, 50) + "...";

  setValue(searchInput, selection);
  setValue(nameInput, firstLine);

  const saveButton = document.querySelector(
    ".c-rule-form-update__save button"
  ) as HTMLButtonElement;

  let interval = setInterval(() => {
    if (saveButton.disabled) return;

    clearInterval(interval);
    saveButton.click();
  }, 25);

  setTimeout(() => {
    if (interval) clearInterval(interval);
  }, 100);
};

const waitForPage = async () => {
  const formUpdate = document.querySelector(".c-rule-form-update");
  const formCreate = document.querySelector(".c-rule-form-create");
  if (formUpdate || formCreate) {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
  return waitForPage();
};

const waitForFormUpdate = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const formUpdate = document.querySelector(".c-rule-form-update__body");
  if (formUpdate) {
    return;
  }

  return waitForFormUpdate();
};

const setValue = (element: HTMLInputElement, text: string) => {
  const previousFocus = document.activeElement as HTMLElement;
  element.focus();

  element.value = "";

  for (let i = 0; i < text.length; i++) {
    element.value += text[i];

    let inputEvent = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(inputEvent);
  }

  let changeEvent = new Event("change", {
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(changeEvent);

  previousFocus?.focus();
};