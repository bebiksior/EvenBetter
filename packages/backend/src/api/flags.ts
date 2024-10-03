import { FeatureFlagsStore } from "@/stores/flagStore";
import { FeatureFlag, FeatureFlagTag, Result, ok, error } from "shared";
import { CaidoBackendSDK } from "../types";

export const getFlags = (
  sdk: CaidoBackendSDK,
  filters?: Partial<FeatureFlag>
): Result<FeatureFlag[]> => {
  const flagsStore = FeatureFlagsStore.get();
  const flags = flagsStore.getFlags();
  return ok(
    flags.filter((flag) => {
      if (filters?.tag && flag.tag !== filters.tag) {
        return false;
      }
      return true;
    })
  );
};

export const updateFlags = async (
  sdk: CaidoBackendSDK,
  flags: FeatureFlag[]
): Promise<Result<void>> => {
  const flagsStore = FeatureFlagsStore.get();
  await flagsStore.setFlags(flags);
  return ok(undefined);
};

export const getFlag = (
  sdk: CaidoBackendSDK,
  tag: FeatureFlagTag
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
  sdk: CaidoBackendSDK,
  tag: FeatureFlagTag,
  value: boolean
): Promise<Result<void>> => {
  const flagsStore = FeatureFlagsStore.get();
  await flagsStore.setFlag(tag, value);
  return ok(undefined);
};
