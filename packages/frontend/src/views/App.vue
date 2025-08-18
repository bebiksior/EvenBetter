<script setup lang="ts">
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";

import { FlagsList } from "@/components/FlagsList";
import { Settings } from "@/components/Settings";
</script>

<template>
  <div class="h-full flex flex-col">
    <Splitter class="h-full">
      <SplitterPanel :size="40" :min-size="20">
        <Settings />
      </SplitterPanel>
      <SplitterPanel :size="60" :min-size="20">
        <FlagsList />
      </SplitterPanel>
    </Splitter>
  </div>
</template>
