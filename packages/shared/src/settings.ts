export type Settings = {
  customFont: string;
};

export type SettingKey = keyof Settings;
export type SettingValue<K extends SettingKey> = Settings[K];

export const DEFAULT_SETTINGS: Settings = {
  customFont: "Default",
};
