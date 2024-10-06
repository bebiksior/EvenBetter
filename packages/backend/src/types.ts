import { DefineEvents, SDK } from "caido:plugin";
import { FeatureFlagTag } from "shared";

export type BackendEvents = DefineEvents<{
  "flag:toggled": (tag: FeatureFlagTag, enabled: boolean) => void;
  "font:load": (fontName: string, fontUrl: string) => void;
}>;
export type CaidoBackendSDK = SDK<never, BackendEvents>;
