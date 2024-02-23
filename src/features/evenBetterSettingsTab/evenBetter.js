const {
  getSetting,
  setSetting,
  defaultSettings,
  checkForUpdates,
} = require("../../settings/settings");
const { themes, loadTheme } = require("../../themes/themes");

export const evenBetterTab = () => {
  const currentTheme = getSetting("theme");

  const evenBetterTab = document.createElement("div");
  evenBetterTab.innerHTML = `
  <div class="even-better__settings">
    <header>
      <div class="header-title">
        <h1>EvenBetter ${defaultSettings.currentVersion} - Settings</h1>
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
              ${Object.keys(themes)
                .map(
                  (theme) =>
                    `<option value="${theme}" ${
                      currentTheme == theme ? "selected" : ""
                    }>${themes[theme].name}</option>`
                )
                .join("")}
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
            <div class="toggle-features__content-item">
              <div class="toggle-features__content-item-title">
                Sidebar tweaks
              </div>

              <div class="toggle-features__content-item-toggle">
                <div class="toggle-features__content-item-description">
                  <b>Groups Rearrange:</b> Show move buttons next to sidebar
                  groups.
                </div>
                <div>
                  <input type="checkbox" name="sidebarRearrangeGroups" id="rearrangegroups" ${
                    getSetting("sidebarRearrangeGroups") === "true"
                      ? "checked"
                      : ""
                  } />
                </div>
              </div>

              <div class="toggle-features__content-item-toggle">
                <div class="toggle-features__content-item-description">
                  <b>Groups Collapse:</b> This allows you to collapse groups
                  in the sidebar.
                </div>
                <div>
                  <input type="checkbox" name="sidebarHideGroups" id="hidegroups" ${
                    getSetting("sidebarHideGroups") === "true" ? "checked" : ""
                  } />
                </div>
              </div>
            </div>

            <hr />

            <div class="toggle-features__content-item">
              <div class="toggle-features__content-item-title">
                Quick SSRF Instance
              </div>

              <div class="toggle-features__content-item-toggle">
                <div class="toggle-features__content-item-description">
                  Quickly create new ssrf.cvssadvisor.com instance by typing the placeholder.
                </div>
                <div>
                  <input type="checkbox" name="ssrfInstanceFunctionality" id="ssrfinstance" ${
                    getSetting("ssrfInstanceFunctionality") === "true"
                      ? "checked"
                      : ""
                  } />
                </div>
              </div>
            </div>

            <hr />

            <div class="toggle-features__content-item">
              <div class="toggle-features__content-item-title">
                Highlight Rows
              </div>

              <div class="toggle-features__content-item-toggle">
                <div class="toggle-features__content-item-description">
                  Right click to highlight rows on the HTTP History page.
                </div>
                <div>
                  <input type="checkbox" name="highlightRowsFunctionality" id="highlightrows" ${
                    getSetting("highlightRowsFunctionality") === "true"
                      ? "checked"
                      : ""
                  } />
                </div>
              </div>
            </div>

            <hr />

            <div class="toggle-features__content-item">
              <div class="toggle-features__content-item-title">
                Version Check Warning
              </div>

              <div class="toggle-features__content-item-toggle">
                <div class="toggle-features__content-item-description">
                  Choose if you want to see warning on startup if you are
                  using outdated EvenBetter version.
                </div>
                <div>
                  <input type="checkbox" name="showOutdatedVersionWarning" id="versioncheck" ${
                    getSetting("showOutdatedVersionWarning") === "true"
                      ? "checked"
                      : ""
                  } />
                </div>
              </div>
            </div>

            <button disabled>Save</button>
          </div>
        </div>
      </div>
    </main>
  </div>`;

  evenBetterTab.id = "evenbetter-settings-content";

  // Theme selection
  const select = evenBetterTab.querySelector("select");
  select.addEventListener("change", (event) => {
    const theme = event.target.value;
    setSetting("theme", theme);
    loadTheme(theme);
  });

  // Toggle features
  const changes = [];
  let hasChanges = false;

  const checkboxes = evenBetterTab.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const name = event.target.name;
      const value = event.target.checked;

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
        saveButton.setAttribute("disabled", true);
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
    const ssrfInstanceFunctionalityChanges = [];
    ssrfInstanceFunctionality.querySelector("input").value = getSetting(
      "ssrfInstancePlaceholder"
    );

    ssrfInstanceFunctionality
      .querySelector("input")
      .addEventListener("input", (event) => {
        const value = event.target.value;
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

  // check updates
  checkForUpdates().then((data) => {
    if (data.includes("New EvenBetter version available")) {
      evenBetterTab.querySelector(".header-outdated").style.display = "block";
    }
  });

  return evenBetterTab;
};