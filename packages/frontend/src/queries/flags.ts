import { useQuery } from "@pinia/colada";
import { type FeatureFlag, type FeatureFlagTag } from "shared";
import { computed, ref } from "vue";

import { useSDK } from "@/plugins/sdk";

const FLAGS_KEY = ["flags"] as const;

export const useFlagsQuery = () => {
  const sdk = useSDK();

  return useQuery<FeatureFlag[]>({
    key: FLAGS_KEY,
    query: async () => {
      const res = await sdk.backend.getFlags();
      if (res.kind === "Error") {
        throw new Error(res.error);
      }
      return res.value;
    },
  });
};

export const useSetFlag = () => {
  const sdk = useSDK();
  const { refetch } = useFlagsQuery();
  const isPending = ref(false);

  const setFlag = async (payload: { flag: FeatureFlagTag; value: boolean }) => {
    isPending.value = true;
    const res = await sdk.backend.setFlag(payload.flag, payload.value);
    if (res.kind === "Error") {
      isPending.value = false;
      throw new Error(res.error);
    }
    await refetch();
    isPending.value = false;
  };

  return {
    setFlag,
    isPending: computed(() => isPending.value),
  };
};
