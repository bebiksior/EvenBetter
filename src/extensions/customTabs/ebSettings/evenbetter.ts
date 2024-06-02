import { checkForUpdates, getSetting, setSetting } from "../../../settings";
import { CURRENT_VERSION } from "../../../settings/constants";
import { Theme, loadTheme, themes } from "../../../appearance/themes";
import { fonts, loadFont } from "../../../appearance/fonts";
import "./evenbetter.css";
import { getEvenBetterAPI } from "../../../utils/evenbetterapi";

interface Change {
  name: string;
  value: any;
}

export const evenBetterSettingsTab = () => {
  const currentTheme = getSetting("theme");

  const evenBetterTab = document.createElement("div");
  evenBetterTab.innerHTML = createEvenBetterTabHTML(themes, currentTheme);
  evenBetterTab.classList.add("evenbetter-custom-tab");

  // Theme selection
  const select = evenBetterTab.querySelector(
    "#theme-select"
  ) as HTMLSelectElement;
  select.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    const theme = target.value;

    setSetting("theme", theme);
    loadTheme(theme);
  });

  // Font selection
  const fontSelect = evenBetterTab.querySelector(
    "#font-select"
  ) as HTMLSelectElement;
  fontSelect.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    const font = target.value;

    setSetting("font", font);
    loadFont(font);
  });

  // Toggle features
  const changes: Change[] = [];
  let hasChanges = false;

  const checkboxes = evenBetterTab.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;

      const name = target.name;
      const value = target.checked;

      const existingChangeIndex = changes.findIndex(
        (change) => change.name === name
      );
      if (existingChangeIndex !== -1) {
        changes.splice(existingChangeIndex, 1);
      } else {
        changes.push({ name, value });
      }

      hasChanges = changes.length > 0;

      const saveButton = evenBetterTab.querySelector(
        ".toggle-features__content button"
      );
      if (!saveButton) return;

      if (hasChanges) {
        saveButton.removeAttribute("disabled");
      } else {
        saveButton.setAttribute("disabled", "true");
      }
    });
  });

  const saveButton = evenBetterTab.querySelector(
    ".toggle-features__content button"
  );
  if (!saveButton) return;

  saveButton.addEventListener("click", () => {
    changes.forEach((change) => {
      setSetting(change.name, change.value);
    });

    localStorage.setItem("previousPath", "#/settings/evenbetter");
    location.reload();
  });

  // Quick SSRF Instance
  const ssrfInstanceFunctionality = evenBetterTab.querySelector(
    ".ssrfInstanceFunctionality"
  );
  if (ssrfInstanceFunctionality) {
    const ssrfInstanceFunctionalityChanges: Change[] = [];

    const input = ssrfInstanceFunctionality.querySelector("input") as HTMLInputElement;
    if (!input) return;
    
    input.value = getSetting(
      "ssrfInstancePlaceholder"
    );

    input.addEventListener("input", (event) => {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        ssrfInstanceFunctionalityChanges.push({
          name: "ssrfInstancePlaceholder",
          value,
        });

        const saveButton = ssrfInstanceFunctionality.querySelector("button");
        if (!saveButton) return;

        saveButton.removeAttribute("disabled");
      });

    const button = ssrfInstanceFunctionality.querySelector("button");
    if (!button) return;

    button.addEventListener("click", () => {
        ssrfInstanceFunctionalityChanges.forEach((change) => {
          setSetting(change.name, change.value);

          localStorage.setItem("previousPath", window.location.hash);
          location.reload();
        });
      });
  }

  const useOpenAI = evenBetterTab.querySelector(".useopenai");
  if (useOpenAI) {
    const saveButton = useOpenAI.querySelector("button");
    if (!saveButton) return;

    const apiKeyInput = useOpenAI.querySelector("input") as HTMLInputElement;
    apiKeyInput.value = getSetting("openaiApiKey") || "";

    let originalValue = apiKeyInput.value;
    apiKeyInput.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      const value = target.value;
      if (!saveButton) return;

      if (value === originalValue) {
        saveButton.setAttribute("disabled", "true");
      } else {
        saveButton.removeAttribute("disabled");
      }
    });
    
    saveButton.addEventListener("click", (event) => {
      const value = apiKeyInput.value;

      setSetting("openaiApiKey", value);
      originalValue = value;
      saveButton.setAttribute("disabled", "true");

      getEvenBetterAPI().toast.showToast({
        message: "OpenAI API key saved!",
        duration: 2000,
        position: "bottom",
        type: "success",
      });
    });
  }

  checkForUpdates().then(({ isLatest, message }) => {
    if (!isLatest) {
      const headerOutdated = evenBetterTab.querySelector(
        ".header-outdated"
      ) as HTMLElement;
      headerOutdated.style.display = "block";
    }
  });

  return evenBetterTab;
};

