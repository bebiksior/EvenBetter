import { getEvenBetterAPI } from "../../utils/evenbetterapi";
import { getSetting } from "../../settings";
import { PageOpenEvent } from "@bebiks/evenbetter-api/src/events/onPageOpen";
import "./quickDecode.css";

export interface CodeMirrorEditor {
  state: {
    readOnly: boolean;
    doc: {
      lineAt: (pos: number) => {
        number: number;
        from: number;
        text: string;
      };
    };
    selection: {
      main: {
        from: number;
        to: number;
        head: number;
      };
    };
    sliceDoc: (from: number, to: number) => string;
  };
  contentDOM: HTMLElement;
  dispatch: (changes: any) => void;
}

interface Selection {
  from: number;
  to: number;
  text: string;
}

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

class QuickDecode {
  private HTMLElement: HTMLDivElement;
  private textArea: HTMLTextAreaElement;
  private encodeMethodSelect: HTMLSelectElement;
  private encodeMethod: string;
  private activeEditor: CodeMirrorEditor | undefined = undefined;
  private selectionInterval: number | undefined;

  constructor() {
    this.HTMLElement = document.createElement("div");
    this.HTMLElement.classList.add("evenbetter__qd-body");
    this.HTMLElement.id = "evenbetter__qd-body";
    this.HTMLElement.style.display = "none";

    const resizer = document.createElement("div");
    resizer.id = "evenbetter__qd-resizer";

    let isResizing = false;
    let startY: number;

    const resize = (e: MouseEvent) => {
      if (!isResizing) return;
      const diffY = startY - e.clientY;
      const newHeight = Math.max(10, this.HTMLElement.offsetHeight + diffY);
      this.HTMLElement.style.height = `${newHeight}px`;
      startY = e.clientY;
    };

    const stopResize = () => {
      isResizing = false;
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
    };

    resizer.addEventListener("mousedown", (e: MouseEvent) => {
      isResizing = true;
      startY = e.clientY;

      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    });

    this.HTMLElement.appendChild(resizer);

    const selectedTextDiv = document.createElement("div");
    selectedTextDiv.classList.add("evenbetter__qd-selected-text");

    const selectedTextTopDiv = document.createElement("div");
    selectedTextTopDiv.classList.add("evenbetter__qd-selected-text-top");

    const encodingMethodSelect =
      getEvenBetterAPI().components.createSelectInput([
        { value: "none", label: "None" },
        { value: "base64", label: "Base64" },
        { value: "unicode", label: "Unicode" },
        { value: "url", label: "URL" },
        { value: "url+base64", label: "URL + Base64" },
        { value: "base64+url", label: "Base64 + URL" },
      ]);

    encodingMethodSelect.style.width = "150px";
    encodingMethodSelect.style.height = "25px";
    encodingMethodSelect.style.borderRadius = "5px !important";

    encodingMethodSelect.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
      this.encodeMethod = target.value;
      this.handleInput();
    });

    this.encodeMethodSelect = encodingMethodSelect;

    const copyIcon = document.createElement("i");
    copyIcon.classList.add("c-icon", "fas", "fa-copy");

    selectedTextTopDiv.appendChild(encodingMethodSelect);
    selectedTextTopDiv.appendChild(copyIcon);

    this.textArea = document.createElement("textarea");
    this.textArea.classList.add("evenbetter__qd-selected-text-box");
    this.textArea.setAttribute("autocomplete", "false");
    this.textArea.setAttribute("autocorrect", "off");
    this.textArea.setAttribute("autocapitalize", "off");
    this.textArea.setAttribute("spellcheck", "false");

    selectedTextDiv.appendChild(selectedTextTopDiv);
    selectedTextDiv.appendChild(this.textArea);

    this.HTMLElement.appendChild(selectedTextDiv);

    copyIcon.addEventListener("click", this.copyToClipboard.bind(this));
    this.textArea.addEventListener("input", this.handleInput.bind(this));

    this.encodeMethod = "none";

    this.startMonitoringSelection();
  }

  private copyToClipboard() {
    const decodedText = this.textArea.textContent;
    if (!decodedText) return;
    navigator.clipboard.writeText(decodedText);
  }

  private handleInput() {
    let newContent = this.textArea.value;
    if (newContent.length <= 0) return;

    if (!this.activeEditor || this.activeEditor.state.readOnly) return;

    switch (this.encodeMethod) {
      case "base64":
        newContent = btoa(newContent);
        break;
      case "unicode":
        newContent = newContent
          .split("")
          .map((char) => unicodeEncode(char))
          .join("");
        break;
      case "url":
        newContent = encodeURIComponent(newContent);
        break;
      case "url+base64":
        newContent = encodeURIComponent(btoa(newContent));
        break;
      case "base64+url":
        newContent = btoa(encodeURIComponent(newContent));
        break;
    }

    this.activeEditor.dispatch({
      changes: [
        {
          from: this.activeEditor.state.selection.main.from,
          to: this.activeEditor.state.selection.main.to,
          insert: newContent,
        },
      ],
    });
  }

  public updateText(text: string) {
    this.textArea.textContent = text;
    this.textArea.value = text;
  }

  public updateEncodeMethod(encodeMethod?: string) {
    this.encodeMethod = encodeMethod || "none";
    if (encodeMethod) {
      this.encodeMethodSelect.value = encodeMethod;
    } else {
      this.encodeMethodSelect.value = "none";
    }
  }

  public show() {
    this.HTMLElement.style.display = "flex";
  }

  public hide() {
    this.HTMLElement.style.display = "none";
  }

  public getElement() {
    return this.HTMLElement;
  }

  private getActiveEditor() {
    const activeElement = document.activeElement;
    if (!activeElement) return;

    const cmContent = activeElement.closest(".cm-content");
    if (!cmContent) return;

    return (cmContent as any)?.cmView?.view as CodeMirrorEditor
  }

  private getCurrentSelection(): Selection {
    const activeEditor = this.getActiveEditor();
    if (!activeEditor) {
      return {
        from: 0,
        to: 0,
        text: "",
      };
    }

    const { from, to } = activeEditor.state.selection.main;
    return {
      from,
      to,
      text: activeEditor.state.sliceDoc(from, to),
    };
  }

  private startMonitoringSelection() {
    const INTERVAL_DELAY = 50;
    let lastSelection = this.getCurrentSelection();

    this.selectionInterval = setInterval(() => {
      const newSelection = this.getCurrentSelection();

      if (
        newSelection.from !== lastSelection.from ||
        newSelection.to !== lastSelection.to
      ) {
        lastSelection = newSelection;
        this.onSelectionChange(newSelection);
      }
    }, INTERVAL_DELAY);
  }

  public stopMonitoringSelection() {
    if (this.selectionInterval) {
      clearInterval(this.selectionInterval);
    }
  }

  private isMouseOver(element: HTMLElement) {
    if (!element) return false;
    const hoverElements = document.querySelectorAll(":hover");
    for (let i = 0; i < hoverElements.length; i++) {
      if (hoverElements[i] === element) return true;
    }

    return false;
  }

  private onSelectionChange(selection: Selection) {
    if (this.isMouseOver(this.HTMLElement)) return;

    const contextMenu = document.querySelector(".p-contextmenu");
    if (contextMenu)
      if (this.isMouseOver(contextMenu as HTMLElement)) return;

    const isSelectionEmpty = selection.text === "";
    if (isSelectionEmpty) {
      this.hide();
      return;
    }

    this.activeEditor = this.getActiveEditor();

    if (this.activeEditor?.state.readOnly)
      this.setReadOnly(true);
    else 
      this.setReadOnly(false);

    this.showQuickDecode(selection.text);
  }

  private showQuickDecode(text: string) {
    const decoded = this.tryToDecode(text);
    this.updateText(decoded.decodedContent);
    this.updateEncodeMethod(decoded.encodeMethod);
    this.show();
  }

  private setReadOnly(readOnly: boolean) {
    if (readOnly) {
      this.textArea.disabled = true;
      this.encodeMethodSelect.disabled = true;
      this.encodeMethodSelect.value = "none";
    } else {
      this.textArea.disabled = false;
      this.encodeMethodSelect.disabled = false;
    }
  }

  private isUrlEncoded(str: string) {
    const urlRegex = /(%[0-9A-Fa-f]{2})+/g;
    return urlRegex.test(str);
  }

  private base64Decode(input: string) {
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
  }

  private tryToDecode(input: string) {
    const base64Decoded = this.base64Decode(input);
    if (base64Decoded.encodeMethod !== "none") {
      if (this.isUrlEncoded(base64Decoded.decodedContent)) {
        try {
          const decodedUrl = decodeURIComponent(base64Decoded.decodedContent);
          return {
            encodeMethod: "base64+url",
            decodedContent: decodedUrl,
          };
        } catch (error) {
          return base64Decoded;
        }
      }

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

    if (this.isUrlEncoded(input)) {
      try {
        const decodedUrl = decodeURIComponent(input);

        const base64Decoded = this.base64Decode(decodedUrl);
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
  }
}

class QuickDecodeManager {
  constructor() {}

  private attachQuickDecode() {
    if (document.getElementById("evenbetter__qd-body")) return;

    const sessionListBody = document.querySelector(".c-session-list-body");
    if (!sessionListBody) return;

    const quickDecode = new QuickDecode();
    sessionListBody.appendChild(quickDecode.getElement());
  }

  public init() {
    const MAX_ATTEMPTS = 80;
    const INTERVAL_DELAY = 25;

    if (getSetting("quickDecode") !== "true") return;

    const attach = () => {
      let attemptCount = 0;
      const interval = setInterval(() => {
        attemptCount++;
        if (attemptCount > MAX_ATTEMPTS) {
          console.error("Could not find editors");
          clearInterval(interval);
          return;
        }

        const editors = document.querySelectorAll(".cm-editor .cm-content");
        if (!editors) return;

        clearInterval(interval);
        this.attachQuickDecode();
      }, INTERVAL_DELAY);
    };

    getEvenBetterAPI().eventManager.on("onPageOpen", (data: PageOpenEvent) => {
      if (data.newUrl === "#/replay") attach();
    });

    getEvenBetterAPI().eventManager.on("onProjectChange", async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (window.location.hash === "#/replay") attach();
    });
  }
}

let manager: QuickDecodeManager;
export const quickDecodeInit = () => {
  if (!manager) {
    manager = new QuickDecodeManager();
    manager.init();
  }
};
