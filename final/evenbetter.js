// src/settings/constants.ts
var CURRENT_VERSION = "v2.0";
var DEBUG_MODE = false;
var EVENBETTER_VERSION_CHECK_URL = "https://raw.githubusercontent.com/bebiksior/EvenBetter/main/version.txt";

// src/utils/Logger.ts
var LogLevel;
(function(LogLevel2) {
  LogLevel2["INFO"] = "info";
  LogLevel2["ERROR"] = "error";
  LogLevel2["WARN"] = "warn";
  LogLevel2["DEBUG"] = "debug";
})(LogLevel || (LogLevel = {}));

class Logger {
  log(level, message) {
    const date = new Date;
    const prefix = `${date.toString()} [EvenBetter ${CURRENT_VERSION}]`;
    switch (level) {
      case LogLevel.INFO:
        console.log(`${prefix} [INFO] ${message}`);
        break;
      case LogLevel.ERROR:
        console.error(`${prefix} [ERROR] ${message}`);
        break;
      case LogLevel.WARN:
        console.warn(`${prefix} [WARN] ${message}`);
        break;
      case LogLevel.DEBUG:
        if (DEBUG_MODE)
          console.log(`${prefix} [DEBUG] ${message}`);
        break;
      default:
        console.log(`${prefix} [UNKNOWN] ${message}`);
    }
  }
  info(message) {
    this.log(LogLevel.INFO, message);
  }
  error(message) {
    this.log(LogLevel.ERROR, message);
  }
  warn(message) {
    this.log(LogLevel.WARN, message);
  }
  debug(message) {
    this.log(LogLevel.DEBUG, message);
  }
}
var log = new Logger;
var Logger_default = log;

// src/events/EventManager.ts
class EventManager {
  events = {};
  registerEvent(eventName, event) {
    this.events[eventName] = event;
  }
  triggerEvent(eventName, data) {
    const event = this.events[eventName];
    if (event) {
      event.trigger(data);
    } else {
      console.error(`Event "${eventName}" not registered.`);
    }
  }
  on(eventName, handler) {
    const event = this.events[eventName];
    if (event) {
      event.addHandler(handler);
    } else {
      console.error(`Event "${eventName}" not registered.`);
    }
  }
  initEvents() {
    Logger_default.info(`Initializing ${Object.keys(this.events).length} custom events`);
    for (const eventName in this.events) {
      this.events[eventName].init();
    }
  }
}
var eventManagerInstance = new EventManager;
var EventManager_default = eventManagerInstance;

// src/settings/index.ts
var defaultSettings = {
  ssrfInstancePlaceholder: "$ssrfinstance",
  ssrfInstanceFunctionality: "true",
  sidebarHideGroups: "true",
  sidebarRearrangeGroups: "true",
  showOutdatedVersionWarning: "true",
  highlightRowsFunctionality: "true",
  quickDecode: "true"
};
var getSetting = (settingName) => {
  if (localStorage.getItem(`evenbetter_${settingName}`) === null) {
    return defaultSettings[settingName];
  }
  return localStorage.getItem(`evenbetter_${settingName}`) || "";
};
var setSetting = (settingName, value) => {
  localStorage.setItem(`evenbetter_${settingName}`, value);
};
var checkForUpdates = async () => {
  try {
    const response = await fetch(EVENBETTER_VERSION_CHECK_URL, {
      cache: "no-store"
    });
    const latestVersion = await response.text();
    const latestVersionNumber = parseFloat(latestVersion.replace("v", "")), currentVersionNumber = parseFloat(CURRENT_VERSION.replace("v", ""));
    if (currentVersionNumber > latestVersionNumber) {
      return {
        isLatest: true,
        message: `You are using a development version: ${CURRENT_VERSION}.`
      };
    }
    if (latestVersion.trim() === CURRENT_VERSION) {
      return {
        isLatest: true,
        message: "You are using the latest version! \uD83C\uDF89"
      };
    } else {
      return {
        isLatest: false,
        message: `New EvenBetter version available: ${latestVersion}.`
      };
    }
  } catch (error) {
    return {
      isLatest: false,
      message: "Failed to check for updates"
    };
  }
};

// src/themes/index.ts
var themes = {
  evendarker: {
    name: "Even Darker",
    "--c-header-cell-border": "#101010",
    "--c-bg-default": "#050607",
    "--c-bg-subtle": "#090a0c",
    "--c-table-item-row": "#08090a",
    "--c-table-item-row-hover": "#0f1012",
    "--header-cell-width": "1px",
    "--c-table-even-item-row": "#08090a",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)"
  },
  caido: {
    name: "Caido Default",
    "--c-header-cell-border": "#101010",
    "--c-bg-default": "#25272d",
    "--c-bg-subtle": "var(--c-gray-800)",
    "--c-table-item-row": "#08090a",
    "--c-table-item-row-hover": "#25272d",
    "--header-cell-width": "0px",
    "--c-table-even-item-row": "#353942",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)"
  },
  gray: {
    name: "Gray",
    "--c-header-cell-border": "#101010",
    "--c-bg-default": "#202020",
    "--c-bg-subtle": "#252525",
    "--c-table-item-row": "#252525",
    "--c-table-item-row-hover": "#303030",
    "--header-cell-width": "1px",
    "--c-table-even-item-row": "#252525",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)"
  },
  oceanblue: {
    name: "Ocean Blue",
    "--c-header-cell-border": "#116699",
    "--c-bg-default": "#1a2b3c",
    "--c-bg-subtle": "#2a3b4c",
    "--c-table-item-row": "#1c2d3e",
    "--c-table-item-row-hover": "#2a3b4c",
    "--header-cell-width": "0px",
    "--c-table-even-item-row": "#2c3d4e",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)"
  },
  solarized: {
    name: "Solarized",
    "--c-header-cell-border": "#93a1a1",
    "--c-bg-default": "#002b36",
    "--c-bg-subtle": "#073642",
    "--c-table-item-row": "#073642",
    "--c-table-item-row-hover": "#586e75",
    "--header-cell-width": "1px",
    "--c-table-even-item-row": "#073642",
    "--c-fg-default": "#93a1a1",
    "--c-fg-subtle": "#657b83",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "#073642"
  },
  black: {
    name: "Black",
    "--c-header-cell-border": "#000000",
    "--c-bg-default": "#111111",
    "--c-bg-subtle": "#070707",
    "--c-table-item-row": "#050505",
    "--c-table-item-row-hover": "#222222",
    "--header-cell-width": "0px",
    "--c-table-even-item-row": "#111111",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)"
  },
  neon: {
    name: "Neon",
    "--c-header-cell-border": "#ff6ac1",
    "--c-bg-default": "#2b213a",
    "--c-bg-subtle": "#30263e",
    "--c-table-item-row": "#2b213a",
    "--c-table-item-row-hover": "#3c2e52",
    "--header-cell-width": "1px",
    "--c-table-even-item-row": "#2b213a",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)"
  },
  deepdark: {
    name: "Deep Dark",
    "--c-header-cell-border": "#101010",
    "--c-bg-default": "#080808",
    "--c-bg-subtle": "#080808",
    "--c-table-item-row": "#0f0f0f",
    "--c-table-item-row-hover": "#1a1a1a",
    "--header-cell-width": "1px",
    "--c-table-even-item-row": "#0e0e0e",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)"
  }
};
var loadTheme = (name) => {
  const theme = themes[name];
  if (!theme)
    return;
  document.getElementById("evenbetter-custom-theme")?.remove();
  Object.keys(theme).forEach((key) => {
    if (!key.startsWith("--"))
      return;
    document.documentElement.style.setProperty(key, theme[key], "important");
  });
  if (theme.customCSS) {
    const style = document.createElement("style");
    style.id = "evenbetter-custom-theme";
    style.innerHTML = theme.customCSS;
    document.head.appendChild(style);
  }
};

