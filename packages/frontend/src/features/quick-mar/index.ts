import { createFeature } from "@/features/manager";
import { type FrontendSDK } from "@/types";

const init = (sdk: FrontendSDK) => {
  sdk.commands.register("evenbetter:quickmar", {
    name: "Send to Match & Replace",
    run: (context) => {
      if (
        context.type === "RequestContext" ||
        context.type === "ResponseContext"
      ) {
        const selection = context.selection;
        if (selection === "") {
          sdk.window.showToast("No selection", {
            variant: "warning",
          });
          return;
        }

        const type = context.type === "RequestContext" ? "request" : "response";
        sendToMatchAndReplace(selection, sdk, type);
      }
    },
  });

  sdk.menu.registerItem({
    commandId: "evenbetter:quickmar",
    leadingIcon: "fas fa-wrench",
    type: "Request",
  });

  sdk.menu.registerItem({
    commandId: "evenbetter:quickmar",
    leadingIcon: "fas fa-wrench",
    type: "Response",
  });
};

const sendToMatchAndReplace = async (
  selection: string,
  sdk: FrontendSDK,
  type: "request" | "response",
) => {
  if (!selection) return;

  sdk.navigation.goTo("/tamper");

  const collections = sdk.matchReplace.getCollections();

  let collectionID: string;
  if (collections.length === 0) {
    const newCollection = await sdk.matchReplace.createCollection({
      name: "EvenBetter Collection",
    });

    collectionID = newCollection.id;
  } else {
    const firstCollection = collections[0];
    if (!firstCollection) return;

    collectionID = firstCollection.id;
  }

  let name = selection;
  if (selection.length > 30) {
    name = selection.substring(0, 30) + "...";
  }

  sdk.matchReplace
    .createRule({
      name,
      query: "",
      section: {
        kind: type === "request" ? "SectionRequestBody" : "SectionResponseBody",
        operation: {
          kind: "OperationBodyRaw",
          matcher: {
            kind: "MatcherRawValue",
            value: selection,
          },
          replacer: {
            kind: "ReplacerTerm",
            term: "",
          },
        },
      },
      collectionId: collectionID,
    })
    .catch((err) => {
      console.error(err);
      sdk.window.showToast("Error occured while creating M&R rule.", {
        variant: "error",
      });
    });
};

export const quickMatchAndReplace = createFeature("quick-mar", {
  onFlagEnabled: (sdk: FrontendSDK) => {
    init(sdk);
  },
  onFlagDisabled: (sdk: FrontendSDK) => {
    location.reload();
  },
});
