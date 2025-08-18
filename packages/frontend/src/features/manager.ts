// This is the features manager for the frontend.
// It creates a map of feature tags and their functions for enable and disable.
// FlagStore will call these functions when a flag is enabled or disabled.

import { type FeatureFlag, type FeatureFlagTag } from "shared";

import { type FrontendSDK } from "../types";

type FeatureHandlers = {
  onFlagEnabled: (sdk: FrontendSDK) => void;
  onFlagDisabled: (sdk: FrontendSDK) => void;
};

const featureMap = new Map<FeatureFlagTag, FeatureHandlers>();

export function createFeature(tag: FeatureFlagTag, handlers: FeatureHandlers) {
  featureMap.set(tag, handlers);
  return { tag, ...handlers };
}

function handleFlagToggle(
  tag: FeatureFlagTag,
  enabled: boolean,
  sdk: FrontendSDK,
) {
  const handlers = featureMap.get(tag);
  if (handlers) {
    if (enabled) {
      handlers.onFlagEnabled(sdk);
    } else {
      handlers.onFlagDisabled(sdk);
    }
  } else {
    console.warn(`No handlers for feature flag ${tag}`);
  }
}

function initializeFeatures(flags: FeatureFlag[], sdk: FrontendSDK) {
  flags.forEach((flag) => {
    if (flag.kind === "frontend" && flag.enabled) {
      const handlers = featureMap.get(flag.tag);
      if (handlers) {
        handlers.onFlagEnabled(sdk);
      } else {
        console.warn(`No handlers for feature flag ${flag.tag}`);
      }
    }
  });
}

export const initialize = async (sdk: FrontendSDK) => {
  sdk.backend.onEvent("flag:toggled", (tag, enabled) => {
    handleFlagToggle(tag, enabled, sdk);
  });

  const flags = await sdk.backend.getFlags({ kind: "frontend" });
  switch (flags.kind) {
    case "Success":
      initializeFeatures(flags.value, sdk);
      break;
    case "Error":
      console.error(flags.error);
      sdk.window.showToast("Error initializing features", {
        variant: "error",
      });
      break;
  }
};
