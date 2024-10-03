import { CaidoBackendSDK } from "@/types";
import * as path from "path";
import { mkdir, stat } from "fs/promises";

export async function ensureDir(
  sdk: CaidoBackendSDK,
  directory: string
): Promise<boolean> {
  try {
    const dir = fixWindowsPath(path.join(sdk.meta.path(), directory));
    await mkdir(dir, { recursive: true });
    return true;
  } catch (e) {
    return false;
  }
}

export async function getSettingsPath(sdk: CaidoBackendSDK): Promise<string> {
  return fixWindowsPath(path.join(sdk.meta.path(), "settings.json"));
}

export async function getFlagsPath(sdk: CaidoBackendSDK): Promise<string> {
  return fixWindowsPath(path.join(sdk.meta.path(), "flags.json"));
}

// This is a temporary fix for Windows paths.
export function fixWindowsPath(inputPath: string): string {
  if (/^[a-zA-Z]:[^\\/]/.test(inputPath)) {
    return inputPath.replace(/^([a-zA-Z]:)(.*)$/, "$1\\$2");
  }
  return inputPath;
}

export async function exists(f: string): Promise<boolean> {
  try {
    await stat(f);
    return true;
  } catch {
    return false;
  }
}
