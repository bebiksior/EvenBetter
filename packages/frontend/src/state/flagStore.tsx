import { useSDK } from "@/context/SDKContext";
import { handleApiResult } from "@/utils/api-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FeatureFlagTag } from "shared";

// Calls sdk.backend.getFlags() and returns the flags
export const useFlags = () => {
  const sdk = useSDK();

  const { data, isLoading, error } = useQuery({
    queryKey: ["flags"],
    queryFn: () => handleApiResult(sdk.backend.getFlags()),
  });

  return { flags: data || [], isLoading, error };
};

// Calls sdk.backend.setFlag(flag, value) and returns the flag
export const useSetFlag = () => {
  const queryClient = useQueryClient();
  const sdk = useSDK();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ flag, value }: { flag: FeatureFlagTag; value: boolean }) =>
      handleApiResult(sdk.backend.setFlag(flag, value)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
    },
  });
  return { setFlag: mutate, isPending, error };
};
