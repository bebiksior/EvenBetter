import { Caido } from "@caido/sdk-frontend";

export const extendedCommands = () => {
  const settingsTabs = [
    "General",
    "Shortcuts",
    "Network",
    "Rendering",
    "Developer",
  ];

  settingsTabs.forEach((tab) => {
    Caido.commands.register("settings:" + tab, {
      name: "Go to Settings: " + tab,
      group: "Navigation",
      run: () => {
        Caido.navigation.goTo("/settings/" + tab.toLowerCase());
      },
    });

    Caido.commandPalette.register("settings:" + tab);
  });
};
