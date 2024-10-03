import { CaidoBackendSDK } from "@/types";
import * as path from "path";
import { mkdir, stat } from "fs/promises";

export async function ensureDir(
  sdk: CaidoBackendSDK,
  directory: string
): Promise<boolean> {
  try {
    const dir = pathJoin(sdk.meta.path(), directory);
    await mkdir(dir, { recursive: true });
    return true;
  } catch (e) {
    return false;
  }
}
// This is a temporary fix. In Caido v0.41.0 there's issue with path.join
export function pathJoin(dir: string, file: string): string {
  const isWindowsPath = /^[a-zA-Z]:\\/.test(dir);
  const separator = isWindowsPath ? "\\" : "/";
  dir = dir.replace(/[\\/]+$/, "");
  file = file.replace(/^[\\/]+/, "");
  return `${dir}${separator}${file}`;
}

export async function getSettingsPath(sdk: CaidoBackendSDK): Promise<string> {
  return pathJoin(sdk.meta.path(), "settings.json");
}

export async function getFlagsPath(sdk: CaidoBackendSDK): Promise<string> {
  return pathJoin(sdk.meta.path(), "flags.json");
}

export async function exists(f: string): Promise<boolean> {
  try {
    await stat(f);
    return true;
  } catch {
    return false;
  }
}
