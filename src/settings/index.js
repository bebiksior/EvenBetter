const defaultSettings = {
  ssrfInstancePlaceholder: "$ssrfinstance",
  sidebarHideGroups: "true",
  sidebarRearrangeGroups: "true",
  ssrfInstanceFunctionality: "true",
  showOutdatedVersionWarning: "true",
  highlightRowsFunctionality: "true",
  debugMode: "false",
  evenBetterVersionCheckUrl:
    "https://raw.githubusercontent.com/bebiksior/EvenBetter/main/version.txt",
  currentVersion: "v1.7",
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
    const response = await fetch(defaultSettings.evenBetterVersionCheckUrl, {
      cache: "no-store",
    });
    const latestVersion = await response.text();

    const latestVersionNumber = parseFloat(latestVersion.replace("v", "")),
      currentVersionNumber = parseFloat(
        defaultSettings.currentVersion.replace("v", "")
      );

    if (currentVersionNumber > latestVersionNumber) {
      return {
        isLatest: true,
        message: `You are using a development version: ${defaultSettings.currentVersion}.`,
      };
    }

    if (latestVersion.trim() === defaultSettings.currentVersion) {
      return {
        isLatest: true,
        message: "You are using the latest version! 🎉",
      };
    } else {
      return {
        isLatest: false,
        message: `New EvenBetter version available: ${latestVersion}.`,
      };
    }
  } catch (error) {
    return {
      isLatest: false,
      message: "Failed to check for updates",
    };
  }
};

export { getSetting, setSetting, checkForUpdates, defaultSettings };
