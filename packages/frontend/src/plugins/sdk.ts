import { inject, type InjectionKey, type Plugin } from "vue";

import { type FrontendSDK } from "@/types";

const KEY: InjectionKey<FrontendSDK> = Symbol("FrontendSDK");

// This is the plugin that will provide the FrontendSDK to VueJS
// To access the frontend SDK from within a component, use the `useSDK` function.
export const SDKPlugin: Plugin = (app, sdk: FrontendSDK) => {
  app.provide(KEY, sdk);
};

// This is the function that will be used to access the FrontendSDK from within a component.
export const useSDK = () => {
  return inject(KEY) as FrontendSDK;
};
