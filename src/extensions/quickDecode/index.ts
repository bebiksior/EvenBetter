import { getEvenBetterAPI } from "../../utils/evenbetterapi";
import { getSetting } from "../../settings";
import { PageOpenEvent } from "@bebiks/evenbetter-api/src/events/onPageOpen";
import "./quickDecode.css";

export interface CodeMirrorEditor {
  state: {
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
  private selectedTextLabelDiv: HTMLDivElement;
  private encodeMethod: string;
  private currentText: string;
  private editor: CodeMirrorEditor;
  private selectionInterval: NodeJS.Timeout | null = null;

  constructor(editor: CodeMirrorEditor) {
    this.editor = editor;
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

    this.selectedTextLabelDiv = document.createElement("div");
    this.selectedTextLabelDiv.classList.add("evenbetter__qd-selected-text-label");
    this.selectedTextLabelDiv.textContent = "Decoded text:";

    const copyIcon = document.createElement("i");
    copyIcon.classList.add("c-icon", "fas", "fa-copy");

    selectedTextTopDiv.appendChild(this.selectedTextLabelDiv);
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
    this.currentText = "";

    this.startMonitoringSelection();
  }

  private copyToClipboard() {
    const decodedText = this.textArea.textContent;
    if (!decodedText) return;
    navigator.clipboard.writeText(decodedText);
  }

  private handleInput(event: Event) {
    let newContent = this.textArea.value;

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
    
    this.editor.dispatch({
      changes: [
        {
          from: this.editor.state.selection.main.from,
          to: this.editor.state.selection.main.to,
          insert: newContent,
        },
      ],
    });
  }

  public updateText(text: string) {
    this.textArea.textContent = text;
    this.textArea.value = text;
    this.currentText = text;
  }

  public updateEncodeMethod(encodeMethod?: string) {
    this.encodeMethod = encodeMethod || "none";
    if (encodeMethod) {
      this.selectedTextLabelDiv.textContent = `Decoded text (${encodeMethod}):`;
    } else {
      this.selectedTextLabelDiv.textContent = "Decoded text:";
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

  private getCurrentSelection(): Selection {
    const { from, to } = this.editor.state.selection.main;
    return {
      from,
      to,
      text: this.editor.state.sliceDoc(from, to),
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

  private onSelectionChange(selection: Selection) {
    if (document.activeElement === this.textArea) return;

    const isSelectionEmpty = selection.text === "";
    if (isSelectionEmpty) {
      this.hide();
      return;
    }

    this.showQuickDecode(selection.text);
  }

  private showQuickDecode(text: string) {
    const decoded = this.tryToDecode(text);
    this.updateText(decoded.decodedContent);
    this.updateEncodeMethod(decoded.encodeMethod);
    this.show();
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
  private quickDecodes: QuickDecode[] = [];

  constructor() {}

  private attachQuickDecode(editor: CodeMirrorEditor) {
    if (document.getElementById("evenbetter__qd-body")) return;

    const sessionListBody = document.querySelector(".c-session-list-body");
    if (!sessionListBody) return;

    const quickDecode = new QuickDecode(editor);
    this.quickDecodes.push(quickDecode);
    sessionListBody.appendChild(quickDecode.getElement());
  }

  public init() {
    const MAX_ATTEMPTS = 80;
    const INTERVAL_DELAY = 25;

    if (getSetting("quickDecode") !== "true") return;

    getEvenBetterAPI().eventManager.on("onPageOpen", (data: PageOpenEvent) => {
      if (data.newUrl === "#/replay") {
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

          editors.forEach((editor) => {
            const codeMirrorEditor = (editor as any)?.cmView
              ?.view as CodeMirrorEditor;

            this.attachQuickDecode(codeMirrorEditor);
          });
        }, INTERVAL_DELAY);
      }
    });
  }

  public cleanup() {
    this.quickDecodes.forEach(qd => qd.stopMonitoringSelection());
    this.quickDecodes = [];
  }
}

let manager: QuickDecodeManager;
export const quickDecodeInit = () => {
  if (!manager) {
    manager = new QuickDecodeManager();
    manager.init();
  }
};