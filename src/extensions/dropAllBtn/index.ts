import eventManagerInstance from "../../events/EventManager";
import { PageOpenEvent } from "../../events/onPageOpen";
import log, { Logger } from "../../utils/Logger";

declare const Caido: any;

const dropRequest = async (id: string) => {
  try {
    const payload = {
      operationName: "dropInterceptMessage",
      query: `mutation dropInterceptMessage($id: ID!) {
          dropInterceptMessage(id: $id) {
            droppedId
          }
        }`,
      variables: { id: id },
    };

    const response = await fetch(document.location.origin + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          JSON.parse(localStorage.getItem("CAIDO_AUTHENTICATION")).accessToken,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error during dropRequest execution:", error);
  }
};

const fetchInterceptEntries = async () => {
  const queryPayload = {
    operationName: "interceptRequestMessages",
    query: `query interceptRequestMessages($first: Int!) {\n  interceptMessages(first: $first, kind: REQUEST) {\n    nodes {\n      ...interceptMessageMeta\n    }\n  }\n}\nfragment interceptMessageMeta on InterceptMessage {\n  __typename\n  ... on InterceptRequestMessage {\n    ...interceptRequestMessageMeta\n  }\n  ... on InterceptResponseMessage {\n    ...interceptResponseMessageMeta\n  }\n}\nfragment interceptRequestMessageMeta on InterceptRequestMessage {\n  __typename\n  id\n  request {\n    ...requestMeta\n  }\n}\nfragment requestMeta on Request {\n  __typename\n  id\n  host\n  port\n  path\n  query\n  method\n  edited\n  isTls\n  length\n  alteration\n  metadata {\n    ...requestMetadataFull\n  }\n  fileExtension\n  source\n  createdAt\n  response {\n    ...responseMeta\n  }\n}\nfragment requestMetadataFull on RequestMetadata {\n  color\n}\nfragment responseMeta on Response {\n  __typename\n  id\n  statusCode\n  roundtripTime\n  length\n  createdAt\n  alteration\n  edited\n}\nfragment interceptResponseMessageMeta on InterceptResponseMessage {\n  __typename\n  id\n  response {\n    ...responseMeta\n  }\n  request {\n    ...requestMeta\n  }\n}`,
    variables: {
      first: 1000,
    },
  };

  const response = await fetch(document.location.origin + "/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer " +
        JSON.parse(localStorage.getItem("CAIDO_AUTHENTICATION")).accessToken,
    },
    body: JSON.stringify(queryPayload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const jsonResponse = await response.json();
  return jsonResponse.data.interceptMessages.nodes.map((node: any) => node.id);
};

const dropRequests = async () => {
  try {
    const ids = await fetchInterceptEntries();
    for (let id of ids) {
      await dropRequest(id);
    }

    log.debug(`Dropped ${ids.length} requests`);

    setTimeout(refreshInterceptEntries, 25);
  } catch (error) {
    console.error("Error executing drop requests based on fetched IDs:", error);
  }
};

const refreshInterceptEntries = () => {
  (
    document.querySelector(`.c-global-actions__status button`) as HTMLElement
  ).click();
  setTimeout(() => {
    (
      document.querySelector(`.c-global-actions__status button`) as HTMLElement
    ).click();
  }, 5);
};

const attachNewButton = () => {
  document.querySelector("#dropAllButton")?.remove();

  const topbarLeft = document.querySelector(".c-topbar__left");

  const dropAllButton = Caido.ui.button({
    variant: "primary",
    label: "Drop all",
    size: "small",
  });
  dropAllButton.id = "dropAllButton";
  dropAllButton.addEventListener("click", dropRequests);

  topbarLeft.appendChild(dropAllButton);
};

export const dropAllButtonFeature = () => {
  eventManagerInstance.on("onPageOpen", (event: PageOpenEvent) => {
    if (event.newUrl.startsWith("#/forward/")) attachNewButton();
  });
};