// src/events/onCaidoLoad.ts
class OnCaidoLoad {
  handlers = [];
  addHandler(handler) {
    this.handlers.push(handler);
  }
  init() {
    const interval = setInterval(() => {
      if (isCaidoLoaded()) {
        clearInterval(interval);
        this.trigger();
      }
    }, 100);
    loadTheme(getSetting("theme"));
  }
  trigger() {
    this.handlers.forEach((handler) => handler());
  }
}
var isCaidoLoaded = () => {
  return document.querySelector(".c-authenticated") !== null;
};
var onCaidoLoad = new OnCaidoLoad;

// src/events/onPageOpen.ts
class OnPageOpen {
  handlers = [];
  addHandler(handler) {
    this.handlers.push(handler);
  }
  init() {
    let previousUrl = window.location.href;
    const observer = new MutationObserver(() => {
      if (window.location.href !== previousUrl) {
        let newPath = new URL(window.location.href).hash, oldPath = new URL(previousUrl).hash;
        previousUrl = window.location.href;
        if (newPath.includes("?custom-path="))
          newPath = newPath.split("?custom-path=")[1];
        if (oldPath.includes("?custom-path="))
          oldPath = oldPath.split("?custom-path=")[1];
        this.trigger({
          newUrl: newPath,
          oldUrl: oldPath
        });
      }
    });
    const config = { subtree: true, childList: true };
    observer.observe(document, config);
  }
  trigger(data) {
    Logger_default.info(`Page updated: ${data.oldUrl} -> ${data.newUrl}`);
    if (data.newUrl.startsWith("#/settings/")) {
      EventManager_default.triggerEvent("onSettingsTabOpen", data.newUrl.replace("#/settings/", ""));
    }
    if (data.newUrl == "#/workflows") {
      let workflows = Array.from(document.querySelectorAll(".c-sidebar-item__content")).filter((element) => element.textContent == "Workflows");
      if (workflows.length > 0) {
        let countElement = workflows[0].parentNode.querySelector(".c-sidebar-item__count");
        countElement.innerHTML = "";
      }
    }
    this.handlers.forEach((handler) => handler(data));
  }
}
var onPageOpen = new OnPageOpen;

// src/events/onSettingsTabOpen.ts
class OnSettingsTabOpen {
  handlers = [];
  addHandler(handler) {
    this.handlers.push(handler);
  }
  init() {
  }
  trigger(data) {
    Logger_default.info(`Settings tab opened: ${data}`);
    switch (data) {
      case "developer":
        const jsSaveButton = document.querySelector(".c-custom-js__footer");
        jsSaveButton.removeEventListener("click", reloadPage);
        jsSaveButton.addEventListener("click", reloadPage);
    }
    this.handlers.forEach((handler) => handler(data));
  }
}
var reloadPage = () => {
  setTimeout(() => {
    location.reload();
  }, 250);
};
var onSettingsTabOpen = new OnSettingsTabOpen;

// src/extensions/customSettingsTabs/pages/evenbetter.ts
var evenBetterSettingsTab = () => {
  const currentTheme = getSetting("theme");
  const evenBetterTab = document.createElement("div");
  evenBetterTab.innerHTML = createEvenBetterTabHTML(themes, currentTheme);
  evenBetterTab.classList.add("evenbetter-custom-tab");
  const select = evenBetterTab.querySelector("select");
  select.addEventListener("change", (event) => {
    const target = event.target;
    const theme = target.value;
    setSetting("theme", theme);
    loadTheme(theme);
  });
  const changes = [];
  let hasChanges = false;
  const checkboxes = evenBetterTab.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const target = event.target;
      const name = target.name;
      const value = target.checked;
      const existingChangeIndex = changes.findIndex((change) => change.name === name);
      if (existingChangeIndex !== -1) {
        changes.splice(existingChangeIndex, 1);
      } else {
        changes.push({ name, value });
      }
      hasChanges = changes.length > 0;
      const saveButton2 = evenBetterTab.querySelector(".toggle-features__content button");
      if (hasChanges) {
        saveButton2.removeAttribute("disabled");
      } else {
        saveButton2.setAttribute("disabled", "true");
      }
    });
  });
  const saveButton = evenBetterTab.querySelector(".toggle-features__content button");
  saveButton.addEventListener("click", () => {
    changes.forEach((change) => {
      setSetting(change.name, change.value);
    });
    location.reload();
  });
  const ssrfInstanceFunctionality = evenBetterTab.querySelector(".ssrfInstanceFunctionality");
  if (ssrfInstanceFunctionality) {
    const ssrfInstanceFunctionalityChanges = [];
    ssrfInstanceFunctionality.querySelector("input").value = getSetting("ssrfInstancePlaceholder");
    ssrfInstanceFunctionality.querySelector("input").addEventListener("input", (event) => {
      const target = event.target;
      const value = target.value;
      ssrfInstanceFunctionalityChanges.push({
        name: "ssrfInstancePlaceholder",
        value
      });
      const saveButton2 = ssrfInstanceFunctionality.querySelector("button");
      saveButton2.removeAttribute("disabled");
    });
    ssrfInstanceFunctionality.querySelector("button").addEventListener("click", () => {
      ssrfInstanceFunctionalityChanges.forEach((change) => {
        setSetting(change.name, change.value);
        location.reload();
      });
    });
  }
  checkForUpdates().then(({ isLatest, message }) => {
    if (!isLatest) {
      const headerOutdated = evenBetterTab.querySelector(".header-outdated");
      headerOutdated.style.display = "block";
    }
  });
  return evenBetterTab;
};
var createEvenBetterTabHTML = (themes4, currentTheme) => {
  const toggleFeatures = [
    {
      name: "sidebarTweaks",
      title: "Sidebar tweaks",
      items: [
        {
          name: "sidebarRearrangeGroups",
          title: "Groups Rearrange",
          description: "Show move buttons next to sidebar groups."
        },
        {
          name: "sidebarHideGroups",
          title: "Groups Collapse",
          description: "This allows you to collapse groups in the sidebar."
        }
      ]
    },
    {
      name: "ssrfInstanceFunctionality",
      title: "Quick SSRF Instance",
      items: [
        {
          name: "ssrfInstanceFunctionality",
          title: "Quick SSRF Instance",
          description: "Quickly create new ssrf.cvssadvisor.com instance by typing the placeholder."
        }
      ]
    },
    {
      name: "highlightRowsFunctionality",
      title: "Highlight Rows",
      items: [
        {
          name: "highlightRowsFunctionality",
          title: "Highlight Rows",
          description: "Right click to highlight rows on the HTTP History page."
        }
      ]
    },
    {
      name: "quickDecode",
      title: "Quick Decode",
      items: [
        {
          name: "quickDecode",
          title: "Quick Decode",
          description: "Selecting text on the Replay page will attempt to decode it and show the result at the left bottom corner."
        }
      ]
    },
    {
      name: "versionCheckWarning",
      title: "Version Check Warning",
      items: [
        {
          name: "showOutdatedVersionWarning",
          title: "Version Check Warning",
          description: "Choose if you want to see warning on startup if you are using outdated EvenBetter version."
        }
      ]
    }
  ];
  return `
  <div class="even-better__settings" id="evenbetter-settings-content">
    <header>
      <div class="header-title">
        <h1>EvenBetter ${CURRENT_VERSION} - Settings</h1>
        <div class="header-outdated" style="display:none;">You are using outdated version!</div>
      </div>
      <div class="header-description">
        Customize EvenBetter plugin here and make your Caido even better :D
      </div>
    </header>

    <main>
      <div class="left">
        <div class="settings-box">
          <!-- Settings header -->
          <div class="settings-box__header">
            <div class="settings-box__header-title">Themes</div>
            <div class="settings-box__header-description">
              Change the appearance of your Caido
            </div>
          </div>

          <!-- Settings content -->
          <div class="settings-box__content">
            <select>
              ${Object.keys(themes4).map((theme) => `<option value="${theme}" ${theme === currentTheme ? "selected" : ""}>${themes4[theme].name}</option>`).join("")}
            </select>
          </div>
        </div>

        ${getSetting("ssrfInstanceFunctionality") == "true" ? `
        <div class="settings-box ssrfInstanceFunctionality">
          <!-- Settings header -->
          <div class="settings-box__header">
            <div class="settings-box__header-title">Quick SSRF placeholder</div>
            <div class="settings-box__header-description">
              Set the placeholder that will be used to create new SSRF instance
            </div>
          </div>

          <!-- Settings content -->
          <div class="settings-box__content">
            <div class="c-text-input">
              <div class="c-text-input__outer">
                <div class="c-text-input__inner">
                  <input
                    placeholder="\$ssrfinstance"
                    spellcheck="false"
                    class="c-text-input__input"
                  />
                </div>
              </div>
            </div>

            <button disabled>Save</button>
          </div>
        </div>` : ""}
      </div>

      <div class="right">
        <div class="toggle-features">
          <div class="toggle-features__header">
            <div class="toggle-features__header-title">Toggle features</div>
            <div class="toggle-features__header-description">
              Enable or disable features of the EvenBetter plugin
            </div>
          </div>
          <hr />
          <div class="toggle-features__content">
            ${toggleFeatures.map((feature) => `
              <div class="toggle-features__content-item">
                <div class="toggle-features__content-item-title">
                  ${feature.title}
                </div>

                ${feature.items.map((item) => `
                  <div class="toggle-features__content-item-toggle">
                    <div class="toggle-features__content-item-description">
                      <b>${item.title}:</b> ${item.description}
                    </div>
                    <div>
                      <input type="checkbox" name="${item.name}" id="${item.name}" ${getSetting(item.name) === "true" ? "checked" : ""} />
                    </div>
                  </div>`).join("")}

              </div>

              <hr />`).join("")}

            <button disabled>Save</button>
          </div>
        </div>
      </div>
    </main>
  </div>`;
};

