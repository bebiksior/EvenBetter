import { getCaidoAPI } from "../../utils/caidoapi";

export const extendedCommands = () => {
  const settingsTabs = [
    "General",
    "Shortcuts",
    "Network",
    "Rendering",
    "Developer",
  ];

  settingsTabs.forEach((tab) => {
    getCaidoAPI().commands.register("settings:" + tab, {
      name: "Go to Settings: " + tab,
      group: "Navigation",
      run: () => {
        getCaidoAPI().navigation.goTo("/settings/" + tab.toLowerCase());
      },
    });

    getCaidoAPI().commandPalette.register("settings:" + tab);
  });
};
