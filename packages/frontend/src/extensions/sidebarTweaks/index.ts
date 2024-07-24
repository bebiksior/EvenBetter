import { addGroupHideFunctionality, restoreSidebarGroupCollapsedStates } from "./hide";
import { addMoveButtonsToSidebar, restoreSidebarGroupPositions } from "./rearrange"

export const sidebarTweaks = () => {
    restoreSidebarGroupCollapsedStates();
    restoreSidebarGroupPositions();
    
    addMoveButtonsToSidebar();
    addGroupHideFunctionality();
}