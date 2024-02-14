const defaultSettings = {
  colorizeParameterName: "_color",
  ssrfInstancePlaceholder: "$ssrfinstance",
  colorizeHttpRows: "true",
  sidebarHideGroups: "true",
  sidebarRearrangeGroups: "true",
  ssrfInstanceFunctionality: "true",
  showOutdatedVersionWarning: "true",
  evenBetterVersionCheckUrl:
    "https://raw.githubusercontent.com/bebiksior/EvenBetter/main/version.txt",
  currentVersion: "v1.41",
};

const getSetting = (settingName) => {
  if (localStorage.getItem(`evenbetter_${settingName}`) === null) {
    return defaultSettings[settingName];
  }

  return localStorage.getItem(`evenbetter_${settingName}`);
};

const setSetting = (settingName, value) => {
  localStorage.setItem(`evenbetter_${settingName}`, value);
};

const checkForUpdates = async () => {
  try {
    const response = await fetch(defaultSettings.evenBetterVersionCheckUrl);
    const latestVersion = await response.text();

    if (latestVersion.trim() === defaultSettings.currentVersion) {
      return "You are using the latest version! 🎉";
    } else {
      return `New EvenBetter version available: ${latestVersion}.`;
    }
  } catch (error) {
    return "Failed to check for updates";
  }
};

export { getSetting, setSetting, checkForUpdates, defaultSettings };
