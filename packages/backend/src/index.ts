import { Body } from "caido:utils";
import { SDK, DefineAPI } from "caido:plugin";

function generateNumber(sdk: SDK, min: number, max: number): number {
  sdk.console.log(new Body("test")); // Example from utils

  // Generate random number between min and max
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export type API = DefineAPI<{
  generateNumber: typeof generateNumber;
}>;

export function init(sdk: SDK) {
  sdk.api.register("generateNumber", generateNumber);
}