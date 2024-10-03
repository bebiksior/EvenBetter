import { SDK, DefineAPI } from "caido:plugin";
import { getFlags, setFlag, getFlag, updateFlags } from "./api/flags";
import { FeatureFlagsStore } from "@/stores/flagStore";
import { SettingsStore } from "@/stores/settingsStore";
import { getSettings, updateSetting } from "./api/settings";

export type { BackendEvents } from "./types";

import "@/features";

export type API = DefineAPI<{
  // Flags
  getFlags: typeof getFlags;
  setFlag: typeof setFlag;
  getFlag: typeof getFlag;
  updateFlags: typeof updateFlags;

  // Settings
  getSettings: typeof getSettings;
  updateSetting: typeof updateSetting;
}>;

export async function init(sdk: SDK<API>) {
  await SettingsStore.initialize(sdk);
  await FeatureFlagsStore.initialize(sdk);

  // Flags
  sdk.api.register("getFlags", getFlags);
  sdk.api.register("setFlag", setFlag);
  sdk.api.register("getFlag", getFlag);
  sdk.api.register("updateFlags", updateFlags);

  // Settings
  sdk.api.register("getSettings", getSettings);
  sdk.api.register("updateSetting", updateSetting);
}
