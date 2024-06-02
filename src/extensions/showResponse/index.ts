import { getEvenBetterAPI } from "../../utils/evenbetterapi";
import { CA_SSRF_INSTANCE_API_URL, customizeHTTPResponse } from "../quickSSRFInstance/providers/cvssadvisor";
import { PageOpenEvent } from "@bebiks/evenbetter-api/src/events/onPageOpen";
import { getCaidoAPI } from "../../utils/caidoapi";

type ParsedResponse = {
  httpVersion: string;
  statusCode: string;
  statusText: string;
  headers: string[];
  body: string;
};

const parseHttpResponse = (response: string): ParsedResponse => {
  const [statusLine, ...headersAndBody] = response.split('\r\n');
  if (!statusLine) {
    throw new Error('Invalid response');
  }

  const [httpVersion, statusCode, statusText] = statusLine.split(' ');
  if (!httpVersion || !statusCode || !statusText) {
    throw new Error('Invalid status line');
  }

  const headers = headersAndBody.slice(0, headersAndBody.indexOf(''));
  const body = headersAndBody.slice(headersAndBody.indexOf('') + 1).join('\r\n');

  return {
    httpVersion,
    statusCode,
    statusText,
    headers,
    body,
  };
};

const getCurrentResponse = async () => {
  const cResponse = document.querySelector('.c-response .c-response');
  if (!cResponse) return;

  const responseID = cResponse.getAttribute('data-response-id');
  if (!responseID) return;

  return await getCaidoAPI().graphql.response({ id: responseID }).then((data) => {
    return data.response?.raw
  });
}

const attachPreviewButton = () => {
  const actions = document.querySelector('.c-response-header .c-response-header__right .c-response-header__actions') as HTMLElement;
  if (!actions) return;

  if (actions.querySelector('#preview-button')) return;

  actions.style.display = "flex";
  actions.style.gap = "1em";

  const previewButton = getCaidoAPI().ui.button({
    variant: "tertiary",
    size: "small",
    leadingIcon: "fas fa-eye",
  });
  previewButton.id = "preview-button";

  const button = previewButton.querySelector("button") as HTMLElement;
  button.style.backgroundColor = "var(--c-bg-default)";

  const leadingIcon = previewButton.querySelector(".c-button__leading-icon") as HTMLElement;
  leadingIcon.style.margin = "0";
  leadingIcon.style.color = "white";

  previewButton.addEventListener("click", async () => {
    const response = await getCurrentResponse();
    if (!response) {
      getEvenBetterAPI().toast.showToast({
        message: "Failed to get response",
        type: "error",
        duration: 3000,
        position: "bottom",
      });
      return;
    }

    const parsedResponse = parseHttpResponse(response);
    sendToCA(parsedResponse);
  });

  actions.appendChild(previewButton);
}

const sendToCA = (response: ParsedResponse) => {
  return fetch(CA_SSRF_INSTANCE_API_URL, {
    method: "POST",
  }).then((response) => response.json()).then((data) => {
    const ssrfInstanceID = data;
    console.log(response);
    customizeHTTPResponse(ssrfInstanceID, parseInt(response.statusCode), response.body, response.headers.join('\r\n')).then((res) => {
      setTimeout(() => navigator.clipboard.writeText(`https://${ssrfInstanceID}.c5.rs/`), 0);

      getEvenBetterAPI().toast.showToast({
        message: "Navigate to the copied URL to view the response!",
        type: "success",
        duration: 3000,
        position: "bottom",
      });
    }).catch((err) => {
      getEvenBetterAPI().toast.showToast({
        message: "Failed to send response to CVSSAdvisor!",
        type: "error",
        duration: 3000,
        position: "bottom",
      })
      console.error(err);
    }); 
  });
}

let interceptObserver: MutationObserver;
const observeChangesIntercept = () => {
  interceptObserver?.disconnect();

  const targetNode = document.querySelector(".c-intercept .c-grid .c-grid .c-grid-item ~ .c-grid-item");
  if (!targetNode) {
    console.warn("Target node not found.");
    return;
  }
  
  const config = { attributes: true, childList: true, subtree: true };
  const callback = (mutationsList: MutationRecord[]) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList')
        attachPreviewButton();
    }
  };

  interceptObserver = new MutationObserver(callback);
  interceptObserver.observe(targetNode, config);
}

let replayObserver: MutationObserver | null = null;

const observeChangesReplay = () => {
  replayObserver?.disconnect();

  attachPreviewButton();
  const targetNode = document.querySelector(".c-replay__replay-session");
  if (!targetNode) {
    console.warn("Target node not found.");
    return;
  }

  const config = { attributes: true, childList: true, subtree: true };

  const callback = (mutationsList: MutationRecord[]) => {
    for (const mutation of mutationsList) {
      for (const node of Array.from(mutation.addedNodes)) {
        if (
          node instanceof HTMLElement &&
          (node.classList.contains("c-replay-session") ||
            node.classList.contains("c-response"))
        ) {
          attachPreviewButton();
        }
      }
    }
  };

  replayObserver = new MutationObserver(callback);
  replayObserver.observe(targetNode, config);
};

export const showResponse = () => {
  getEvenBetterAPI().eventManager.on("onPageOpen", (event: PageOpenEvent) => {
    if (event.newUrl === "#/intercept") {
      observeChangesIntercept();
    } else if (event.newUrl === "#/replay") {
      observeChangesReplay();
    } else {
      interceptObserver?.disconnect();
      replayObserver?.disconnect();
    }
  });
}