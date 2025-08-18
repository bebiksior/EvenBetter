---
globs:
alwaysApply: true
description: Caido HTTP Proxy Overview
---

## What is Caido

Caido is a lightweight web application security auditing toolkit designed to help security professionals audit web applications with efficiency and ease

Key features include:
  - HTTP proxy for intercepting and viewing requests in real-time
  - Replay functionality for resending and modifying requests to test endpoints
  - Automate feature for testing requests against wordlists
  - Match & Replace for automatically modifying requests with regex rules
  - HTTPQL query language for filtering through HTTP traffic
  - Workflow system for creating custom encoders/decoders and plugins
  - Project management for organizing different security assessments

## Environment

We are running in a plugin environment where we can interact with Caido through the Caido Backend or Frontend SDK.

### Plugin Structure

- `packages/backend` → Backend plugin code - handles server-side logic, data processing, and API endpoints
- `packages/frontend` → Frontend plugin code - handles UI components, user interactions, and calls to backend

### Plugin Development

Plugins consist of:
- A `caido.config.ts` configuration file
- Frontend plugin (optional) - provides UI using Caido Frontend SDK
- Backend plugin (optional) - provides server-side functionality using Caido Backend SDK

These are packaged together as a single plugin package that can be installed in Caido.

### Key Development Concepts

- Frontend plugins create pages, UI components, and handle user interactions
- Backend plugins register API endpoints that can be called from frontend
- Communication between frontend and backend happens through registered API calls

### Caido Findings SDK

Findings allow you to create alerts when Caido detects notable characteristics in requests/responses based on conditional statements. When triggered, they generate alerts to draw attention to interesting traffic.

Example - Create a finding for successful responses:
```typescript
await sdk.findings.create({
  title: `Success Response ${response.getCode()}`,
  description: `Request ID: ${request.getId()}\nResponse Code: ${response.getCode()}`,
  reporter: "Response Logger Plugin",
  request: request,
  dedupeKey: `${request.getPath()}-${response.getCode()}` // Prevents duplicates
});
```

### Important Caido SDK Types

```typescript
export type Request = {
  getId(): ID;
  getHost(): string;
  getPort(): number;
  getTls(): boolean;
  getMethod(): string;
  getPath(): string;
  getQuery(): string;
  getUrl(): string;
  getHeaders(): Record<string, Array<string>>;
  getHeader(name: string): Array<string> | undefined;
  getBody(): Body | undefined;
  getRaw(): RequestRaw;
  getCreatedAt(): Date;
  toSpec(): RequestSpec;
  toSpecRaw(): RequestSpecRaw;
};

export type Response = {
  getId(): ID;
  getCode(): number;
  getHeaders(): Record<string, Array<string>>;
  getHeader(name: string): Array<string> | undefined;
  getBody(): Body | undefined;
  getRaw(): ResponseRaw;
  getRoundtripTime(): number;
  getCreatedAt(): Date;
};
```

For Body and Raw you can use methods like `getBody()?.toText()` to extract text content.

These types can be imported by:
```
import { type Request, type Response } from "caido:utils";
```
