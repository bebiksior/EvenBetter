import { type BackendSDK } from "../../types";
import { createFeature } from "../manager";

export const backendTest = createFeature("backend-test", {
  onFlagEnabled: (sdk: BackendSDK) => {
    sdk.console.log("Backend test flag enabled");
  },
  onFlagDisabled: (sdk: BackendSDK) => {
    sdk.console.log("Backend test flag disabled");
  },
});
