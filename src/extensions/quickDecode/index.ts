import { getEvenBetterAPI } from "../../utils/evenbetterapi";
import { getSetting } from "../../settings";
import { PageOpenEvent } from "@bebiks/evenbetter-api/src/events/onPageOpen";
import "./quickDecode.css";

let selectedLineElements: HTMLElement[] = [];

const getLinesContainingSelection = () => {
  let selection = window.getSelection();
  if (!selection) {
    return [];
  }

  if (selection.rangeCount === 0) {
    return [];
  }

  let range = selection.getRangeAt(0);
  let startContainer = range.startContainer;
  let endContainer = range.endContainer;

  while (
    startContainer &&
    startContainer.parentElement &&
    !startContainer.parentElement.classList.contains("cm-line")
  ) {
    startContainer = startContainer.parentElement;
  }

  while (
    endContainer &&
    endContainer.parentElement &&
    !endContainer.parentElement.classList.contains("cm-line")
  ) {
    endContainer = endContainer.parentElement;
  }

  if (
    !startContainer ||
    !startContainer.parentElement ||
    !endContainer ||
    !endContainer.parentElement
  ) {
    return [];
  }

  let selectedLines: HTMLElement[] = [];
  let currentContainer = startContainer.parentElement;
  while (
    currentContainer &&
    currentContainer !== endContainer.parentElement.nextSibling
  ) {
    selectedLines.push(currentContainer);
    currentContainer = currentContainer.nextSibling as HTMLElement;
  }

  return selectedLines;
};

function unicodeEncode(str: string) {
  var encodedStr = "";
  for (var i = 0; i < str.length; i++) {
    var unicode = str.charCodeAt(i).toString(16);
    while (unicode.length < 4) {
      unicode = "0" + unicode;
    }
    encodedStr += "\\u" + unicode;
  }
  return encodedStr;
}

