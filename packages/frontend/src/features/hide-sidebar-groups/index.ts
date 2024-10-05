import { createFeature } from "@/features/manager";
import "./style.css";

const STORAGE_KEY = "sidebar-groups-state";
let firstSetup = true;

interface SidebarGroupState {
  [groupTitle: string]: boolean;
}

function getStoredState(): SidebarGroupState {
  const storedState = localStorage.getItem(STORAGE_KEY);
  return storedState ? JSON.parse(storedState) : {};
}

function setStoredState(state: SidebarGroupState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function toggleGroupCollapse(group: Element, state: SidebarGroupState): void {
  if (group.getAttribute("data-is-collapsed") === "true") {
    return;
  }

  const title = group.querySelector(".c-sidebar-group__title");
  const items = group.querySelector(".c-sidebar-group__items") as HTMLElement;
  
  if (title && items) {
    const groupTitle = title.textContent || "";
    const isCollapsed = !state[groupTitle];
    
    state[groupTitle] = isCollapsed;
    setStoredState(state);
    
    items.style.display = isCollapsed ? "none" : "";
    group.setAttribute("data-is-group-collapsed", isCollapsed.toString());
  }
}

function setupGroup(group: Element, state: SidebarGroupState): void {
  if (group.getAttribute("data-is-collapsed") === "true" && !firstSetup) {
    return;
  }

  const title = group.querySelector(".c-sidebar-group__title");
  const items = group.querySelector(".c-sidebar-group__items") as HTMLElement;
  
  if (title && items) {
    const groupTitle = title.textContent || "";
    const isCollapsed = state[groupTitle] || false;
    
    items.style.display = isCollapsed ? "none" : "";
    group.setAttribute("data-is-group-collapsed", isCollapsed.toString());
    
    title.addEventListener("click", () => toggleGroupCollapse(group, state));
  }
}

function setup(): void {
  const sidebarBody = document.querySelector(".c-sidebar__body");
  if (!sidebarBody) return;

  const state = getStoredState();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element && node.classList.contains("c-sidebar-group__title")) {
            const group = node.parentElement;
            if (group) {
              setupGroup(group, state);
            }
          }

          if (node instanceof Element && node.classList.contains("c-sidebar-group")) {
            setupGroup(node, state);
          }
        });
      }
    });
  });

  observer.observe(sidebarBody, { childList: true, subtree: true });

  // Setup existing groups
  sidebarBody.querySelectorAll(".c-sidebar-group").forEach((group) => {
    setupGroup(group, state);
  });

  firstSetup = false;
}

export const hideSidebarGroups = createFeature("hide-sidebar-groups", {
  onFlagEnabled: () => {
    setup();
  },
  onFlagDisabled: () => {
    location.reload();
  },
});
