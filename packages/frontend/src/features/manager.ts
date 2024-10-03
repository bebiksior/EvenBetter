// This is the features manager for the frontend.
// It creates a map of feature tags and their functions for enable and disable.
// FlagStore will call these functions when a flag is enabled or disabled.

import { CaidoSDK } from "@/types";
import { handleApiResult } from "@/utils/api-utils";
import { EvenBetterAPI } from "@bebiks/evenbetter-api";
import { FeatureFlag, FeatureFlagTag } from "shared";

type FeatureHandlers = {
  onFlagEnabled: (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => void;
  onFlagDisabled: (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => void;
};

const featureMap = new Map<FeatureFlagTag, FeatureHandlers>();

export function createFeature(tag: FeatureFlagTag, handlers: FeatureHandlers) {
  featureMap.set(tag, handlers);
  return { tag, ...handlers };
}

function handleFlagToggle(
  tag: FeatureFlagTag,
  enabled: boolean,
  sdk: CaidoSDK,
  evenBetterAPI: EvenBetterAPI
) {
  const handlers = featureMap.get(tag);
  if (handlers) {
    if (enabled) {
      handlers.onFlagEnabled(sdk, evenBetterAPI);
    } else {
      handlers.onFlagDisabled(sdk, evenBetterAPI);
    }
  } else {
    console.warn(`No handlers for feature flag ${tag}`);
  }
}

function initializeFeatures(
  flags: FeatureFlag[],
  sdk: CaidoSDK,
  evenBetterAPI: EvenBetterAPI
) {
  flags.forEach((flag) => {
    if (flag.kind === "frontend" && flag.enabled) {
      const handlers = featureMap.get(flag.tag);
      if (handlers) {
        handlers.onFlagEnabled(sdk, evenBetterAPI);
      } else {
        console.warn(`No handlers for feature flag ${flag.tag}`);
      }
    }
  });
}

// Load flags and run initializeFeatures on them. Then create onevent subscription to handle flag toggles.
export const initialize = async (
  sdk: CaidoSDK,
  evenBetterAPI: EvenBetterAPI
) => {
  sdk.backend.onEvent("flag:toggled", (tag, enabled) => {
    handleFlagToggle(tag, enabled, sdk, evenBetterAPI);
  });

  const flags = await handleApiResult(
    sdk.backend.getFlags({ kind: "frontend" })
  );
  initializeFeatures(flags, sdk, evenBetterAPI);
};
