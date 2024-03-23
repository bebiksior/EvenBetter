import eventManagerInstance from "../../events/EventManager";
import { PageOpenEvent } from "../../events/onPageOpen";
import { getSetting } from "../../settings";

let selectedLineElements: HTMLElement[] = [];

const getLinesContainingSelection = () => {
  let selection = window.getSelection();
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
    <div contenteditable="true" autocomplete="false" class="evenbetter__qd-selected-text-box"></div>
    <div style="color: var(--c-fg-subtle);margin-top:5px;" class="evenbetter__qd-selected-text-label evenbetter__qd-selected-text-error">
    </div>
  </div>
  `;

  const decodedTextBox = quickDecode.querySelector(
    ".evenbetter__qd-selected-text-box"
  ) as HTMLElement;

  const copyIcon = quickDecode.querySelector(".fa-copy");
  copyIcon.addEventListener("click", () => {
    const decodedText = decodedTextBox.textContent;
    navigator.clipboard.writeText(decodedText);
  });

  let encodeMethod = "none";

  decodedTextBox.addEventListener("input", (event: InputEvent) => {
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
    }

    for (let i = 1; i < selectedLineElements.length; i++) {
      selectedLineElements[i].remove();
    }

    inputElement.dataset.previousValue = newValue;
    const oldLinesContent = linesContent;

    linesContent = linesContent.replace(previousValue, newValue);
    if (linesContent.split(newValue).length > 2) {
      linesContent = oldLinesContent;
      inputElement.dataset.previousValue = previousValue;
    }

    selectedLineElements[0].textContent = linesContent;
  });

  document.addEventListener("selectionchange", (event) => {
    if (
      window.location.hash !== "#/replay" ||
      document.activeElement.classList.contains(
        "evenbetter__qd-selected-text-box"
      )
    )
      return;

    const selectedText = window
      .getSelection()
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

      const textError = document.querySelector(
        ".evenbetter__qd-selected-text-error"
      );

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
        decodedTextBox.setAttribute("contenteditable", "true");
        if (selectedLineElements.length > 1) {
          textError.textContent = "Modyfing multiple lines is not supported yet";
          decodedTextBox.setAttribute("contenteditable", "false");
        }

        quickDecode.style.display = "block";
      } else {
        encodeMethod = "none";
        quickDecode.style.display = "none";
      }
    }, 8);
  });

  sessionListBody.appendChild(quickDecode);
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

const tryToDecode = (input: string) => {
  const base64Regex =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  if (base64Regex.test(input)) {
    try {
      const decodedBase64 = atob(input);
      return { encodeMethod: "base64", decodedContent: decodedBase64 };
    } catch (error) {
      return { encodeMethod: "none", decodedContent: input };
    }
  }

  if (isUrlEncoded(input)) {
    try {
      const decodedUrl = decodeURIComponent(input);
      return { encodeMethod: "url", decodedContent: decodedUrl };
    } catch (error) {
      return { encodeMethod: "none", decodedContent: input };
    }
  }

  return { encodeMethod: "none", decodedContent: input };
};

export const quickDecode = () => {
  if (getSetting("quickDecode") !== "true") return;

  eventManagerInstance.on("onPageOpen", (data: PageOpenEvent) => {
    if (data.newUrl === "#/replay") {
      attachQuickDecode();

      setTimeout(() => {
        const editor = document.querySelector(".cm-editor");
        editor.addEventListener("input", decodeOnHover);
        decodeOnHover();
      }, 1000);
    }
  });
};