const attachQuickDecode = () => {
  const sessionListBody = document.querySelector(".c-session-list-body");
  if (!sessionListBody) return;

  if (document.querySelector(".evenbetter__qd-body")) return;

  const quickDecode = document.createElement("div");
  quickDecode.classList.add("evenbetter__qd-body");
  quickDecode.id = "evenbetter__qd-body";
  quickDecode.style.display = "none";

  quickDecode.innerHTML = ` 
  <div class="evenbetter__qd-selected-text">
    <div class="evenbetter__qd-selected-text-top">
      <div class="evenbetter__qd-selected-text-label">
        Decoded text:
      </div>
      <i class="c-icon fas fa-copy"></i>
    </div>
    <div contenteditable="plaintext-only" autocomplete="false" class="evenbetter__qd-selected-text-box"></div>
    <div style="color: var(--c-fg-subtle);margin-top:5px;" class="evenbetter__qd-selected-text-label evenbetter__qd-selected-text-error">
    </div>
  </div>
  `;

  const decodedTextBox = quickDecode.querySelector(
    ".evenbetter__qd-selected-text-box"
  ) as HTMLElement;

  const copyIcon = quickDecode.querySelector(".fa-copy");
  if (!copyIcon) return;

  copyIcon.addEventListener("click", () => {
    const decodedText = decodedTextBox.textContent;
    if (!decodedText) return;

    navigator.clipboard.writeText(decodedText);
  });

  let encodeMethod = "none";

  decodedTextBox.addEventListener("input", (event: Event) => {
    const inputElement = event.target as HTMLInputElement;

    const previousValue = inputElement.dataset.previousValue || "";
    let newValue = inputElement.innerText
      .replace(/[\u2014]/g, "--")
      .replace(/[\u2022]/g, "*")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\u00A0/g, " ");

    if (newValue === previousValue || newValue.length <= 1) return;

    let linesContent = selectedLineElements
      .map((line) => line.textContent)
      .join("\r\n");

    if (linesContent.split(previousValue).length > 2) return;

    if (encodeMethod === "url") {
      newValue = encodeURIComponent(newValue);
    } else if (encodeMethod === "base64") {
      newValue = btoa(newValue);
    } else if (encodeMethod === "url+base64") {
      newValue = encodeURIComponent(btoa(newValue));
    } else if (encodeMethod === "unicode") {
      newValue = unicodeEncode(newValue);
    }

    if (isPrettifyEnabled()) {
      let anyLineHasInsertWidget = false;
      selectedLineElements.forEach((line) => {
        if (line.querySelector(".c-insert-widget")) {
          anyLineHasInsertWidget = true;
        }
      });

      if (anyLineHasInsertWidget) {
        linesContent = linesContent.replace(
          /\s+(?=(?:(?:[^"]*"){2})*[^"]*$)/g,
          ""
        );
      }
    }

    for (let i = 1; i < selectedLineElements.length; i++) {
      const line = selectedLineElements[i];
      if (line) {
        line.remove()
      }
    }

    inputElement.dataset.previousValue = newValue;
    const oldLinesContent = linesContent;

    linesContent = linesContent.replace(previousValue, newValue);
    if (linesContent.split(newValue).length > 2) {
      linesContent = oldLinesContent;
      inputElement.dataset.previousValue = previousValue;
    }

    const firstElement = selectedLineElements[0];
    if (!firstElement) return;

    firstElement.textContent = linesContent;
  });

  document.addEventListener("selectionchange", (event) => {
    if (
      window.location.hash !== "#/replay" ||
      !document.activeElement ||
      document.activeElement.classList.contains(
        "evenbetter__qd-selected-text-box"
      )
    )
      return;

    const selection = window.getSelection();
    if (!selection) return;

    const selectedText = selection
      .toString()
      .replaceAll("\n", "\r\n");

    setTimeout(() => {
      if (
        document.querySelector(".cm-selectionBackground") &&
        selectedText === ""
      )
        return;

      const decodedTextLabel = document.querySelector(
        ".evenbetter__qd-selected-text-label"
      );
      if (!decodedTextLabel) return;

      const textError = document.querySelector(
        ".evenbetter__qd-selected-text-error"
      );
      if (!textError) return;

      if (selectedText.trim() !== "") {
        const decoded = tryToDecode(selectedText);
        encodeMethod = decoded.encodeMethod;

        selectedLineElements = [];
        getLinesContainingSelection().forEach((line) => {
          selectedLineElements.push(line);
        });

        decodedTextBox.dataset.previousValue = selectedText;
        decodedTextLabel.textContent = `Decoded text (${decoded.encodeMethod}):`;
        decodedTextBox.innerText = decoded.decodedContent;

        textError.textContent = "";
        decodedTextBox.setAttribute("contenteditable", "plaintext-only");
        if (selectedLineElements.length > 1) {
          textError.textContent = "Modyfing multiple lines isn't supported yet";
          decodedTextBox.setAttribute("contenteditable", "false");
        }

        if (document.activeElement?.closest(`.c-response-body`)) {
          decodedTextBox.setAttribute("contenteditable", "false");
        }

        quickDecode.style.display = "block";

        document
          .querySelector(`.c-send-request-button`)
          ?.addEventListener(`click`, () => {
            const quickDecodeBody = document.querySelector(
              ".evenbetter__qd-body"
            ) as HTMLElement;
            if (!quickDecodeBody) return;

            quickDecodeBody.style.display = "none";
          });
      } else {
        encodeMethod = "none";
        quickDecode.style.display = "none";
      }
    }, 8);
  });

  sessionListBody.appendChild(quickDecode);
};

const isPrettifyEnabled = () => {
  return (
    document.querySelector(
      `.c-request-skeleton__footer .c-pretty-button[data-is-pretty="true"]`
    ) !== null
  );
};

function isUrlEncoded(str: string) {
  const urlRegex = /(%[0-9A-Fa-f]{2})+/g;
  return urlRegex.test(str);
}

const decodeOnHover = () => {
  const codeLines = document.querySelectorAll(".cm-line");
  codeLines.forEach((line) => {
    if (line.getAttribute("evenbetter-hover-tooltip")) return;

    line.setAttribute("evenbetter-hover-tooltip", "true");
    line.addEventListener("mouseover", (e) => {
      const target = e.target as HTMLElement;
      const textContent = target.textContent;
      if (!textContent) return;

      if (isUrlEncoded(textContent)) {
        try {
          const decodedText = decodeURIComponent(textContent);
          line.setAttribute("title", decodedText);
        } catch (error) {}
      }
    });
    line.addEventListener("mouseout", () => line.removeAttribute("title"));
  });
};

const base64Decode = (input: string) => {
  let modifiedInput = input;

  if (input.length % 4 === 1) {
    modifiedInput += "=";
  } else if (input.length % 4 === 2) {
    modifiedInput += "==";
  }

  const base64Regex =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

  if (base64Regex.test(modifiedInput)) {
    try {
      const decodedBase64 = atob(modifiedInput);
      return { encodeMethod: "base64", decodedContent: decodedBase64 };
    } catch (error) {
      return { encodeMethod: "none", decodedContent: input };
    }
  }

  return { encodeMethod: "none", decodedContent: input };
};

const tryToDecode = (input: string) => {
  const base64Decoded = base64Decode(input);
  if (base64Decoded.encodeMethod !== "none") {
    return base64Decoded;
  }

  const unicodeRegex = /\\u([0-9a-fA-F]{4})/g;
  if (unicodeRegex.test(input)) {
    try {
      const decodedUnicode = input.replace(unicodeRegex, (_, code) =>
        String.fromCharCode(parseInt(code, 16))
      );

      return { encodeMethod: "unicode", decodedContent: decodedUnicode };
    } catch (error) {
      return { encodeMethod: "none", decodedContent: input };
    }
  }

  if (isUrlEncoded(input)) {
    try {
      const decodedUrl = decodeURIComponent(input);

      const base64Decoded = base64Decode(decodedUrl);
      if (base64Decoded.encodeMethod !== "none" && input.length > 8) {
        return {
          encodeMethod: "url+base64",
          decodedContent: base64Decoded.decodedContent,
        };
      }

      return { encodeMethod: "url", decodedContent: decodedUrl };
    } catch (error) {
      return { encodeMethod: "none", decodedContent: input };
    }
  }

  return { encodeMethod: "none", decodedContent: input };
};

export const quickDecode = () => {
  if (getSetting("quickDecode") !== "true") return;

  getEvenBetterAPI().eventManager.on("onPageOpen", (data: PageOpenEvent) => {
    if (data.newUrl === "#/replay") {
      attachQuickDecode();

      setTimeout(() => {
        const editor = document.querySelector(".cm-editor");
        if (!editor) return;

        editor.addEventListener("input", decodeOnHover);
        decodeOnHover();
      }, 500);
    }
  });
};