// src/extensions/customSettingsTabs/pages/library.ts
var sanitizeInput = function(input) {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
};
var evenBetterLibraryTab = () => {
  const evenBetterTab = document.createElement("div");
  evenBetterTab.innerHTML = createEvenBetterLibraryHTML();
  evenBetterTab.classList.add("evenbetter-custom-tab");
  fetch("https://raw.githubusercontent.com/bebiksior/EvenBetter/main/workflows/workflows.json?cache=" + new Date().getTime()).then((response) => {
    response.json().then((data) => {
      data.workflows.forEach((plugin) => {
        evenBetterTab.querySelector(".c-table__wrapper").appendChild(createLibraryPluginElement(plugin));
      });
    });
  });
  return evenBetterTab;
};
var createWorkflow = (data) => {
  const payload = {
    operationName: "createWorkflow",
    query: `mutation createWorkflow(\$input: CreateWorkflowInput!) { \n createWorkflow(input: \$input) { \n error { \n ... on WorkflowUserError { \n ...workflowUserErrorFull \n } \n ... on OtherUserError { \n ...otherUserErrorFull \n } \n } \n workflow { \n ...workflowFull \n } \n } \n} \nfragment workflowUserErrorFull on WorkflowUserError { \n ...userErrorFull \n nodeId \n message \n reason \n} \nfragment userErrorFull on UserError { \n __typename \n code \n} \nfragment otherUserErrorFull on OtherUserError { \n ...userErrorFull \n} \nfragment workflowFull on Workflow { \n __typename \n id \n kind \n name \n definition \n}`,
    variables: {
      input: {
        definition: {
          ...data
        }
      }
    }
  };
  fetch(document.location.origin + "/graphql", {
    body: JSON.stringify(payload),
    method: "POST",
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("CAIDO_AUTHENTICATION")).accessToken
    }
  });
};
var createLibraryPluginElement = (plugin) => {
  const evenBetterPlugin = document.createElement("div");
  evenBetterPlugin.classList.add("c-evenbetter_table-item-row");
  evenBetterPlugin.innerHTML = `
            <div class="c-evenbetter_item-row" data-is-selected="true">
                <div class="c-evenbetter_table-item-cell" data-column-id="name" data-align="start" style="--d40e2d02: max(20em, 56px);">
                    <div class="c-evenbetter_table-item-cell__inner">
                        <div class="c-evenbetter_table-item-row__name">
                            <div class="c-item-row__label">${sanitizeInput(plugin.name)}</div>
                        </div>
                    </div>
                </div>
                <div class="c-evenbetter_table-item-cell" data-column-id="version" data-align="start" style="--d40e2d02: max(7em, 56px);">
                    <div class="c-evenbetter_table-item-cell__inner">v${sanitizeInput(plugin.version)}</div>
                </div>
                <div class="c-evenbetter_table-item-cell" data-column-id="description" data-align="start" style="--d40e2d02: max(40em, 56px);">
                    <div class="c-evenbetter_table-item-cell__inner">${sanitizeInput(plugin.description)}
                    </div>
                </div>
                <div class="c-evenbetter_table-item-cell" data-column-id="author" data-align="start" style="--d40e2d02: max(10em, 56px);">
                    <div class="c-evenbetter_table-item-cell__inner">${sanitizeInput(plugin.author)}
                    </div>
                </div>
                <div class="c-evenbetter_table-item-cell" data-column-id="actions" data-align="start" style="--d40e2d02: max(10em, 56px);">
                    <div class="c-evenbetter_table-item-cell__inner">
                        <div class="c-evenbetter_table-item-row__actions">
                            <div class="c-evenbetter_item-row__select" data-onboarding="select-project">
                                <div class="c-evenbetter_button" data-plugin-url="${sanitizeInput(plugin.url)}" data-size="small" data-block="true" data-variant="secondary" data-outline="true" data-plain="false" style="--9bad4558: center;">
                                    <div class="formkit-outer" data-family="button" data-type="button" data-empty="true">
                                        <div class="formkit-wrapper">
                                            <button class="formkit-input c-evenbetter_button__input" type="button" name="button_82" id="input_83">
                                                <div class="c-evenbetter_button__label">
                                                    Add
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    </div>
                </div>
            </div>
    `;
  evenBetterPlugin.querySelectorAll(".c-evenbetter_button__input").forEach((element) => {
    element.addEventListener("click", (event) => {
      const target = event.target;
      const url = target.closest(".c-evenbetter_button").getAttribute("data-plugin-url");
      fetch(url).then((response) => {
        response.json().then((data) => {
          createWorkflow(data);
          showWorkflowCount();
          const label = element.querySelector(".c-evenbetter_button__label");
          label.textContent = "Added";
          setTimeout(() => {
            label.textContent = "Add";
          }, 1000);
        });
      });
    });
  });
  return evenBetterPlugin;
};
var showWorkflowCount = () => {
  document.querySelectorAll(".c-sidebar-item__content").forEach((element) => {
    if (element.textContent != "Workflows")
      return;
    let countElement = element.parentNode.querySelector(".c-sidebar-item__count");
    let countLabel = countElement.querySelector(".c-sidebar-item__count-label");
    if (countLabel) {
      countLabel.textContent = String(parseInt(countLabel.textContent) + 1);
    } else {
      let newCountLabel = document.createElement("div");
      newCountLabel.setAttribute("data-v-d4548a6d", "");
      newCountLabel.classList.add("c-sidebar-item__count-label");
      newCountLabel.textContent = "1";
      countElement.appendChild(newCountLabel);
    }
  });
};
var createEvenBetterLibraryHTML = () => {
  const htmlContent = `
    <div class="c-evenbetter_library" id="evenbetter-library-content">
        <div class="c-evenbetter_library-table">
            <div class="c-evenbetter_table" tabindex="-1" style="--5b42590e: 42px;">
                <div class="c-evenbetter_library_card" style="--6ac6656c: 0.25em; --7a039a1d: 0.25em; --9309e9b0: 0.25em; --09ed17ff: 0.25em;">
                    <header>
                        <div class="header-title">
                            <h1>EvenBetter - Library</h1>
                        </div>
                        <div class="header-description">
                            Install workflows into your Caido project with a single click
                        </div>
                    </header>
                    <div class="c-evenbetter_library_card-body">
                        <div class="c-evenbetter_table_card-body">
                            <div class="c-evenbetter_table-container" data-is-empty="false" data-is-loading="false" style="overflow-y: auto;">
                                <div class="c-evenbetter_table_header-row">
                                    <div class="c-evenbetter_table_header-cell" data-sortable="true" data-resizable="true" data-align="start" data-is-resizing="false" style="--1e00f3f4: 4rem; width: max(20em, 56px);">
                                        <div class="c-evenbetter_header-cell_wrapper">
                                            <div class="c-evenbetter_header-cell_content">Name</div>
                                        </div>
                                    </div><div class="c-evenbetter_table_header-cell" data-sortable="false" data-resizable="true" data-align="start" data-is-resizing="false" style="--1e00f3f4: 4rem; width: max(7em, 56px);">
                                        <div class="c-evenbetter_header-cell_wrapper">
                                            <div class="c-evenbetter_header-cell_content">Version</div>
                                        </div>
                                    </div><div class="c-evenbetter_table_header-cell" data-sortable="true" data-resizable="true" data-align="start" data-is-resizing="false" style="--1e00f3f4: 4rem; width: max(40em, 56px);">
                                        <div class="c-evenbetter_header-cell_wrapper">
                                            <div class="c-evenbetter_header-cell_content">
                                                Description
                                            </div>
                                        </div>
                                    </div><div class="c-evenbetter_table_header-cell" data-sortable="true" data-resizable="true" data-align="start" data-is-resizing="false" style="--1e00f3f4: 4rem; width: max(10em, 56px);">
                                        <div class="c-evenbetter_header-cell_wrapper">
                                            <div class="c-evenbetter_header-cell_content">
                                                Author
                                            </div>
                                        </div>
                                    </div><div class="c-evenbetter_table_header-cell" data-sortable="false" data-resizable="false" data-align="start" style="--1e00f3f4: 4rem; width: max(10em, 56px);">
                                        <div class="c-evenbetter_header-cell_wrapper">
                                            <div class="c-evenbetter_header-cell_content">Actions</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="c-table__wrapper" style="width: 100%; height: 250px; margin-top: 0px;">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <p class="c-evenbetter_library-footer-text">Want to contribute? <a href="https://github.com/bebiksior/EvenBetter/pulls" target="_blank">Create a pull request</a></p>
    </div>
    `;
  return htmlContent;
};

