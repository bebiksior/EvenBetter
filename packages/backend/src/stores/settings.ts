import { readFile, writeFile } from "fs/promises";
import * as path from "path";

import {
  DEFAULT_SETTINGS,
  getFontUrl,
  type SettingKey,
  type Settings,
  type SettingValue,
} from "shared";

import { type BackendSDK } from "../types";
import { exists, getSettingsPath } from "../utils/files";

export class SettingsStore {
  private static instance?: SettingsStore;
  private settings: Settings;
  private sdk: BackendSDK;

  private constructor(sdk: BackendSDK) {
    this.settings = { ...DEFAULT_SETTINGS };
    this.sdk = sdk;
  }

  public async readSettings() {
    const settingsPath = getSettingsPath(this.sdk);
    const fileExists = await exists(settingsPath);

    if (!fileExists) {
      this.sdk.console.log(
        "Settings file not found. Creating a new settings file.",
      );
      const newSettingsPath = await this.saveSettingsToFile(this.settings);
      this.sdk.console.log(
        "Settings file created at " + path.resolve(newSettingsPath),
      );
    }

    try {
      const fileContent = await readFile(settingsPath, "utf-8");
      const _settings = JSON.parse(fileContent);
      Object.assign(this.settings, _settings);
    } catch (error) {
      this.sdk.console.error(
        "Unexpected error reading settings: " + String(error),
      );
    }
  }

  private async saveSettingsToFile(settings: Settings): Promise<string> {
    const settingsPath = getSettingsPath(this.sdk);
    await writeFile(settingsPath, JSON.stringify(settings, null, 2));
    return settingsPath;
  }

  static async initialize(sdk: BackendSDK): Promise<SettingsStore> {
    if (SettingsStore.instance) {
      throw new Error("SettingsStore already initialized");
    }

    SettingsStore.instance = new SettingsStore(sdk);
    await this.instance?.readSettings();

    return SettingsStore.instance;
  }

  static get(): SettingsStore {
    if (!SettingsStore.instance) {
      throw new Error("SettingsStore not initialized");
    }

    return SettingsStore.instance;
  }

  getSettings(): Settings {
    return this.settings;
  }

  updateSetting<K extends SettingKey>(key: K, value: SettingValue<K>): void {
    this.settings[key] = value;
    this.saveSettingsToFile(this.settings);

    if (key === "customFont") {
      this.sdk.api.send("font:load", value, getFontUrl(value as string));
    }
  }
}
