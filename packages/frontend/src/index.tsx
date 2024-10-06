import { createRoot } from "react-dom/client";
import { CaidoSDK } from "./types";
import { App } from "@/App";
import { initialize } from "@/features/manager";
import { EvenBetterAPI } from "@bebiks/evenbetter-api";
import { initFontLoader } from "@/fonts";
import "@/features"

export const init = (sdk: CaidoSDK) => {
  const evenBetterAPI = new EvenBetterAPI(sdk, {
    manifestID: "evenbetter",
    name: "EvenBetter",
  });

  initialize(sdk, evenBetterAPI);
  initFontLoader(sdk);

  const rootElement = document.createElement("div");
  Object.assign(rootElement.style, {
    height: "100%",
    width: "100%",
  });

  const root = createRoot(rootElement);
  root.render(<App sdk={sdk} evenBetterAPI={evenBetterAPI} />);

  sdk.navigation.addPage("/evenbetter", {
    body: rootElement,
  });

  sdk.sidebar.registerItem("EvenBetter", "/evenbetter", {
    icon: "fas fa-rocket",
  });
};
