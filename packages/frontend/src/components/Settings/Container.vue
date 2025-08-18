<script setup lang="ts">
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Card from "primevue/card";
import Divider from "primevue/divider";
import Select from "primevue/select";

import { useForm } from "./useForm";

const {
  isLoading,
  error,
  isPending,
  fontOptions,
  localSettings,
  hasChanges,
  handleSave,
  openLink,
} = useForm();
</script>

<template>
  <div class="h-full flex flex-col gap-1">
    <Card
      :pt="{
        body: { class: 'p-0' },
        content: { class: 'flex flex-col' },
      }"
    >
      <template #content>
        <div class="p-4">
          <div class="text-base font-bold">Settings</div>

          <div v-if="isLoading" class="text-sm">Loading...</div>
          <div v-else-if="error" class="text-sm text-red-400">Error</div>
          <div v-else class="flex flex-col gap-3">
            <div class="flex flex-col gap-2 mt-2">
              <label class="text-sm text-surface-200" for="font-select"
                >Custom Font</label
              >
              <Select
                v-model="localSettings.customFont"
                input-id="font-select"
                :options="fontOptions"
                :disabled="isPending"
                class="w-full"
              />
            </div>

            <Button
              label="Save Changes"
              :disabled="!hasChanges || isPending"
              @click="handleSave"
            />
          </div>
        </div>
      </template>
    </Card>

    <Card
      class="flex-1"
      :pt="{
        body: { class: 'h-full p-0' },
        content: { class: 'h-full flex flex-col' },
      }"
    >
      <template #content>
        <div class="p-4 overflow-y-auto">
          <div class="flex items-center justify-between mb-3">
            <div class="text-base font-bold text-primary">About EvenBetter</div>
            <Button
              label="Star on GitHub"
              icon="fas fa-star"
              size="small"
              @click="openLink('https://github.com/bebiksior/evenbetter')"
            />
          </div>

          <div class="flex flex-col gap-2">
            <div class="text-sm">
              <b>EvenBetter</b> is a collection of tweaks to make Caido even
              better. You can find the source code on
              <a
                class="underline"
                href="https://github.com/bebiksior/evenbetter"
                target="_blank"
                rel="noopener noreferrer"
                >GitHub</a
              >.
            </div>
            <div class="text-sm">
              Feel free to contribute to the project :D You can also submit
              feature requests and bugs via the GitHub issues page. I'm always
              looking for new ideas and improvements!
            </div>
            <div class="text-sm">
              Thanks for using this plugin. I hope it makes your Caido
              experience better and more efficient.
            </div>
          </div>

          <Divider />

          <div class="flex flex-col gap-2">
            <div class="text-xs text-surface-400">
              Your feedback and suggestions are always welcome. My X profile is
              <a
                class="underline"
                href="https://x.com/bebiksior"
                target="_blank"
                rel="noopener noreferrer"
                >bebiksior</a
              >
              and my discord handle is <b>bebiks</b>
            </div>
            <div class="flex items-center gap-2">
              <Avatar
                image="https://avatars.githubusercontent.com/u/71410238?v=4&size=30"
                size="normal"
                shape="circle"
              />
              <div class="text-xs">
                Made with ❤️ by
                <a
                  class="underline"
                  href="https://x.com/bebiksior"
                  target="_blank"
                  rel="noopener noreferrer"
                  >bebiks</a
                >
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
