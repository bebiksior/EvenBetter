import { getEvenBetterAPI } from "../../utils/evenbetterapi";
import { PageOpenEvent } from "@bebiks/evenbetter-api/src/events/onPageOpen";
import { RequestRawInput } from "@caido/sdk-frontend/src/types/__generated__/graphql-sdk";
import { downloadFile } from "../../utils/files";
import { getCaidoAPI } from "../../utils/caidoapi";

const getCollectionByID = async (collectionID: string) => {
  return await getCaidoAPI().graphql.replaySessionCollections().then((data) => {
    const collections = data.replaySessionCollections.edges;

    return collections.find(
      (collection) => collection.node.id === collectionID
    );
  });
};

const createSession = async (
  collectionID: string,
  request: RequestRawInput
) => {
  return await getCaidoAPI().graphql.createReplaySession({
    input: {
      collectionId: collectionID,
      requestSource: {
        raw: request,
      },
    },
  });
};

const createCollection = async (collectionName: string) => {
  return await getCaidoAPI().graphql.createReplaySessionCollection({
    input: {
      name: collectionName,
    },
  });
};

const downloadCollection = async (collectionID: string) => {
  const collection = await getCollectionByID(collectionID);
  if (!collection) return new Error("Collection not found");

  const replayEntries = [];

  const sessions = collection.node.sessions;
  if (sessions && sessions.length > 0) {
    for (const session of sessions) {
      const entryID = session.activeEntry?.id;
      if (!entryID) continue;

      const replayEntry = await getCaidoAPI().graphql.replayEntry({
        id: entryID,
      });

      replayEntries.push({...replayEntry.replayEntry, name: session.name});
    }
  }

  const collectionExport = {
    name: collection.node.name,
    replayEntries: replayEntries,
  };


  const collectionName = collection.node.name.replaceAll(" ", "_");

  downloadFile("collection_" + collectionName + ".json", JSON.stringify(collectionExport));
  getEvenBetterAPI().toast.showToast({
    message: "Collection downloaded successfully!",
    duration: 3000,
    position: "bottom",
    type: "success",
  });
};

const importCollection = async (collection: any) => {
  const collectionName = collection.name;
  const newCollection = await createCollection(collectionName);

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
        raw: replayEntry.raw
      };

      const newSession = await createSession(newCollectionID, requestRawInput);

      const sesionID = newSession.createReplaySession.session?.id;
      if (!sesionID) return;

      await getCaidoAPI().graphql.renameReplaySession({
        id: sesionID,
        name: replayEntry.name,
      });
    }
  }

  getEvenBetterAPI().toast.showToast({
    message: "Collection imported successfully!",
    duration: 3000,
    position: "bottom",
    type: "success",
  });

  return newCollectionID;
};

const attachImportButton = () => {
  const topbarLeft = document.querySelector(".c-topbar__left");
  if (!topbarLeft) return;

  const importButton = getCaidoAPI().ui.button({
    label: "Import Collection",
    variant: "tertiary",
    size: "small",
    leadingIcon: "fas fa-file-import",
  });

  importButton.style.float = "left";
  importButton.style.marginRight = "1em";

  importButton.addEventListener("click", async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.click();

    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = async () => {
        const collection = JSON.parse(reader.result as string);
        await importCollection(collection);

        setTimeout(() => {
          window.location.reload();
        }, 25);
      };
    });
  });

  topbarLeft.prepend(importButton);
};

const attachExportButton = () => {
  const collections = document.querySelectorAll(".c-tree-collection");
  if (!collections || collections.length === 0) return;

  collections.forEach((collection) => {
    if (collection.querySelector("#download-collection")) return;

    const actions = collection.querySelector(".c-tree-collection__actions");
    if (!actions) return;

    const newElement = actions.childNodes[0]?.cloneNode(true) as HTMLElement;
    if (!newElement) return;

    const icon = newElement.querySelector("i");
    if (!icon) return;

    newElement.id = "download-collection";
    icon.classList.value = "c-icon fas fa-file-arrow-down";
    newElement.addEventListener("click", async () => {
      const collectionID = collection.getAttribute("data-collection-id");
      if (!collectionID) return;

      const err = await downloadCollection(collectionID);
      if (err) {
        getEvenBetterAPI().toast.showToast({
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

let mutationObserver: MutationObserver;
export const collectionsShare = () => {
  getEvenBetterAPI().eventManager.on("onPageOpen", (data: PageOpenEvent) => {
    if (data.newUrl === "#/replay") {
      attachImportButton();
      attachExportButton();

      if (mutationObserver)
        mutationObserver.disconnect();

      mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length > 0) {
            attachExportButton();
          }
        });
      });

      const tree = document.querySelector(".c-session-list-body__tree .c-tree");
      if (!tree) return;
      
      mutationObserver.observe(tree, {
        childList: true,
        subtree: true,
      });
    }
  });
};
