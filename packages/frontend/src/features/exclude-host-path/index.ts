import { createFeature } from "@/features/manager";
import { CaidoSDK } from "@/types";
import { EvenBetterAPI } from "@bebiks/evenbetter-api";

const excludeHostPathFunctionality = (
  sdk: CaidoSDK,
  evenBetterAPI: EvenBetterAPI
) => {
  sdk.commands.register("eb:excludehost", {
    name: "Exclude Host",
    run: async () => {
      const selectedRequest = await getSelectedRequest(sdk);
      if (!selectedRequest) return;

      const currentQuery = sdk.httpHistory.getQuery();
      const newQuery = currentQuery
        ? `${currentQuery} AND req.host.ne:"${selectedRequest.host}"`
        : `req.host.ne:"${selectedRequest.host}"`;
      sdk.httpHistory.setQuery(newQuery);
    },
  });

  sdk.menu.registerItem({
    type: "RequestRow",
    commandId: "eb:excludehost",
    leadingIcon: "fa fa-ban",
  });

  sdk.commands.register("eb:excludepath", {
    name: "Exclude Path",
    run: async () => {
      const selectedRequest = await getSelectedRequest(sdk);
      if (!selectedRequest) return;

      const currentQuery = sdk.httpHistory.getQuery();
      const newQuery = currentQuery
        ? `${currentQuery} AND req.path.ne:"${selectedRequest.path}"`
        : `req.path.ne:"${selectedRequest.path}"`;
      sdk.httpHistory.setQuery(newQuery);
    },
  });

  sdk.menu.registerItem({
    type: "RequestRow",
    commandId: "eb:excludepath",
    leadingIcon: "fa fa-ban",
  });
};

const getSelectedRequestID = () => {
  return document
    .querySelector("[data-request-id]")
    ?.getAttribute("data-request-id");
};

const getSelectedRequest = async (sdk: CaidoSDK) => {
  const selectedRequestID = getSelectedRequestID();
  if (!selectedRequestID) return;

  const request = await sdk.graphql.request({
    id: selectedRequestID,
  });

  return request?.request;
};

export const excludeHostPath = createFeature("exclude-host-path", {
  onFlagEnabled: (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
    excludeHostPathFunctionality(sdk, evenBetterAPI);
  },
  onFlagDisabled: (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
    location.reload();
  },
});
