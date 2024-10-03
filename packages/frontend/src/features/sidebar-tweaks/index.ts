import { createFeature } from "@/features/manager";
import {
  addGroupHideFunctionality,
  restoreSidebarGroupCollapsedStates,
} from "./hide";
import {
  addMoveButtonsToSidebar,
  restoreSidebarGroupPositions,
} from "./rearrange";
import "./style.css";

export const sidebarTweaks = createFeature("sidebar-tweaks", {
  onFlagEnabled: () => {
    restoreSidebarGroupCollapsedStates();
    restoreSidebarGroupPositions();

    addMoveButtonsToSidebar();
    addGroupHideFunctionality();
  },
  onFlagDisabled: () => {
    location.reload();
  },
});