// src/extensions/customSettingsTabs/index.ts
var setup = () => {
  EventManager_default.on("onSettingsTabOpen", (data) => {
    adjustActiveTab(data);
  });
  EventManager_default.on("onPageOpen", (data) => {
    if (data.newUrl.startsWith("#/settings/") && !data.oldUrl.startsWith("#/settings/")) {
      init();
    }
  });
};
var init = () => {
  renderCustomTabs();
  grabNavigationItems().forEach((navItem) => {
    navItem.querySelector(".c-button").addEventListener("click", () => {
      setTabActive(navItem);
      if (navItem.getAttribute("data-is-custom") !== "true") {
        const content = document.querySelector(".c-settings__content");
        if (!content) {
          Logger_default.error("Couldn't find settings tab content, aborting...");
          return;
        }
        document.getElementById("custom-tab-content")?.remove();
        const tabContent = content.children[0];
        tabContent.style.display = "block";
      }
    });
  });
  const customPath = window.location.hash.split("?custom-path=")[1];
  if (customPath) {
    const settingsTab = customPath.split("/")[2];
    openCustomTab(getCustomSettingsTab(settingsTab));
  }
};
var grabNavigationItems = () => {
  const settingsTabs = document.querySelectorAll(".c-settings__navigation .c-underline-nav-item");
  return settingsTabs;
};
var getNavItemData = (navItem) => {
  const name = navItem.querySelector(".c-button__label")?.textContent;
  const id = name?.toLowerCase();
  const icon = navItem.querySelector(".c-button__leading-icon")?.innerHTML;
  if (name && id && icon) {
    return {
      name,
      id,
      icon,
      content: document.createElement("div")
    };
  }
  Logger_default.error("Couldn't get navitemdata");
  return null;
};
var getNavigationItem = (name) => {
  const settingsTabs = Array.from(document.querySelectorAll(".c-settings__navigation .c-underline-nav-item"));
  const foundTab = settingsTabs.find((tab) => {
    const tabName = tab.querySelector(".c-button__label")?.textContent?.trim();
    return tabName && tabName.toLowerCase() === name.toLowerCase();
  });
  return foundTab || null;
};
var renderCustomTabs = () => {
  const settingsNavigation = document.querySelector(".c-underline-nav");
  if (!settingsNavigation) {
    Logger_default.error("Couldn't find settings navigation, aborting...");
    return;
  }
  const tabTemplate = settingsNavigation.querySelector(".c-underline-nav-item");
  customSettingsTabs.forEach((tab) => {
    if (document.getElementById(tab.id))
      return;
    const newTab = tabTemplate?.cloneNode(true);
    newTab.setAttribute("data-is-active", "false");
    newTab.setAttribute("data-is-custom", "true");
    newTab.id = tab.id;
    const newTabData = getNavItemData(newTab);
    if (newTabData) {
      newTabData.name = tab.name;
      newTabData.id = tab.id;
      newTabData.icon = tab.icon;
      newTabData.content = tab.content;
      newTab.querySelector(".c-button__label").innerHTML = tab.icon + tab.name;
      newTab.querySelector(".c-button").addEventListener("click", () => openCustomTab(tab));
      settingsNavigation.appendChild(newTab);
    }
  });
};
var openCustomTab = (tab) => {
  const previousTab = window.location.hash.split("/")[2].split("?")[0];
  const content = document.querySelector(".c-settings__content");
  if (!content) {
    Logger_default.error("Couldn't find settings tab content, aborting...");
    return;
  }
  if (document.getElementById(`.${tab.id}`)) {
    return;
  }
  document.getElementById("custom-tab-content")?.remove();
  tab.content.id = "custom-tab-content";
  tab.content.classList.add(tab.id);
  content.appendChild(tab.content);
  const tabContent = content.children[0];
  tabContent.style.display = "none";
  window.location.hash = window.location.hash.split("?")[0] + `?custom-path=#/settings/${tab.id}`;
  adjustActiveTab(tab.id);
  getNavigationItem(previousTab)?.addEventListener("click", () => {
    window.location.hash = window.location.hash.split("?")[0];
  });
};
var adjustActiveTab = (openedSettingsTab) => {
  grabNavigationItems().forEach((navItem) => {
    navItem.setAttribute("data-is-active", "false");
    const navItemData = getNavItemData(navItem);
    if (navItemData && navItemData.id === openedSettingsTab) {
      navItem.setAttribute("data-is-active", "true");
      Logger_default.debug(`Adjusted active tab to ${openedSettingsTab}`);
    }
  });
};
var setTabActive = (tabElement) => {
  grabNavigationItems().forEach((navItem) => {
    navItem.setAttribute("data-is-active", "false");
  });
  tabElement.setAttribute("data-is-active", "true");
};
var getCustomSettingsTab = (id) => {
  return customSettingsTabs.find((tab) => tab.id === id);
};
var customSettingsTabs = [
  {
    name: "EvenBetter",
    icon: '<div class="c-button__leading-icon"><i class="c-icon fas fa-bug"></i></div>',
    id: "evenbetter",
    content: evenBetterSettingsTab()
  },
  {
    name: "Library",
    icon: '<div class="c-button__leading-icon"><i class="c-icon fas fa-book"></i></div>',
    id: "library",
    content: evenBetterLibraryTab()
  }
];

