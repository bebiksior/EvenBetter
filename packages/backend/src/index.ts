import { type DefineAPI, type SDK } from "caido:plugin";

import { getFlag, getFlags, setFlag, updateFlags } from "./api/flags";
import { getSettings, updateSetting } from "./api/settings";
import { FeatureFlagsStore } from "./stores/flags";
import { SettingsStore } from "./stores/settings";
import { type BackendEvents } from "./types";

export type { BackendEvents } from "./types";

export type API = DefineAPI<{
  getFlags: typeof getFlags;
  setFlag: typeof setFlag;
  getFlag: typeof getFlag;
  updateFlags: typeof updateFlags;
  getSettings: typeof getSettings;
  updateSetting: typeof updateSetting;
}>;

export async function init(sdk: SDK<API, BackendEvents>) {
  await SettingsStore.initialize(sdk);
  await FeatureFlagsStore.initialize(sdk);

  sdk.api.register("getFlags", getFlags);
  sdk.api.register("setFlag", setFlag);
  sdk.api.register("getFlag", getFlag);
  sdk.api.register("updateFlags", updateFlags);
  sdk.api.register("getSettings", getSettings);
  sdk.api.register("updateSetting", updateSetting);

  sdk.events.onProjectChange((projectId) => {
    sdk.api.send("caido:project-change", projectId);
  });
}
