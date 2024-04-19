import { evenBetterSettingsTab } from "./ebSettings/evenbetter";
import { Caido } from "@caido/sdk-frontend";

export const setup = () => {
  Caido.navigation.addPage("/settings/evenbetter", {
    body: evenBetterSettingsTab(),
  })

  Caido.menu.registerItem({
    type: "Settings",
    label: "EvenBetter",
    path: "/settings/evenbetter",
    leadingIcon: "fas fa-cogs",
  });
  

  Caido.commands.register("evenbetter:settings", {
    name: "Go to EvenBetter: Settings",
    group: "EvenBetter: Navigation",
    run: () => {
      Caido.navigation.goTo("/settings/evenbetter");
    }
  });

  Caido.commandPalette.register("evenbetter:settings");


  Caido.commands.register("evenbetter:library", {
    name: "Go to EvenBetter: Library",
    group: "EvenBetter: Navigation",
    run: () => {
      Caido.navigation.goTo("/workflows/library");
    }
  });

  Caido.commandPalette.register("evenbetter:library");
};