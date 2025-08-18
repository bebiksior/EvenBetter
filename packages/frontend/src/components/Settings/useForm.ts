import { computed, ref, watch } from "vue";

import { useSettingsQuery, useUpdateSetting } from "@/queries/settings";

export const useForm = () => {
  const fontOptions = [
    "Default",
    "JetBrains Mono",
    "Fira Code",
    "Roboto Mono",
    "Inconsolata",
  ];

  const { data, isLoading, error } = useSettingsQuery();
  const { updateSetting, isPending } = useUpdateSetting();

  const localSettings = ref({ customFont: "" });
  const hasChanges = computed(() => {
    return (
      data.value !== undefined &&
      localSettings.value.customFont !== data.value.customFont
    );
  });

  watch(
    () => data.value,
    (v) => {
      if (v !== undefined) {
        localSettings.value = { customFont: v.customFont };
      }
    },
    { immediate: true },
  );

  const handleSave = async () => {
    if (localSettings.value.customFont !== undefined) {
      await updateSetting({
        key: "customFont",
        value: localSettings.value.customFont,
      });
    }
  };

  const openLink = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return {
    data,
    isLoading,
    error,
    isPending,
    fontOptions,
    localSettings,
    hasChanges,
    handleSave,
    openLink,
  };
};
