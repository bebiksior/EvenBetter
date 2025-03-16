import { createFeature } from "@/features/manager";
import { CaidoSDK } from "@/types";
import { downloadFile, importFile } from "@/utils/file-utils";
import { EvenBetterAPI } from "@bebiks/evenbetter-api";
import { PageOpenEvent } from "@bebiks/evenbetter-api/src/events/onPageOpen";
import { RequestRawInput } from "@caido/sdk-frontend/src/types/__generated__/graphql-sdk";


let shareReplayCollectionsElements: HTMLElement[] = [];
let mutationObserver: MutationObserver | null = null;
let cancelFunctions: (() => void)[] = [];

export const shareReplayCollections = createFeature(
  "share-replay-collections",
  {
    onFlagEnabled: (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
      collectionsShare(sdk, evenBetterAPI);
    },
    onFlagDisabled: (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
      shareReplayCollectionsElements.forEach((element) => {
        element.remove();
      });

      cancelFunctions.forEach((cancelFunction) => cancelFunction());

      if (mutationObserver) {
        mutationObserver.disconnect();
        mutationObserver = null;
      }
    },
  }
);

const collectionsShare = (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
  cancelFunctions.push(
    evenBetterAPI.eventManager.on("onProjectChange", () => {
      if (window.location.hash === "#/replay") {
        attachImportButton(sdk, evenBetterAPI);

        setTimeout(() => {
          attachExportButton(sdk, evenBetterAPI);
        }, 500);
      }
    })
  );

  cancelFunctions.push(
    evenBetterAPI.eventManager.on("onPageOpen", (data: PageOpenEvent) => {
      if (data.newUrl === "#/replay") {
        attachImportButton(sdk, evenBetterAPI);
        attachExportButton(sdk, evenBetterAPI);

        if (mutationObserver) mutationObserver.disconnect();

        mutationObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
              attachExportButton(sdk, evenBetterAPI);
            }
          });
        });

        const tree = document.querySelector(
          ".c-session-list-body__tree .c-tree"
        );
        if (!tree) return;

        mutationObserver.observe(tree, {
          childList: true,
          subtree: true,
        });
      }
    })
  );
};

const getCollectionByID = async (collectionID: string, sdk: CaidoSDK) => {
  return await sdk.graphql.replaySessionCollections().then((data) => {
    const collections = data.replaySessionCollections.edges;

    return collections.find(
      (collection) => collection.node.id === collectionID
    );
  });
};

const createSession = async (
  collectionID: string,
  request: RequestRawInput,
  sdk: CaidoSDK
) => {
  return await sdk.graphql.createReplaySession({
    input: {
      collectionId: collectionID,
      requestSource: {
        raw: request,
      },
    },
  });
};

const createCollection = async (collectionName: string, sdk: CaidoSDK) => {
  return await sdk.graphql.createReplaySessionCollection({
    input: {
      name: collectionName,
    },
  });
};

const downloadCollection = async (
  collectionID: string,
  sdk: CaidoSDK,
  evenBetterAPI: EvenBetterAPI
) => {
  const collection = await getCollectionByID(collectionID, sdk);
  if (!collection) return new Error("Collection not found");

  const replayEntries = [];

  const sessions = collection.node.sessions;
  if (sessions && sessions.length > 0) {
    for (const session of sessions) {
      const entryID = session.activeEntry?.id;
      if (!entryID) continue;

      const replayEntry = await sdk.graphql.replayEntry({
        id: entryID,
      });

      replayEntries.push({ ...replayEntry.replayEntry, name: session.name });
    }
  }

  const collectionExport = {
    name: collection.node.name,
    replayEntries: replayEntries,
  };

  const collectionName = collection.node.name.replaceAll(" ", "_");

  downloadFile(
    "collection_" + collectionName + ".json",
    JSON.stringify(collectionExport)
  );

  sdk.window.showToast("Collection downloaded successfully!", {
    duration: 3000,
    variant: "success",
  });
};

const importCollection = async (
  collection: any,
  sdk: CaidoSDK,
  evenBetterAPI: EvenBetterAPI
) => {
  const collectionName = collection.name;
  const newCollection = await createCollection(collectionName, sdk);

  const newCollectionID =
    newCollection.createReplaySessionCollection.collection?.id;
  if (!newCollectionID) return;

  const replayEntries = collection.replayEntries;
  if (replayEntries && replayEntries.length > 0) {
    for (const replayEntry of replayEntries) {
      const requestRawInput: RequestRawInput = {
        connectionInfo: {
          host: replayEntry.connection.host,
          port: replayEntry.connection.port,
          isTLS: replayEntry.connection.isTls,
        },
        raw: replayEntry.raw,
      };

      const newSession = await createSession(
        newCollectionID,
        requestRawInput,
        sdk
      );

      const sesionID = newSession.createReplaySession.session?.id;
      if (!sesionID) return;

      await sdk.graphql.renameReplaySession({
        id: sesionID,
        name: replayEntry.name,
      });
    }
  }

  evenBetterAPI.toast.showToast({
    message: "Collection imported successfully!",
    duration: 3000,
    position: "bottom",
    type: "success",
  });

  return newCollectionID;
};

const attachImportButton = (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
  if (document.querySelector("#import-collection")) return;

  const topbarLeft = document.querySelector(".c-topbar__left");
  if (!topbarLeft) return;

  const importButton = sdk.ui.button({
    label: "Import Collection",
    variant: "tertiary",
    size: "small",
    leadingIcon: "fas fa-file-import",
  });
  shareReplayCollectionsElements.push(importButton);

  importButton.id = "import-collection";

  importButton.style.float = "left";
  importButton.style.marginRight = "1em";
  importButton.addEventListener("click", async () => {
    importFile(".json", async (content: string) => {
      try {
        const collection = JSON.parse(content);
        await importCollection(collection, sdk, evenBetterAPI);

        setTimeout(() => {
          window.location.reload();
        }, 25);
      } catch (error) {
        console.error("Failed to import collection:", error);
        evenBetterAPI.toast.showToast({
          message: "Failed to import collection",
          duration: 3000,
          position: "bottom",
          type: "error",
        });
      }
    });
  });

  topbarLeft.prepend(importButton);
};

const attachExportButton = (sdk: CaidoSDK, evenBetterAPI: EvenBetterAPI) => {
  const collections = document.querySelectorAll(".c-tree-collection");
  if (!collections || collections.length === 0) return;

  collections.forEach((collection) => {
    if (collection.querySelector("#download-collection")) return;

    const actions = collection.querySelector(".c-tree-collection__actions");
    if (!actions) return;

    const newElement = actions.childNodes[0]?.cloneNode(true) as HTMLElement;
    if (!newElement) return;

    shareReplayCollectionsElements.push(newElement);

    const icon = newElement.querySelector("i");
    if (!icon) return;

    newElement.id = "download-collection";
    icon.classList.value = "c-icon fas fa-file-arrow-down";
    newElement.addEventListener("click", async () => {
      const collectionID = collection.getAttribute("data-collection-id");
      if (!collectionID) return;

      const err = await downloadCollection(collectionID, sdk, evenBetterAPI);
      if (err) {
        evenBetterAPI.toast.showToast({
          message: "Failed to download collection: " + err,
          duration: 3000,
          position: "bottom",
          type: "error",
        });
      }
    });

    actions.prepend(newElement);
  });
};
