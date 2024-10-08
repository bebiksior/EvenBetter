import { CaidoBackendSDK } from "@/types";
import { readFile, writeFile } from "fs/promises";
import { getFontUrl, Settings } from "shared";
import * as path from "path";
import { exists, getSettingsPath } from "@/utils/files";

export class SettingsStore {
  private static instance?: SettingsStore;
  private settings: Settings;
  private sdk: CaidoBackendSDK;

  private constructor(sdk: CaidoBackendSDK) {
    this.settings = {
      customFont: "Default",
    };
    this.sdk = sdk;
  }

  public async readSettings() {
    const settingsPath = await getSettingsPath(this.sdk);
    const fileExists = await exists(settingsPath);
    
    if (!fileExists) {
      this.sdk.console.log(
        "Settings file not found. Creating a new settings file."
      );
      const newSettingsPath = await this.saveSettingsToFile(this.settings);
      this.sdk.console.log(
        "Settings file created at " + path.resolve(newSettingsPath)
      );
    }

    try {
      const _settings = JSON.parse(await readFile(settingsPath, "utf-8"));
      Object.assign(this.settings, _settings);
    } catch (error: any) {
      this.sdk.console.error("Unexpected error reading settings:" + error);
    }
  }

  private async saveSettingsToFile(settings: Settings): Promise<string> {
    const settingsPath = await getSettingsPath(this.sdk);
    await writeFile(settingsPath, JSON.stringify(settings, null, 2));
    return settingsPath;
  }

  static async initialize(sdk: CaidoBackendSDK): Promise<SettingsStore> {
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

  async updateSetting(key: string, value: any): Promise<void> {
    const previousFont = this.settings.customFont;
    Object.assign(this.settings, { [key]: value });
    await this.saveSettingsToFile(this.settings);

    if (key === "customFont" && value !== previousFont) {
      this.sdk.api.send("font:load", value, getFontUrl(value));
    }
  }
}
