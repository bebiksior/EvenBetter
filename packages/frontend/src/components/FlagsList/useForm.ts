import { type FeatureFlag, type FeatureFlagTag } from "shared";
import { ref } from "vue";

import { useSDK } from "@/plugins/sdk";
import { useFlagsQuery, useSetFlag } from "@/queries/flags";

export const useForm = () => {
  const sdk = useSDK();

  const { data: flags, isLoading } = useFlagsQuery();
  const { setFlag } = useSetFlag();

  const dialogOpen = ref(false);
  const dialogFlagTag = ref<FeatureFlagTag | undefined>(undefined);

  const handleDialogOpen = (flagTag: FeatureFlagTag) => {
    dialogOpen.value = true;
    dialogFlagTag.value = flagTag;
  };

  const handleDialogClose = () => {
    dialogOpen.value = false;
    dialogFlagTag.value = undefined;
  };

  const handleFlagChange = async (flag: FeatureFlag) => {
    if (flag.requiresReload === true && flag.enabled === true) {
      handleDialogOpen(flag.tag);
      return;
    }

    const newValue = !flag.enabled;
    await setFlag({ flag: flag.tag, value: newValue });
    const status = newValue ? "enabled" : "disabled";
    sdk.window.showToast(`Feature ${flag.tag} has been ${status}`, {
      variant: "success",
    });
  };

  const confirmFlagChange = async () => {
    if (dialogFlagTag.value !== undefined) {
      await setFlag({ flag: dialogFlagTag.value, value: false });
      window.location.reload();
    }
  };

  const hasKnownIssues = (issues?: string[]) =>
    issues !== undefined && issues.length > 0;

  return {
    flags,
    isLoading,
    dialogOpen,
    dialogFlagTag,
    handleDialogOpen,
    handleDialogClose,
    handleFlagChange,
    confirmFlagChange,
    hasKnownIssues,
  };
};
