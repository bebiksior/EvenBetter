import {
  ok,
  type Result,
  type SettingKey,
  type Settings,
  type SettingValue,
} from "shared";

import { SettingsStore } from "../stores/settings";
import { type BackendSDK } from "../types";

export const getSettings = (): Result<Settings> => {
  const settingsStore = SettingsStore.get();
  return ok(settingsStore.getSettings());
};

export const updateSetting = <K extends SettingKey>(
  _: BackendSDK,
  key: K,
  value: SettingValue<K>,
): Result<void> => {
  const settingsStore = SettingsStore.get();
  settingsStore.updateSetting(key, value);
  return ok(undefined);
};
