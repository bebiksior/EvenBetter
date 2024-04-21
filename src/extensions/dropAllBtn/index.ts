import { Caido } from "@caido/sdk-frontend";
import EvenBetterAPI from "@bebiks/evenbetter-api";
import { PageOpenEvent } from "@bebiks/evenbetter-api/src/events/onPageOpen";

const dropRequests = async () => {
  try {
    Caido.graphql.interceptRequestMessages({ first: 1000 }).then((response) => {
      return response.interceptMessages.nodes.forEach((node) => {
        Caido.graphql.dropInterceptMesage({ id: node.id });
      });
    });

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
  EvenBetterAPI.eventManager.on("onPageOpen", (event: PageOpenEvent) => {
    if (event.newUrl.startsWith("#/forward/")) attachNewButton();
  });
};
