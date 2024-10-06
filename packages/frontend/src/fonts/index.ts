import { CaidoSDK } from "@/types";
import { handleApiResult } from "@/utils/api-utils";
import { getFontUrl } from "shared";

function loadFont(font: string, fontUrl: string) {
  const customFontElement = document.getElementById("eb-custom-font");
  if (customFontElement) {
    document.head.removeChild(customFontElement);
  }

  const customFontStyleElement = document.getElementById(
    "eb-custom-font-style"
  );
  if (customFontStyleElement) {
    document.head.removeChild(customFontStyleElement);
  }

  if (font === "Default") return;

  const link = document.createElement("link");
  link.href = fontUrl;
  link.rel = "stylesheet";
  link.id = "eb-custom-font";

  const style = document.createElement("style");
  style.id = "eb-custom-font-style";
  style.textContent = `body { font-family: ${font} !important; }`;

  document.head.appendChild(link);
  document.head.appendChild(style);
}

export async function initFontLoader(sdk: CaidoSDK) {
  sdk.backend.onEvent("font:load", loadFont);

  const settingsStore = await handleApiResult(sdk.backend.getSettings());
  const customFont = settingsStore.customFont;
  if (customFont) {
    loadFont(customFont, getFontUrl(customFont));
  }
}
