import { invokeTauri, isTauri } from "./tauri";

export const downloadFile = async (filename: string, data: string) => {
  if (isTauri()) {
    return invokeTauri("download", { filename, data });
  } else {
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  }
};
