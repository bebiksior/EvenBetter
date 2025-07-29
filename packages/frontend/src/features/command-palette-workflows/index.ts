import { createFeature } from "@/features/manager";
import { CaidoSDK } from "@/types";
import { EvenBetterAPI } from "@bebiks/evenbetter-api";

interface Workflow {
  id: string;
  name: string;
  kind: string;
}

let registeredCommandIds: string[] = [];

const registerWorkflowCommand = (workflow: Workflow, sdk: CaidoSDK) => {
  // Skip if not a convert workflow
  if (workflow.kind !== "Convert") {
    return;
  }

  const commandId = `evenbetter:workflow:${workflow.id}`;

  // Check if command is already registered to avoid duplicates
  if (registeredCommandIds.includes(commandId)) {
    return;
  }

  try {
    sdk.commands.register(commandId, {
      name: `c ${workflow.name}`,
      group: "Convert Workflows",
      run: async () => {
        try {
          // Get the selected text from the active editor
          const selectedText = sdk.window.getActiveEditor()?.getSelectedText();

          if (!selectedText) {
            sdk.window.showToast("No text selected", {
              variant: "warning",
            });
            return;
          }

          // Run the convert workflow with the selected text
          const result = await sdk.graphql.runConvertWorkflow({
            id: workflow.id,
            input: selectedText
          });

          if (result.runConvertWorkflow.error) {
            sdk.window.showToast(`Workflow error: ${result.runConvertWorkflow.error}`, {
              variant: "error",
            });
            return;
          }

          // Get the output
          const output = result.runConvertWorkflow.output;
          if (output !== undefined && output !== null) {
            // Check if the active editor is read-only
            const activeEditor = sdk.window.getActiveEditor();
            if (!activeEditor) {
              sdk.window.showToast("No active editor", {
                variant: "error",
              });
              return;
            }
            if (activeEditor.isReadOnly()) {
              // Copy output to clipboard
              navigator.clipboard.writeText(output).then(() => {
                sdk.window.showToast("Copied: " + output.substring(0, 30) + "...", {
                    variant: "info",
                    duration: 7000,
                });
              }).catch(() => {
                sdk.window.showToast("Failed to copy output", {
                  variant: "error",
                });
              });
            } else {
              // Replace the selected text with the workflow output for editable editors
              activeEditor.replaceSelectedText(output);
            }
          }

        } catch (error) {
          console.error("Error running workflow:", error);
          sdk.window.showToast("Failed to run workflow", {
            variant: "error",
          });
        }
      },
    });

    registeredCommandIds.push(commandId);
    sdk.commandPalette.register(commandId);
  } catch (error) {
    console.error(`Failed to register command for workflow ${workflow.name}:`, error);
  }
};

const loadExistingWorkflows = async (sdk: CaidoSDK) => {
  try {
    const workflows = sdk.workflows.getWorkflows();

    // Register commands for each existing convert workflow
    workflows.forEach(workflow => {
      registerWorkflowCommand(workflow, sdk);
    });

  } catch (error) {
    console.error("Failed to load existing workflows:", error);
    sdk.window.showToast("[EvenBetter] Failed to load existing workflows", {
      variant: "error",
    });
  }
};

const setupWorkflowListener = (sdk: CaidoSDK) => {
  // Listen for new workflows being created
  sdk.workflows.onCreatedWorkflow((workflow) => {
    registerWorkflowCommand(workflow.workflow, sdk);
  });
};

const init = (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
  // Load existing workflows and register their commands
  loadExistingWorkflows(sdk);

  // Set up listener for new workflows
  setupWorkflowListener(sdk);
};

const cleanup = (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
  // Clear registered command IDs when feature is disabled
  registeredCommandIds = [];
  window.location.reload(); //This will reload the page and it wont trigger the onFlagEnabled again
};

export const commandPaletteWorkflows = createFeature(
  "command-palette-workflows",
  {
    onFlagEnabled: init,
    onFlagDisabled: cleanup,
  }
);
