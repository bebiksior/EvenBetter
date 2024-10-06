import { useSDK } from "@/context/SDKContext";
import { handleApiResult } from "@/utils/api-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings } from "shared";

export const useSettings = () => {
  const sdk = useSDK();

  const { data, isLoading, error } = useQuery<Settings, Error>({
    queryKey: ["settings"],
    queryFn: () => handleApiResult(sdk.backend.getSettings()),
  });

  return { settings: data, isLoading, error };
};

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();
  const sdk = useSDK();

  const { mutate, isPending, error } = useMutation<void, Error, { key: keyof Settings; value: any }>({
    mutationFn: ({ key, value }) =>
      handleApiResult(sdk.backend.updateSetting(key, value)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  return { updateSetting: mutate, isPending, error };
};