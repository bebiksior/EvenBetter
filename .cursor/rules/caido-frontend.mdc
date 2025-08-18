---
globs:
  - "**/packages/frontend/**"
alwaysApply: true
description: Caido Frontend SDK Rules and Patterns
---

## Caido Frontend SDK

### Overview

The Caido Frontend SDK is used for creating UI components, pages, and handling user interactions in Caido plugins.

### Entry Point

Frontend plugins are initialized via `packages/frontend/src/index.ts`:

```typescript
import { Caido } from "@caido/sdk-frontend";
import { API, BackendEvents } from "backend";

// Define SDK type with backend API
export type FrontendSDK = Caido<API, BackendEvents>;

// Plugin initialization
export const init = (sdk: FrontendSDK) => {
  // Create pages and UI
  createPage(sdk);

  // Register sidebar items
  sdk.sidebar.registerItem("My Plugin", "/my-plugin-page", {
    icon: "fas fa-rocket"
  });

  // Register commands
  sdk.commands.register("my-command", {
    name: "My Custom Command",
    run: () => sdk.backend.myCustomFunction("Hello"),
  });
};
```

### SDK Type Definitions

#### For plugins WITHOUT backend, this is fine:
```typescript
export type FrontendSDK = Caido<Record<string, never>, Record<string, never>>;
```

#### For plugins WITH backend:
```typescript
import { Caido } from "@caido/sdk-frontend";
import { API, BackendEvents } from "backend";

export type FrontendSDK = Caido<API, BackendEvents>;
```

### Command Pattern

Commands provide a unified way to register actions that can be triggered from:
- Command palette (Ctrl/Cmd+Shift+P)
- Context menus (right-click)
- UI buttons
- Keyboard shortcuts

Commands is a frontend-only concept.

```typescript
// Define command IDs as constants
const Commands = {
  processData: "my-plugin.process-data",
  exportResults: "my-plugin.export-results",
} as const;

// Register commands
sdk.commands.register(Commands.processData, {
  name: "Process Data",
  run: async () => {
    const result = await sdk.backend.processData();
    sdk.window.showToast(`Processed ${result.count} items`, {
      variant: "success"
    });
  },
  group: "My Plugin",
});

// Add to command palette
sdk.commandPalette.register(Commands.processData);

// Add to context menus
sdk.menu.registerItem({
  type: "Request",
  commandId: Commands.processData,
  leadingIcon: "fas fa-cog",
});
```

### Working with Requests and Responses

#### Creating and Sending Requests

```typescript
import { RequestSpec } from "caido:utils";
import { type Request, type Response } from "caido:utils";

// Create a new request
const spec = new RequestSpec("https://api.example.com/data");
spec.setMethod("POST");
spec.setHeader("Content-Type", "application/json");
spec.setBody(JSON.stringify({ key: "value" }));

// Send the request
const result = await sdk.requests.send(spec);
if (result.response) {
  const statusCode = result.response.getCode();
  const responseBody = result.response.getBody()?.toText();
}
```

#### Working with Request/Response Editors

```typescript
// Create editors for viewing/editing HTTP data
const reqEditor = sdk.ui.httpRequestEditor();
const respEditor = sdk.ui.httpResponseEditor();

// Get DOM elements
const reqElement = reqEditor.getElement();
const respElement = respEditor.getElement();

// Style and layout
reqElement.style.width = "50%";
respElement.style.width = "50%";

const editorsContainer = document.createElement("div");
editorsContainer.style.display = "flex";
editorsContainer.appendChild(reqElement);
editorsContainer.appendChild(respElement);
```

### Frontend Error Handling

When calling backend APIs from the frontend, handle Result types gracefully:

```typescript
// Frontend usage - no try/catch needed
const handleProcess = async () => {
  const result = await sdk.backend.processData(inputValue);

  if (result.kind === "Error") {
    sdk.window.showToast(result.error, { variant: "error" });
    return;
  }

  // Handle successful result
  const data = result.value;
  sdk.window.showToast("Processing completed!", { variant: "success" });
};
```
