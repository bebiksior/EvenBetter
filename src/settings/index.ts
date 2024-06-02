import { CURRENT_VERSION, EVENBETTER_VERSION_CHECK_URL } from "./constants";

export const defaultSettings: { [key: string]: string } = {
  ssrfInstancePlaceholder: "$ssrfinstance",
  ssrfInstanceFunctionality: "true",
  sidebarHideGroups: "true",
  sidebarRearrangeGroups: "true",
  showOutdatedVersionWarning: "true",
  highlightRowsFunctionality: "true",
  quickDecode: "true",
  ssrfInstanceTool: "ssrf.cvssadvisor.com"
};

export const getSetting = (settingName: string): string => {
  if (localStorage.getItem(`evenbetter_${settingName}`) === null) {
    const defaultSetting = defaultSettings[settingName];
    if (defaultSetting !== undefined) {
      localStorage.setItem(`evenbetter_${settingName}`, defaultSetting);
    }
  }

  return localStorage.getItem(`evenbetter_${settingName}`) || "";
};

export const setSetting = (settingName: string, value: string): void => {
  localStorage.setItem(`evenbetter_${settingName}`, value);
};

export interface UpdateResponse {
  isLatest: boolean;
  message: string;
}

export const checkForUpdates = async (): Promise<UpdateResponse> => {
  try {
    const response = await fetch(EVENBETTER_VERSION_CHECK_URL, {
      cache: "no-store",
    });
    const latestVersion = await response.text();

    const latestVersionNumber = parseFloat(latestVersion.replace("v", "")),
      currentVersionNumber = parseFloat(
        CURRENT_VERSION.replace("v", "")
      );

    if (currentVersionNumber > latestVersionNumber) {
      return {
        isLatest: true,
        message: `You are using a development version: ${CURRENT_VERSION}.`,
      };
    }

    if (latestVersion.trim() === CURRENT_VERSION) {
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
      isLatest: true,
      message: "Failed to check for updates",
    };
  }
};
