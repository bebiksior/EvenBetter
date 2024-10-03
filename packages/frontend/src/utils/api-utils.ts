import { Result } from "shared";

export const handleApiResult = async <T>(
  promise: Promise<Result<T>>
): Promise<T> => {
  const result = await promise;
  if (result.kind === "Error") {
    throw new Error(result.error);
  }
  return result.value;
}