// src/extensions/quickSSRFInstance/index.ts
var SSRF_INSTANCE_API_URL = "https://api.cvssadvisor.com/ssrf/api/instance";
var SSRF_INSTANCE_URL = "https://ssrf.cvssadvisor.com/instance/";
var quickSSRFFunctionality = () => {
  EventManager_default.on("onPageOpen", (data) => {
    if (data.newUrl == "#/replay" && getSetting("ssrfInstanceFunctionality") === "true") {
      setTimeout(() => observeReplayInput(), 1000);
    }
  });
};
var replayInputObserver = null;
var observeReplayInput = () => {
  const replayInput = document.querySelector(".c-replay-entry .cm-content");
  if (!replayInput)
    return;
  if (replayInputObserver) {
    replayInputObserver.disconnect();
    replayInputObserver = null;
  }
  const ssrfInstancePlaceholder = getSetting("ssrfInstancePlaceholder");
  replayInputObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const originalTextContent = mutation.target.textContent;
      if (originalTextContent.includes(ssrfInstancePlaceholder)) {
        replaceSSRFInstanceText(mutation, originalTextContent);
      }
    });
  });
  const config = {
    characterData: true,
    subtree: true
  };
  replayInputObserver.observe(replayInput, config);
};
var replaceSSRFInstanceText = (mutation, originalTextContent) => {
  const newTextContent = originalTextContent.replace(getSetting("ssrfInstancePlaceholder"), "$creating_instance");
  mutation.target.textContent = newTextContent;
  fetch(SSRF_INSTANCE_API_URL, {
    method: "POST"
  }).then((response) => response.json()).then((data) => {
    const updatedText = newTextContent.replace("$creating_instance", "https://" + data + ".c5.rs");
    mutation.target.textContent = updatedText;
    window.open(SSRF_INSTANCE_URL + data);
  }).catch(() => {
    const updatedText = newTextContent.replace("$creating_instance", "$creating_instance_failed");
    mutation.target.textContent = updatedText;
  });
};

// src/extensions/shareScope/index.ts
var onScopeTabOpen = () => {
  EventManager_default.on("onPageOpen", (data) => {
    if (data.newUrl == "#/scope") {
      setTimeout(() => {
        addImportButton();
        observeScopeTab();
      }, 50);
    }
  });
};
var addImportButton = () => {
  const actions = document.querySelector(".c-header__actions");
  if (!actions)
    return;
  document.querySelector("#scope-presents-import")?.remove();
  const importButton = actions.children[0].cloneNode(true);
  importButton.querySelector(".c-button__label").innerHTML = `<div class="c-button__leading-icon"><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 13V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V13" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M12 3L12 15M12 15L8.5 11.5M12 15L15.5 11.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg></div><p style="
        margin: 0;
    ">Import</p>`;
  importButton.id = "scope-presents-import";
  importButton.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.style.display = "none";
    input.addEventListener("change", (event) => {
      const target = event.target;
      const file = target.files[0];
      const reader = new FileReader;
      reader.onload = (e) => {
        const target2 = e.target;
        const data = JSON.parse(target2.result);
        createNewScopePreset(data);
      };
      reader.readAsText(file);
    });
    document.body.prepend(input);
    input.click();
    input.remove();
  });
  actions.style.gap = "0.8rem";
  actions.style.display = "flex";
  actions.appendChild(importButton);
};
var scopeTabObserver = null;
var observeScopeTab = () => {
  const presetForm = document.querySelector(".c-preset-form-create").parentElement;
  if (!presetForm)
    return;
  if (scopeTabObserver) {
    scopeTabObserver.disconnect();
    scopeTabObserver = null;
  }
  scopeTabObserver = new MutationObserver((m) => {
    if (m.some((m2) => m2.attributeName === "style" || m2.target.classList.contains("c-preset-form-create__header")))
      return;
    attachDownloadButtonV2();
  });
  scopeTabObserver.observe(presetForm, {
    childList: true,
    attributes: true,
    subtree: true
  });
};
var attachDownloadButtonV2 = () => {
  document.querySelector("#scope-presents-download")?.remove();
  const presetCreateHeader = document.querySelector(".c-preset-form-create__header");
  const downloadButton = presetCreateHeader.querySelector(".c-scope-tooltip").cloneNode(true);
  downloadButton.id = "scope-presents-download";
  downloadButton.querySelector("button").innerHTML = `<div data-v-f56ffbcc="" class="c-button__leading-icon"><i data-v-f56ffbcc="" class="c-icon fas fa-file-arrow-down"></i></div>Download`;
  downloadButton.querySelector("button").addEventListener("click", () => {
    const id = getActiveScopePreset();
    if (!id)
      return;
    getScopePreset(id).then((response) => {
      response.json().then((data) => {
        const json = JSON.stringify(data.data.scope, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "scope-" + data.data.scope.name + ".json";
        a.click();
      });
    });
  });
  presetCreateHeader.appendChild(downloadButton);
};
var createNewScopePreset = (data) => {
  const payload = {
    operationName: "createScope",
    query: `mutation createScope(\$input: CreateScopeInput!) {\n  createScope(input: \$input) {\n    error {\n      ... on InvalidGlobTermsUserError {\n        ...invalidGlobTermsUserErrorFull\n      }\n      ... on OtherUserError {\n        ...otherUserErrorFull\n      }\n    }\n    scope {\n      ...scopeFull\n    }\n  }\n}\nfragment invalidGlobTermsUserErrorFull on InvalidGlobTermsUserError {\n  ...userErrorFull\n  terms\n}\nfragment userErrorFull on UserError {\n  __typename\n  code\n}\nfragment otherUserErrorFull on OtherUserError {\n  ...userErrorFull\n}\nfragment scopeFull on Scope {\n  __typename\n  id\n  name\n  allowlist\n  denylist\n  indexed\n}`,
    variables: {
      input: {
        allowlist: data.allowlist,
        denylist: data.denylist,
        name: data.name
      }
    }
  };
  fetch(document.location.origin + "/graphql", {
    body: JSON.stringify(payload),
    method: "POST",
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("CAIDO_AUTHENTICATION")).accessToken
    }
  });
};
var getScopePreset = (id) => {
  const payload = {
    operationName: "scope",
    query: `query scope(\$id:ID!) {\n scope(id: \$id){\n id\n name\n allowlist\n denylist \n }\n }`,
    variables: {
      id: `${id}`
    }
  };
  return fetch(document.location.origin + "/graphql", {
    body: JSON.stringify(payload),
    method: "POST",
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("CAIDO_AUTHENTICATION")).accessToken
    }
  });
};
var getActiveScopePreset = () => {
  return document.querySelector(`.c-preset[data-is-selected="true"]`)?.getAttribute("data-preset-id");
};

