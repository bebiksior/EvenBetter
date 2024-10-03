export type FeatureFlagTag =
  | "sidebar-tweaks"
  | "exclude-host-path"
  | "backend-test"
  | "quick-decode"
  | "clear-all-findings"
  | "share-scope"
  | "share-mar"
  | "share-replay-collections"
  | "quick-mar";

export type FeatureFlagKind = "backend" | "frontend";

export type FeatureFlag = {
  tag: FeatureFlagTag;
  description: string;
  enabled: boolean;
  kind: FeatureFlagKind;
  requiresReload?: boolean;
};
