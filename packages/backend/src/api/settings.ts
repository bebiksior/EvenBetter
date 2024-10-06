import { SettingsStore } from "@/stores/settingsStore";
import { CaidoBackendSDK } from "@/types";
import { ok, Result, Settings } from "shared";

export const getSettings = (): Result<Settings> => {
  const settingsStore = SettingsStore.get();
  return ok(settingsStore.getSettings());
}

export const updateSetting = async (sdk: CaidoBackendSDK, key: keyof Settings, value: any): Promise<Result<void>> => {
  const settingsStore = SettingsStore.get();
  await settingsStore.updateSetting(key, value);
  return ok(undefined);
}
