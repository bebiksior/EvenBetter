import EvenBetterAPI from "@bebiks/evenbetter-api";
import { Request } from "../events/onSSRFHit";
import { CA_SSRF_INSTANCE_API_URL } from "./providers/cvssadvisor";
import { poll, register } from "./providers/interactsh";
import { setSetting } from "../../settings";
import { refreshInputs } from "./navigation/navigation";

export enum SSRFInstanceType {
  CVSSADVISOR = "ssrf.cvssadvisor.com",
  INTERACTSH = "interactsh.com",
}

export enum SSRFInstanceState {
  ACTIVE = "ACTIVE",
  CREATING = "CREATING",
}

export interface SSRFInstance {
  id: string;
  url: string;
  type: SSRFInstanceType;
  state: SSRFInstanceState;

  privateKey?: CryptoKey;
  secretKey?: string;
}

export let ssrfInstance: SSRFInstance | null = null;
export const setSSRFInstance = (instance: SSRFInstance) =>
  (ssrfInstance = instance);

let addedIDs: string[] = [];
export const pullSSRFHits = () => {
  if (!ssrfInstance) return;

  switch (ssrfInstance.type) {
    case SSRFInstanceType.CVSSADVISOR:
      fetch(CA_SSRF_INSTANCE_API_URL + "/" + ssrfInstance.id)
        .then((response) => response.json())
        .then((data) => {
          const requestsHistory = data.requests_history;
          if (!requestsHistory || requestsHistory?.length === 0) return;

          requestsHistory.forEach((request: Request) => {
            if (addedIDs.includes(request.id)) return;

            request.timestamp = request.timestamp * 1000;
            EvenBetterAPI.eventManager.triggerEvent("onSSRFHit", request);

            addedIDs.push(request.id);
          });
        })
        .catch(() => {
          refreshSSRFInstance(SSRFInstanceType.CVSSADVISOR).then(() =>
            refreshInputs()
          );
        });
      break;
    case SSRFInstanceType.INTERACTSH:
      if (ssrfInstance.secretKey == null) return;

      poll(
        ssrfInstance.secretKey,
        ssrfInstance.id,
        ssrfInstance.privateKey
      ).then((data) => {
        if (!data || !data.decodedData) return;

        data.decodedData.forEach((item) => {
          const request: Request = {
            id: item.uniqueId,
            protocol: item.protocol.toUpperCase(),
            dump: item.rawRequest,
            ip: item.remoteAddress,
            timestamp: new Date(item.timestamp).getTime(),
          };

          EvenBetterAPI.eventManager.triggerEvent("onSSRFHit", request);
        });
      });
      break;
  }
};

export const refreshSSRFInstance = async (
  selectedInstanceType: SSRFInstanceType
) => {
  if (ssrfInstance && ssrfInstance.state === SSRFInstanceState.CREATING) return;

  switch (selectedInstanceType) {
    case SSRFInstanceType.CVSSADVISOR:
      return fetch(CA_SSRF_INSTANCE_API_URL, {
        method: "POST",
      })
        .then((response) => response.json())
        .then((data) => {
          setSSRFInstance({
            id: data,
            url: data + ".c5.rs",
            type: SSRFInstanceType.CVSSADVISOR,
            state: SSRFInstanceState.ACTIVE,
          });
          addedIDs = [];

          setSetting("ssrfInstanceTool", selectedInstanceType);
          setSetting("ssrfInstanceHostname", ssrfInstance.url);

          EvenBetterAPI.eventManager.triggerEvent("onSSRFInstanceChange");
        })
        .catch((e) => {
          console.error(e);
        });
    case SSRFInstanceType.INTERACTSH:
      return register()
        .then((data) => {
          if (data.responseStatusCode !== 200) {
            EvenBetterAPI.modal.openModal({
              title: "Error",
              content: "Failed to create interactsh instance",
            });

            return;
          }

          setSSRFInstance({
            id: data.correlationId,
            url: data.hostname,
            secretKey: data.secretKey,
            privateKey: data.privateKey,
            type: SSRFInstanceType.INTERACTSH,
            state: SSRFInstanceState.ACTIVE,
          });

          setSetting("ssrfInstanceTool", selectedInstanceType);
          setSetting("ssrfInstanceHostname", ssrfInstance.url);

          EvenBetterAPI.eventManager.triggerEvent("onSSRFInstanceChange");
        })
        .catch((e: any) => {
          console.error(e);
          if (
            e.message.includes("crypto.subtle") &&
            window.location.href === "#/evenbetter/quick-ssrf"
          ) {
            EvenBetterAPI.modal.openModal({
              title: "Error",
              content:
                "Interactsh.com isn't supported yet on non-local Caido instances :(",
            });
          }
        });
  }
};
