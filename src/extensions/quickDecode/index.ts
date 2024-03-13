import eventManagerInstance from "../../events/EventManager";
import { PageOpenEvent } from "../../events/onPageOpen";
import { getSetting } from "../../settings";
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
    <div class="evenbetter__qd-selected-text-box"></div>
  </div>
  `;

  const copyIcon = quickDecode.querySelector(".fa-copy");
  copyIcon.addEventListener("click", () => {
    const decodedTextBox = document.querySelector(
      ".evenbetter__qd-selected-text-box"
    ) as HTMLElement;
    const decodedText = decodedTextBox.textContent;
    navigator.clipboard.writeText(decodedText);
  });

  document.addEventListener("selectionchange", (e) => {
    if (window.location.hash !== "#/replay") return;

    const selectedText = window.getSelection().toString();
    setTimeout(() => {
      if (
        document.querySelector(".cm-selectionBackground") &&
        selectedText === ""
      )
        return;

      const decodedTextBox = document.querySelector(
        ".evenbetter__qd-selected-text-box"
      );
      const decodedTextLabel = document.querySelector(
        ".evenbetter__qd-selected-text-label"
      );

      if (selectedText.trim() !== "") {
        const decoded = tryToDecode(selectedText);
        quickDecode.style.display = "block";
        decodedTextLabel.textContent = `Decoded text (${decoded.encodeMethod}):`;
        if (isValidJSON(decoded.decodedContent)) {
          decodedTextBox.innerHTML = document.createElement("pre").innerHTML =
            syntaxHighlight(decoded.decodedContent);
        } else {
          decodedTextBox.textContent = decoded.decodedContent;
        }
      } else {
        quickDecode.style.display = "none";
      }
    }, 8);
  });

  sessionListBody.appendChild(quickDecode);
};

// https://stackoverflow.com/questions/4810841/pretty-print-json-using-javascript
function syntaxHighlight(json: string) {
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return (
        '<span class="evenbetter__syntax-' + cls + '">' + match + "</span>"
      );
    }
  );
}

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
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
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

const isValidJSON = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
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
