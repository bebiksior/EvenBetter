import { type Caido } from "@caido/sdk-frontend";
import { type API, type BackendEvents } from "backend";

export type FrontendSDK = Caido<API, BackendEvents>;