// src/extensions/sidebarTweaks/hide.ts
var addGroupHideFunctionality = () => {
  if (getSetting("sidebarHideGroups") !== "true")
    return;
  const sidebarGroupTitles = document.querySelectorAll(".c-sidebar-group__title");
  sidebarGroupTitles.forEach((title) => {
    const groupName = title.textContent;
    if (groupName !== "...") {
      title.addEventListener("click", () => {
        const group = title.parentElement;
        const groupItems = group.querySelector(".c-sidebar-group__items");
        const isCollapsed = group.getAttribute("data-is-group-collapsed");
        groupItems.style.display = isCollapsed === "true" ? "block" : "none";
        group.setAttribute("data-is-group-collapsed", isCollapsed === "true" ? "false" : "true");
        storeSidebarGroupCollapsedStates();
      });
    }
  });
};
var storeSidebarGroupCollapsedStates = () => {
  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const groupName = group.children[0].textContent.trim();
    const isCollapsed = group.getAttribute("data-is-group-collapsed");
    localStorage.setItem(`evenbetter_${groupName}_isCollapsed`, isCollapsed);
  });
};
var restoreSidebarGroupCollapsedStates = () => {
  if (getSetting("sidebarHideGroups") !== "true")
    return;
  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const groupName = group.children[0].textContent.trim();
    const isCollapsed = localStorage.getItem(`evenbetter_${groupName}_isCollapsed`);
    if (isCollapsed) {
      group.setAttribute("data-is-group-collapsed", isCollapsed);
      const groupItems = group.querySelector(".c-sidebar-group__items");
      groupItems.style.display = isCollapsed === "true" ? "none" : "block";
    }
  });
};

