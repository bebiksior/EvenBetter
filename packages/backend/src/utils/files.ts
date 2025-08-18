import { mkdir, stat } from "fs/promises";
import path from "path";

import { type BackendSDK } from "../types";

export async function ensureDir(
  sdk: BackendSDK,
  directory: string,
): Promise<boolean> {
  try {
    const dir = path.join(sdk.meta.path(), directory);
    await mkdir(dir, { recursive: true });
    return true;
  } catch {
    return false;
  }
}

export function getSettingsPath(sdk: BackendSDK): string {
  return path.join(sdk.meta.path(), "settings.json");
}

export function getFlagsPath(sdk: BackendSDK): string {
  return path.join(sdk.meta.path(), "flags.json");
}

export async function exists(f: string): Promise<boolean> {
  try {
    await stat(f);
    return true;
  } catch {
    return false;
  }
}
