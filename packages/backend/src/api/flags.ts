import {
  error,
  type FeatureFlag,
  type FeatureFlagTag,
  ok,
  type Result,
} from "shared";

import { FeatureFlagsStore } from "../stores/flags";
import { type BackendSDK } from "../types";

export const getFlags = (
  _: BackendSDK,
  filters?: Partial<FeatureFlag>,
): Result<FeatureFlag[]> => {
  const flagsStore = FeatureFlagsStore.get();
  const flags = flagsStore.getFlags();
  return ok(
    flags.filter((flag) => {
      if (filters?.tag && flag.tag !== filters.tag) {
        return false;
      }
      return true;
    }),
  );
};

export const updateFlags = async (
  _: BackendSDK,
  flags: FeatureFlag[],
): Promise<Result<void>> => {
  const flagsStore = FeatureFlagsStore.get();
  await flagsStore.setFlags(flags);
  return ok(undefined);
};

export const getFlag = (
  _: BackendSDK,
  tag: FeatureFlagTag,
): Result<boolean> => {
  const flagsStore = FeatureFlagsStore.get();
  const flags = flagsStore.getFlags();

  const flag = flags.find((f) => f.tag === tag);
  if (!flag) {
    return error(`Flag ${tag} not found`);
  }

  return ok(flag.enabled);
};

export const setFlag = async (
  _: BackendSDK,
  tag: FeatureFlagTag,
  value: boolean,
): Promise<Result<void>> => {
  const flagsStore = FeatureFlagsStore.get();
  await flagsStore.setFlag(tag, value);
  return ok(undefined);
};
