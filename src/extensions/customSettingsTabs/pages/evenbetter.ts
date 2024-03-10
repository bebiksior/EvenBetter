import {
  checkForUpdates,
  defaultSettings,
  getSetting,
  setSetting,
} from "../../../settings";
import { CURRENT_VERSION } from "../../../settings/constants";
import { Theme, loadTheme, themes } from "../../../themes";

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
  const select = evenBetterTab.querySelector("select");
  select.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    const theme = target.value;

    setSetting("theme", theme);
    loadTheme(theme);
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
  saveButton.addEventListener("click", () => {
    changes.forEach((change) => {
      setSetting(change.name, change.value);
    });

    location.reload();
  });

  // Quick SSRF Instance
  const ssrfInstanceFunctionality = evenBetterTab.querySelector(
    ".ssrfInstanceFunctionality"
  );
  if (ssrfInstanceFunctionality) {
    const ssrfInstanceFunctionalityChanges: Change[] = [];
    ssrfInstanceFunctionality.querySelector("input").value = getSetting(
      "ssrfInstancePlaceholder"
    );

    ssrfInstanceFunctionality
      .querySelector("input")
      .addEventListener("input", (event) => {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        ssrfInstanceFunctionalityChanges.push({
          name: "ssrfInstancePlaceholder",
          value,
        });

        const saveButton = ssrfInstanceFunctionality.querySelector("button");
        saveButton.removeAttribute("disabled");
      });

    ssrfInstanceFunctionality
      .querySelector("button")
      .addEventListener("click", () => {
        ssrfInstanceFunctionalityChanges.forEach((change) => {
          setSetting(change.name, change.value);

          location.reload();
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

const createEvenBetterTabHTML = (themes: { [key: string]: Theme }, currentTheme: string) => {
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
            "Quickly create new ssrf.cvssadvisor.com instance by typing the placeholder.",
        },
      ],
    },
    {
      name: "highlightRowsFunctionality",
      title: "Highlight Rows",
      items: [
        {
          name: "highlightRowsFunctionality",
          title: "Highlight Rows",
          description:
            "Right click to highlight rows on the HTTP History page.",
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
              ${
                Object.keys(themes)
                  .map(
                    (theme) =>
                      `<option value="${theme}" ${
                        theme === currentTheme ? "selected" : ""
                      }>${themes[theme].name}</option>`
                  )
                  .join("")
              }
            </select>
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
                      <input type="checkbox" name="${item.name}" id="${
                      item.name
                    }" ${getSetting(item.name) === "true" ? "checked" : ""} />
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
