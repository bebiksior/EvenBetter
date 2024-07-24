declare var __TAURI_INVOKE__: any;
export const isTauri = () => {
  return typeof __TAURI_INVOKE__ !== "undefined";
};

export const invokeTauri = async (command: string, args: any) => {
  return await __TAURI_INVOKE__(command, args);
};
