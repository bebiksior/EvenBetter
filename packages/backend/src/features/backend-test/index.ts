import { CaidoBackendSDK } from "@/types";
import { createFeature } from "../manager";

export const backendTest = createFeature("backend-test", {
  onFlagEnabled: (sdk: CaidoBackendSDK) => {
    sdk.console.log("Backend test flag enabled");
  },
  onFlagDisabled: (sdk: CaidoBackendSDK) => {
    sdk.console.log("Backend test flag disabled");
  },
});
