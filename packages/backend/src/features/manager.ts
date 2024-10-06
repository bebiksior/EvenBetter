import { FeatureFlag, FeatureFlagTag } from "shared";
import { CaidoBackendSDK } from "../types";

/**
 * Example flag:
 * export const backendTest = createFeature("backend-test", {
  onFlagEnabled: (sdk: CaidoBackendSDK) => {
    console.log("Backend test flag enabled");
  },
  onFlagDisabled: (sdk: CaidoBackendSDK) => {
    console.log("Backend test flag disabled");
  },
});
 * 
 * This FeatureManager is responsible for managing the feature flags on the backend.    
 * It handles only the flags with kind "backend".
 * It creates a map of feature tags and their functions for enable and disable.
 * FlagStore will call these functions when a flag is enabled or disabled.
 */

type FeatureHandlers = {
  onFlagEnabled: (sdk: CaidoBackendSDK) => void;
  onFlagDisabled: (sdk: CaidoBackendSDK) => void;
};

const featureMap = new Map<FeatureFlagTag, FeatureHandlers>();

export function createFeature(tag: FeatureFlagTag, handlers: FeatureHandlers) {
  featureMap.set(tag, handlers);
  return { tag, ...handlers };
}

export function backendHandleFlagToggle(
  tag: FeatureFlagTag,
  enabled: boolean,
  sdk: CaidoBackendSDK
) {
  const handlers = featureMap.get(tag);
  if (handlers) {
    if (enabled) {
      handlers.onFlagEnabled(sdk);
    } else {
      handlers.onFlagDisabled(sdk);
    }
  } else {
    sdk.console.warn(`No handlers for feature flag ${tag}`);
  }
}

export function initializeFeatures(flags: FeatureFlag[], sdk: CaidoBackendSDK) {
  flags.forEach((flag) => {
    if (flag.kind === "backend" && flag.enabled) {
      const handlers = featureMap.get(flag.tag);
      if (handlers) {
        handlers.onFlagEnabled(sdk);
      } else {
        sdk.console.warn(`No handlers for feature flag ${flag.tag}`);
      }
    }
  });
}
