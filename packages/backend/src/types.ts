import { type DefineEvents, type SDK } from "caido:plugin";
import { type FeatureFlagTag } from "shared";

export type BackendEvents = DefineEvents<{
  "flag:toggled": (tag: FeatureFlagTag, enabled: boolean) => void;
  "font:load": (fontName: string, fontUrl: string) => void;
  "caido:project-change": () => void;
}>;
export type BackendSDK = SDK<never, BackendEvents>;
