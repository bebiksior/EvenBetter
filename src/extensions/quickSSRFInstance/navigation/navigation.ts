import {
  refreshSSRFInstance,
  ssrfInstance,
  SSRFInstanceType,
} from "../instance";
import { ssrfHitsTable } from "../reqHistory/reqHistory";
import "./navigation.css";
import { getCaidoAPI } from "../../../utils/caidoapi";
import { getEvenBetterAPI } from "../../../utils/evenbetterapi";

export let selectedInstanceType = SSRFInstanceType.CVSSADVISOR;

const syncData = (navigation: HTMLElement) => {
  const select = navigation.querySelector("select");
  if (!select) return;

  const input = navigation.querySelector(
    ".ssrf-instance-url"
  ) as HTMLInputElement;

  if (ssrfInstance) input.value = ssrfInstance.url;
  select.value = selectedInstanceType;

  updateIcon();
};

export const navigationBar = () => {
  const ssrfInstanceUrl = getEvenBetterAPI().components.createTextInput(
    "13em",
    "N/A",
    true
  );

  const clearLogs = getCaidoAPI().ui.button({
    label: "Clear Logs",
    variant: "primary",
    leadingIcon: "fas fa-trash",
    size: "small",
  });

  clearLogs.addEventListener("click", () => ssrfHitsTable.clearRows());

  const navigationBar = getEvenBetterAPI().components.createNavigationBar({
    title: "Quick SSRF",
    items: [
      {
        title: "Requests History",
        url: "#/evenbetter/quick-ssrf",
        icon: "fa-history",
        onOpen: () => syncData(navigationBar),
      },
      {
        title: "Settings",
        url: "#/evenbetter/quick-ssrf/settings",
        icon: "fa-cog",
        onOpen: () => syncData(navigationBar),
      },
    ],
    customButtons: [clearLogs, switchElement(), ssrfInstanceUrl],
  });

  const ssrfInstanceUrlInput = ssrfInstanceUrl.querySelector("input");
  if (!ssrfInstanceUrlInput) return navigationBar;

  ssrfInstanceUrlInput.disabled = true;
  ssrfInstanceUrlInput.classList.add("ssrf-instance-url");
  getEvenBetterAPI().eventManager.on("onSSRFInstanceChange", () => {
    if (ssrfInstance) ssrfInstanceUrlInput.value = ssrfInstance.url;
  });

  const ssrfInstanceType = navigationBar.querySelector(
    ".evenbetter_quick-ssrf_switch select"
  ) as HTMLSelectElement;

  navigationBar
    .querySelector("select")
    ?.addEventListener(
      "change",
      () => (selectedInstanceType = ssrfInstanceType.value as SSRFInstanceType)
    );

  navigationBar
    .querySelector(".evenbetter_quick-ssrf_button")
    ?.addEventListener("click", refreshInputs);

  return navigationBar;
};

export const refreshInputs = () => {
  refreshSSRFInstance(selectedInstanceType).then(() => {
    ssrfHitsTable.clearRows();
    updateIcon();
  });
};

const updateIcon = () => {
  const icon = document.querySelector(".evenbetter_quick-ssrf_switch i");
  if (!icon) return;

  icon.className = ssrfInstance ? "fas fa-sync" : "fas fa-plus";
};

const switchElement = () => {
  const select = document.createElement("div");
  select.className = "evenbetter_quick-ssrf_switch";
  select.innerHTML = `<select>
      <option value="ssrf.cvssadvisor.com">ssrf.cvssadvisor.com</option>
      <option value="interactsh.com">interactsh.com</option>
    </select>
    <div class="evenbetter_quick-ssrf_button">
      <i class="fas fa-plus"></i>
    </div>`;
  return select;
};
