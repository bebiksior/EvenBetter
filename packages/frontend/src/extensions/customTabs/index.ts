import { getCaidoAPI } from "../../utils/caidoapi";
import { evenBetterSettingsTab } from "./ebSettings/evenbetter";

export const setup = () => {
  const settingsBody = evenBetterSettingsTab();
  if (!settingsBody) return;
  
  getCaidoAPI().navigation.addPage("/settings/evenbetter", {
    body: settingsBody,
  })

  getCaidoAPI().menu.registerItem({
    type: "Settings",
    label: "EvenBetter",
    path: "/settings/evenbetter",
    leadingIcon: "fas fa-cogs",
  });
  

  getCaidoAPI().commands.register("evenbetter:settings", {
    name: "Go to EvenBetter: Settings",
    group: "EvenBetter: Navigation",
    run: () => {
      getCaidoAPI().navigation.goTo("/settings/evenbetter");
    }
  });

  getCaidoAPI().commandPalette.register("evenbetter:settings");


  getCaidoAPI().commands.register("evenbetter:library", {
    name: "Go to EvenBetter: Library",
    group: "EvenBetter: Navigation",
    run: () => {
      getCaidoAPI().navigation.goTo("/workflows/library");
    }
  });

  getCaidoAPI().commandPalette.register("evenbetter:library");
};