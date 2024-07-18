import { getCaidoAPI } from "../../utils/caidoapi";

export const excludeHostPathFunctionality = () => {
  const caido = getCaidoAPI();
  caido.commands.register("eb:excludehost", {
    name: "Exclude Host",
    run: async () => {
      const selectedRequest = await getSelectedRequest();
      if (!selectedRequest) return;

      addQuery(`req.host.ne:"${selectedRequest.host}"`)
    },
  });

  caido.menu.registerItem({
    type: "RequestRow",
    commandId: "eb:excludehost",
    leadingIcon: "fa fa-ban",
  });

  caido.commands.register("eb:excludepath", {
    name: "Exclude Path",
    run: async () => {
      const selectedRequest = await getSelectedRequest();
      if (!selectedRequest) return;

      addQuery(`req.path.ne:"${selectedRequest.path}"`);
    },
  });

  caido.menu.registerItem({
    type: "RequestRow",
    commandId: "eb:excludepath",
    leadingIcon: "fa fa-ban",
  });
};

const addQuery = async (query: string) => {
  const httpQL = document.querySelector(
    ".c-search-query-editor__editor .cm-line"
  ) as HTMLElement;
  if (!httpQL) return;

  if (!httpQL.querySelector(".cm-placeholder")) {
    httpQL.textContent += ` AND ${query}`;
  } else {
    httpQL.textContent = query;
  }

  const previousFocus = document.activeElement as HTMLElement;

  httpQL.focus();

  const enterEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key: "Enter",
    code: "Enter",
    keyCode: 13,
    charCode: 13,
  });

  httpQL.dispatchEvent(enterEvent);

  previousFocus?.focus();
}

const getSelectedRequestID = () => {
  return document.querySelector(".c-read-only-request")?.getAttribute("data-request-id");
}

const getSelectedRequest = async () => {
  const selectedRequestID = getSelectedRequestID();
  if (!selectedRequestID) return;

  const request = await getCaidoAPI().graphql.request({
    id: selectedRequestID,
  });

  return request?.request;
};


