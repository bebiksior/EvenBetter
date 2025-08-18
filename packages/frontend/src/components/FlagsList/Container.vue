<script setup lang="ts">
import Button from "primevue/button";
import Card from "primevue/card";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Dialog from "primevue/dialog";
import ToggleSwitch from "primevue/toggleswitch";

import { useForm } from "./useForm";

const {
  flags,
  isLoading,
  dialogOpen,
  handleDialogClose,
  handleFlagChange,
  confirmFlagChange,
  hasKnownIssues,
} = useForm();
</script>

<template>
  <Card
    class="h-full"
    :pt="{
      body: { class: 'h-full p-0' },
      content: { class: 'h-full flex flex-col p-0' },
    }"
  >
    <template #content>
      <div class="p-4 text-base font-bold">Features</div>

      <div class="overflow-y-auto">
        <DataTable
          :value="flags || []"
          :loading="isLoading"
          striped-rows
          size="small"
        >
          <Column field="tag" header="Name">
            <template #body="{ data }">
              <span>{{ data.tag }}</span>
              <span
                v-if="hasKnownIssues(data.knownIssues)"
                v-tooltip.top="
                  'Known issues: \n' + data.knownIssues?.join('\n')
                "
                class="ml-2"
              >
                <i class="fas fa-info-circle text-surface-300"></i>
              </span>
            </template>
          </Column>
          <Column field="description" header="Description">
            <template #body="{ data }">
              <span class="text-surface-200">{{ data.description }}</span>
            </template>
          </Column>
          <Column field="kind" header="Kind" />
          <Column header="Requires Refresh?">
            <template #body="{ data }">
              {{ data.requiresReload ? "Yes" : "No" }}
            </template>
          </Column>
          <Column header="Enabled">
            <template #body="{ data }">
              <ToggleSwitch
                :model-value="data.enabled"
                @update:model-value="() => handleFlagChange(data)"
              />
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="dialogOpen"
          header="Confirm Flag Change"
          modal
          :closable="false"
        >
          <p>
            Disabling this flag will require a page reload. Are you sure you
            want to change it?
          </p>
          <template #footer>
            <Button label="Cancel" @click="handleDialogClose" />
            <Button label="Confirm" @click="confirmFlagChange" />
          </template>
        </Dialog>
      </div>
    </template>
  </Card>
</template>