// src/extensions/sidebarTweaks/rearrange.ts
var addMoveButtonsToSidebar = () => {
  if (getSetting("sidebarRearrangeGroups") !== "true")
    return;
  const sidebarGroupTitles = document.querySelectorAll(".c-sidebar-group__title");
  sidebarGroupTitles.forEach((title) => {
    const groupName = title.textContent;
    if (groupName !== "...") {
      attachMoveButtonsToGroup(title, groupName);
    }
  });
  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const moveUpButton = group.querySelector(".c-sidebar-group__move-up");
    const moveDownButton = group.querySelector(".c-sidebar-group__move-down");
    if (!moveUpButton || !moveDownButton) {
      return;
    }
    moveUpButton.addEventListener("click", (event) => {
      moveGroup(group, "up");
      event.stopPropagation();
    });
    moveDownButton.addEventListener("click", (event) => {
      moveGroup(group, "down");
      event.stopPropagation();
    });
  });
};
var attachMoveButtonsToGroup = (element, groupName) => {
  element.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">${groupName}
          <div class="c-sidebar-group__rearrange-arrows">
              <svg class="c-sidebar-group__move-up" width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg class="c-sidebar-group__move-down" width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
          </div>
        `;
};
var moveGroup = (group, direction) => {
  const index = Array.from(group.parentElement.children).indexOf(group);
  if (direction === "up" && index > 0 || direction === "down" && index < group.parentElement.children.length - 1) {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex == 0) {
      return;
    }
    const referenceNode = group.parentElement.children[newIndex + (direction === "up" ? 0 : 1)];
    group.parentElement.insertBefore(group, referenceNode);
    storeSidebarGroupPositions();
  }
};
var storeSidebarGroupPositions = () => {
  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const groupName = group.children[0].textContent.trim();
    const position = Array.from(group.parentElement.children).indexOf(group);
    localStorage.setItem(`evenbetter_${groupName}_position`, String(position));
  });
};
var restoreSidebarGroupPositions = () => {
  if (getSetting("sidebarRearrangeGroups") !== "true")
    return;
  const sidebarGroups = document.querySelectorAll(".c-sidebar-group");
  sidebarGroups.forEach((group) => {
    const groupName = group.children[0].textContent.trim();
    const position = localStorage.getItem(`evenbetter_${groupName}_position`);
    if (position) {
      group.parentElement.insertBefore(group, group.parentElement.children[Number(position)]);
    }
  });
};

// src/extensions/sidebarTweaks/index.ts
var sidebarTweaks = () => {
  restoreSidebarGroupCollapsedStates();
  restoreSidebarGroupPositions();
  addMoveButtonsToSidebar();
  addGroupHideFunctionality();
};

// src/extensions/httpColorize/manual.ts
var highlightHTTPRow = () => {
  EventManager_default.on("onContextMenuOpen", (element) => {
    if (window.location.hash != "#/intercept")
      return;
    const activeRequestID = getActiveRequestID();
    if (!activeRequestID)
      return;
    modifyContextMenu(activeRequestID);
  });
};
var getActiveRequestID = () => {
  const selectedRequest = document.querySelector(".c-item-row__overlay").parentElement;
  if (!selectedRequest) {
    return null;
  }
  const requestID = selectedRequest.querySelector("div[data-column-id=ID]");
  return requestID?.textContent;
};
var getRowElementByID = (rowID) => {
  const items = document.querySelectorAll(`.c-item-row .c-item-cell[data-column-id='ID']`);
  for (let i = 0;i < items.length; i++) {
    if (items[i].textContent === rowID) {
      return items[i].closest(".c-item-row");
    }
  }
};
var modifyContextMenu = (rowID) => {
  const contextMenu = document.querySelector(".c-menu");
  const contextItems = contextMenu.querySelectorAll(".c-item");
  const contextDividers = contextMenu.querySelectorAll(".c-divider");
  if (!contextMenu || !contextItems || !contextDividers)
    return;
  const row = getRowElementByID(rowID);
  if (!row)
    return;
  const clonedDivider = contextDividers[0].cloneNode(true);
  contextMenu.insertBefore(clonedDivider, contextItems[contextItems.length]);
  const highlightRowMenu = contextMenu.querySelector(".fa-caret-right").parentElement.parentElement.cloneNode(true);
  highlightRowMenu.querySelector(".c-item__content").textContent = "Highlight row";
  highlightRowMenu.querySelector(".c-item__menu").outerHTML = `
        <div class="evenbetter__c-item__menu">
          <div class="evenbetter__c-menu">
            <div
              class="evenbetter__c-item"
            >
              <div class="evenbetter__c-item__content">None</div>
            </div>
            <div
              class="evenbetter__c-item"
            >
              <div class="evenbetter__c-item__content">Red</div>
            </div>
            <div
              class="evenbetter__c-item"
            >
              <div class="evenbetter__c-item__content">Green</div>
            </div>
            <div
              class="evenbetter__c-item"
            >
              <div class="evenbetter__c-item__content">Blue</div>
            </div>
            <div
              class="evenbetter__c-item"
            >
              <div class="evenbetter__c-item__content">Orange</div>
            </div>
          </div>
        </div>
      `;
  highlightRowMenu.id = "highlightRowMenu";
  const cItemMenu = highlightRowMenu.querySelector(".evenbetter__c-item__menu");
  cItemMenu.style.display = "none";
  highlightRowMenu.querySelectorAll(".evenbetter__c-item").forEach((item) => {
    let color = item.querySelector(".evenbetter__c-item__content").textContent;
    item.style.paddingLeft = "0.35rem";
    item.style.borderRadius = "0";
    if (color !== "None") {
      item.style.borderLeft = "3px solid";
      item.style.borderLeftColor = color;
    }
  });
  highlightRowMenu.addEventListener("mouseenter", () => {
    cItemMenu.style.display = "block";
    cItemMenu.style.left = "14em";
    cItemMenu.style.top = "220px";
    if (cItemMenu.getBoundingClientRect().right + 100 > window.innerWidth) {
      cItemMenu.style.left = "-6rem";
    }
  });
  contextItems.forEach((item) => item.addEventListener("mouseenter", closeCustomContextMenu));
  highlightRowMenu.querySelectorAll(".evenbetter__c-item").forEach((color) => {
    color.addEventListener("click", () => {
      let colorText = color.querySelector(".evenbetter__c-item__content").textContent;
      if (colorText === "None") {
        if (row) {
          row.style.backgroundColor = "";
          row.removeAttribute("highlighted");
        }
        removeHighlightedRow(rowID);
      } else {
        if (row) {
          row.style.backgroundColor = colorText;
          row.setAttribute("highlighted", colorText);
        }
        storeHighlightedRow(rowID, colorText);
      }
      closeCustomContextMenu();
    });
  });
  contextMenu.insertBefore(highlightRowMenu, contextItems[contextItems.length]);
};
var closeCustomContextMenu = () => {
  const highlightRowMenu = document.getElementById("highlightRowMenu");
  if (highlightRowMenu) {
    highlightRowMenu.querySelector(".evenbetter__c-item__menu").style.display = "none";
  }
};
var storeHighlightedRow = (rowID, color) => {
  const highlightedRows = JSON.parse(localStorage.getItem(getProjectName() + ".highlightedRows")) || {};
  highlightedRows[rowID] = color;
  localStorage.setItem(getProjectName() + ".highlightedRows", JSON.stringify(highlightedRows));
};
var removeHighlightedRow = (rowID) => {
  const highlightedRows = JSON.parse(localStorage.getItem(getProjectName() + ".highlightedRows")) || {};
  delete highlightedRows[rowID];
  localStorage.setItem(getProjectName() + ".highlightedRows", JSON.stringify(highlightedRows));
};
var isRowIDHighlighted = (rowID) => {
  const highlightedRows = JSON.parse(localStorage.getItem(getProjectName() + ".highlightedRows")) || {};
  return highlightedRows[rowID] !== undefined;
};
var getRowIDColor = (rowID) => {
  const highlightedRows = JSON.parse(localStorage.getItem(getProjectName() + ".highlightedRows")) || {};
  return highlightedRows[rowID];
};
var getProjectName = () => {
  let name = document.querySelector(".c-current-project .c-current-project__right")?.textContent;
  if (!name) {
    return "Untitled";
  }
  return name;
};

// src/extensions/httpColorize/colorize.ts
var httpHistoryObserver = null;
var observeHTTPRequests = () => {
  const requests = document.querySelector(".c-table__wrapper");
  if (!requests)
    return;
  if (httpHistoryObserver) {
    httpHistoryObserver.disconnect();
    httpHistoryObserver = null;
  }
  httpHistoryObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "highlighted") {
        const cell = mutation.target;
        colorizeCell(cell);
        return;
      }
    });
    if (mutations.some((mutation) => mutation.target.getAttribute("colorized")))
      return;
    colorizeHttpHistory();
  });
  const config = {
    childList: true,
    characterData: true,
    attributes: true,
    subtree: true
  };
  httpHistoryObserver.observe(requests, config);
};
var colorizeHttpHistory = () => {
  const queryCells = document.querySelectorAll('.c-item-cell[data-column-id="REQ_QUERY"]');
  queryCells.forEach((cell) => colorizeCell(cell));
};
var colorizeCell = (cell) => {
  const row = cell.parentElement;
  const rowID = row.querySelector(".c-item-cell[data-column-id='ID']").textContent;
  if (isRowIDHighlighted(rowID)) {
    row.style.backgroundColor = getRowIDColor(rowID);
    row.setAttribute("colorized", "true");
  } else {
    row.style.backgroundColor = "";
    row.setAttribute("colorized", "false");
  }
};

// src/extensions/httpColorize/index.ts
var colorizeHTTPFunctionality = () => {
  if (getSetting("highlightRowsFunctionality") === "false")
    return;
  EventManager_default.on("onPageOpen", (data) => {
    if (data.newUrl == "#/intercept") {
      setTimeout(() => {
        observeHTTPRequests();
        colorizeHttpHistory();
      }, 100);
    }
  });
  highlightHTTPRow();
};

// src/utils/Modal.ts
var generateModal = ({ title, content }) => {
  const modal = document.createElement("div");
  modal.classList.add("evenbetter-modal");
  modal.innerHTML = `
      <div class="evenbetter-modal__content">
          <div class="evenbetter-modal__content-header">
              <h2 class="evenbetter-modal__content-header-title"></h2>
          </div>
          <div class="evenbetter-modal__content-body">
              <p class="evenbetter-modal__content-body-text"></p>
              <button class="evenbetter-modal__content-body-close">
                  Close
              </button>
          </div>
      </div>
    `;
  modal.querySelector(".evenbetter-modal__content-header-title").textContent = title;
  modal.querySelector(".evenbetter-modal__content-body-text").innerHTML = content;
  modal.querySelector(".evenbetter-modal__content-body-close")?.addEventListener("click", closeModal);
  return modal;
};
var isModalOpen = () => {
  return document.querySelector(".evenbetter-modal") !== null;
};
var closeModal = () => {
  const modal = document.querySelector(".evenbetter-modal");
  modal?.remove();
};
var openModal = ({ title, content }) => {
  if (isModalOpen()) {
    closeModal();
  }
  const modal = generateModal({ title, content });
  document.body.appendChild(modal);
};

// src/events/onContextMenuOpen.ts
class OnContextMenuOpen {
  handlers = [];
  addHandler(handler) {
    this.handlers.push(handler);
  }
  init() {
    const observerOptions = {
      childList: true,
      subtree: true
    };
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        const target = mutation.target;
        if (target.classList.contains("c-context-menu__floating")) {
          if (isContextMenuOpen()) {
            this.trigger(target);
          }
          break;
        }
      }
    });
    observer.observe(document.body, observerOptions);
  }
  trigger(element) {
    this.handlers.forEach((handler) => handler(element));
  }
}
var isContextMenuOpen = () => {
  return document.querySelector(".c-context-menu__floating .c-menu") !== null;
};
var onContextMenuOpen = new OnContextMenuOpen;

// src/extensions/qucikMAR/index.ts
var quickMatchAndReplace = () => {
  EventManager_default.on("onContextMenuOpen", (element) => {
    if (!(window.location.hash == "#/replay" || window.location.hash == "#/intercept"))
      return;
    if (document.getSelection().toString().trim() == "")
      return;
    const dropdown = element;
    const menu = dropdown.querySelector(".c-menu");
    const dropdownItems = dropdown.querySelectorAll(".c-item");
    const newItem = dropdownItems[0].cloneNode(true);
    let insertBefore = dropdownItems[0];
    for (let i = 0;i < dropdownItems.length; i++) {
      if (dropdownItems[i].querySelector(".c-item__content").textContent == "Send to Automate") {
        insertBefore = dropdownItems[i];
        break;
      }
    }
    newItem.querySelector(".c-item__content").textContent = "Send to Match & Replace";
    newItem.querySelector(".c-item__trailing-visual")?.remove();
    newItem.querySelector(".c-item__leading-visual")?.remove();
    let selectedText = "";
    document.addEventListener("mousedown", () => {
      selectedText = document.getSelection().toString().trim();
    });
    newItem.addEventListener("click", () => {
      const textToUse = selectedText;
      window.location.hash = "#/tamper";
      let interval = setInterval(() => {
        const searchInput = document.querySelector(".c-tamper textarea");
        if (searchInput) {
          searchInput.value = textToUse;
          clearInterval(interval);
        }
      }, 2);
      menu.remove();
    });
    menu.insertBefore(newItem, insertBefore.nextSibling);
  });
};

// src/extensions/quickDecode/index.ts
var syntaxHighlight = function(json) {
  json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
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
    return '<span class="evenbetter__syntax-' + cls + '">' + match + "</span>";
  });
};
var isUrlEncoded = function(str) {
  const urlRegex = /(%[0-9A-Fa-f]{2})+/g;
  return urlRegex.test(str);
};
var attachQuickDecode = () => {
  const sessionListBody = document.querySelector(".c-session-list-body");
  if (!sessionListBody)
    return;
  if (document.querySelector(".evenbetter__qd-body"))
    return;
  const quickDecode = document.createElement("div");
  quickDecode.classList.add("evenbetter__qd-body");
  quickDecode.id = "evenbetter__qd-body";
  quickDecode.style.display = "none";
  quickDecode.innerHTML = ` 
  <div class="evenbetter__qd-selected-text">
    <div class="evenbetter__qd-selected-text-label">Decoded text:</div>
    <div class="evenbetter__qd-selected-text-box"></div>
  </div>
  `;
  document.addEventListener("selectionchange", (e) => {
    if (window.location.hash !== "#/replay")
      return;
    const selectedText = window.getSelection().toString();
    const decodedTextBox = document.querySelector(".evenbetter__qd-selected-text-box");
    const decodedTextLabel = document.querySelector(".evenbetter__qd-selected-text-label");
    if (selectedText.trim() !== "") {
      const decoded = tryToDecode(selectedText);
      quickDecode.style.display = "block";
      decodedTextLabel.textContent = `Decoded text (${decoded.encodeMethod}):`;
      if (isValidJSON(decoded.decodedContent)) {
        decodedTextBox.innerHTML = document.createElement("pre").innerHTML = syntaxHighlight(decoded.decodedContent);
      } else {
        decodedTextBox.textContent = decoded.decodedContent;
      }
    } else {
      quickDecode.style.display = "none";
    }
  });
  sessionListBody.appendChild(quickDecode);
};
var decodeOnHover = () => {
  const codeLines = document.querySelectorAll(".cm-line");
  codeLines.forEach((line) => {
    if (line.getAttribute("evenbetter-hover-tooltip"))
      return;
    line.setAttribute("evenbetter-hover-tooltip", "true");
    line.addEventListener("mouseover", (e) => {
      const target = e.target;
      const textContent = target.textContent;
      if (isUrlEncoded(textContent)) {
        try {
          const decodedText = decodeURIComponent(textContent);
          line.setAttribute("title", decodedText);
        } catch (error) {
        }
      }
    });
    line.addEventListener("mouseout", () => line.removeAttribute("title"));
  });
};
var tryToDecode = (input) => {
  try {
    const decodedBase64 = atob(input);
    return { encodeMethod: "base64", decodedContent: decodedBase64 };
  } catch (error) {
    if (isUrlEncoded(input)) {
      try {
        const decodedUrl = decodeURIComponent(input);
        return { encodeMethod: "url", decodedContent: decodedUrl };
      } catch (error2) {
        return { encodeMethod: "none", decodedContent: input };
      }
    }
    return { encodeMethod: "none", decodedContent: input };
  }
};
var isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};
var quickDecode = () => {
  if (getSetting("quickDecode") !== "true")
    return;
  EventManager_default.on("onPageOpen", (data) => {
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

// src/extensions/dropdownTweaks/index.ts
var dropdownTweaks = () => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const contextMenu = document.querySelector(".c-context-menu__floating > .c-menu");
      if (contextMenu)
        contextMenu.remove();
    }
  });
};

// src/index.ts
var init2 = () => {
  Logger_default.info(`EvenBetter ${CURRENT_VERSION} is loading, thanks for using it! \uD83C\uDF89`);
  EventManager_default.registerEvent("onCaidoLoad", onCaidoLoad);
  EventManager_default.registerEvent("onSettingsTabOpen", onSettingsTabOpen);
  EventManager_default.registerEvent("onPageOpen", onPageOpen);
  EventManager_default.registerEvent("onContextMenuOpen", onContextMenuOpen);
  setup();
  EventManager_default.on("onCaidoLoad", (event) => {
    quickSSRFFunctionality();
    onScopeTabOpen();
    sidebarTweaks();
    colorizeHTTPFunctionality();
    quickDecode();
    dropdownTweaks();
    setTimeout(() => quickMatchAndReplace(), 500);
    setTimeout(() => {
      let newUrl = window.location.hash;
      if (newUrl.includes("?custom-path=")) {
        newUrl = newUrl.split("?custom-path=")[1];
      }
      EventManager_default.triggerEvent("onPageOpen", {
        newUrl,
        oldUrl: ""
      });
    }, window.location.hash.startsWith("#/settings/") ? 50 : 400);
    const cssVersion = getComputedStyle(document.documentElement).getPropertyValue("--evenbetter-css-version").replace(/['"]+/g, "").trim();
    if (cssVersion !== CURRENT_VERSION) {
      openModal({
        title: "Incompatible CSS version",
        content: `EvenBetter Custom CSS is not compatible with the current JS version of EvenBetter. Please update the EvenBetter CSS to the latest version.`
      });
    }
  });
  EventManager_default.initEvents();
};
init2();