const createEvenBetterTabHTML = (
  themes: { [key: string]: Theme },
  currentTheme: string
) => {
  const toggleFeatures = [
    {
      name: "sidebarTweaks",
      title: "Sidebar tweaks",
      items: [
        {
          name: "sidebarRearrangeGroups",
          title: "Groups Rearrange",
          description: "Show move buttons next to sidebar groups.",
        },
        {
          name: "sidebarHideGroups",
          title: "Groups Collapse",
          description: "This allows you to collapse groups in the sidebar.",
        },
      ],
    },
    {
      name: "ssrfInstanceFunctionality",
      title: "Quick SSRF Instance",
      items: [
        {
          name: "ssrfInstanceFunctionality",
          title: "Quick SSRF Instance",
          description:
            "Adds a Quick SSRF sidebar page and allows you to quickly create new SSRF instance by typing the placeholder.",
        },
      ],
    },
    {
      name: "quickDecode",
      title: "Quick Decode",
      items: [
        {
          name: "quickDecode",
          title: "Quick Decode",
          description:
            "Selecting text on the Replay page will attempt to decode it and show the result at the left bottom corner.",
        },
      ],
    },
    {
      name: "versionCheckWarning",
      title: "Version Check Warning",
      items: [
        {
          name: "showOutdatedVersionWarning",
          title: "Version Check Warning",
          description:
            "Choose if you want to see warning on startup if you are using outdated EvenBetter version.",
        },
      ],
    },
  ];

  const checkbox = (id: string) => {
    const checkbox =
      getEvenBetterAPI().components.createCheckbox() as HTMLInputElement;

    const input = checkbox.querySelector(
      ".eb-checkbox__input"
    ) as HTMLInputElement;
    input.name = id;
    input.id = id;

    if (getSetting(id) === "true") {
      input.setAttribute("checked", "true");
    }

    return checkbox;
  };

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
            <div class="settings-box__header-title">Appearance</div>
            <div class="settings-box__header-description">
              Change the appearance of your Caido
            </div>
          </div>

          <!-- Settings content -->
          <div class="settings-box__content">
            <div class="settings-box__content-item">
              <div class="settings-box__content-item-title">Theme</div>
              <select id="theme-select">
                ${Object.keys(themes)
                  .map(
                    (theme) =>
                      `<option value="${theme}" ${
                        theme === currentTheme ? "selected" : ""
                      }>${themes[theme]?.name}</option>`
                  )
                  .join("")}
              </select>
            </div>
            <div class="settings-box__content-item">
              <div class="settings-box__content-item-title">Font</div>
              <select id="font-select">
                ${Object.keys(fonts)
                  .map(
                    (font) =>
                      `<option value="${font}" ${
                        font === getSetting("font") ? "selected" : ""
                      }>${fonts[font]?.name}</option>`
                  )
                  .join("")}
              </select>
            </div>
          </div>
        </div>
        ${
          getSetting("ssrfInstanceFunctionality") == "true"
            ? `
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
                    placeholder="$ssrfinstance"
                    spellcheck="false"
                    class="c-text-input__input"
                  />
                </div>
              </div>
            </div>

            <button disabled>Save</button>
          </div>
        </div>`
            : ""
        }
        <div class="settings-box useopenai">
          <!-- Settings header -->
          <div class="settings-box__header">
            <div class="settings-box__header-title">Use OpenAI API</div>
            <div class="settings-box__header-description">
              Use the OpenAI API instead of Caido default assistant API.
            </div>
          </div>

          <!-- Settings content -->
          <div class="settings-box__content">
            <div class="c-text-input">
              <div class="c-text-input__outer">
                <div class="c-text-input__inner">
                  <input
                    placeholder="sk-xxxxxxx"
                    spellcheck="false"
                    class="c-text-input__input"
                    type="password"
                  />
                </div>
              </div>
            </div>

            <button disabled>Save</button>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="toggle-features">
          <div class="toggle-features__header">
            <div class="toggle-features__header-title">Toggle features</div>
            <div class="toggle-features__header-description">
              Enable or disable features of the EvenBetter plugin. Note that there are some smaller features that can't be turned off.
            </div>
          </div>
          <hr />
          <div class="toggle-features__content">
            ${toggleFeatures
              .map(
                (feature) => `
              <div class="toggle-features__content-item">
                <div class="toggle-features__content-item-title">
                  ${feature.title}
                </div>

                ${feature.items
                  .map(
                    (item) => `
                  <div class="toggle-features__content-item-toggle">
                    <div class="toggle-features__content-item-description">
                      <b>${item.title}:</b> ${item.description}
                    </div>
                    <div>
                      ${checkbox(item.name).innerHTML}
                    </div>
                  </div>`
                  )
                  .join("")}

              </div>

              <hr />`
              )
              .join("")}

            <button disabled>Save</button>
          </div>
        </div>
      </div>
    </main>
  </div>`;
};
