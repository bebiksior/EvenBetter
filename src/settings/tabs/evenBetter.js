const { getSetting, setSetting } = require("../settings");
const { themes, loadTheme } = require("../../themes/themes");

export const evenBetterTab = () => {
  const currentTheme = getSetting("theme");

  const evenBetterTab = document.createElement("div");
  evenBetterTab.innerHTML = `
  
  <div class="even-better__settings">
    <div class="even-better__header">
      <div class="even-better__header-title">EvenBetter - Settings</div>
      <div class="even-better__header-description">Customize EvenBetter plugin here and make your Caido even better :D</div>
    </div>
    <div class="even-better__settings-content">
        <div class="even-better__sidebar-tweaks">
          <h2>Sidebar Tweaks</h2>
          <p>Here you can tweak your sidebar :D</p>

          <h3>Groups Hide Functionality</h3>
          <p>
            Choose if you want to use functionality that allows you to hide
            sidebar groups by clicking on them.
          </p>
          <div class="activate--box">
            <input type="checkbox" name="sidebarHideGroups" id="hidegroups"   ${
              getSetting("sidebarHideGroups") === "true" ? "checked" : ""
            } />
            <label for="hidegroups">Activate</label>
          </div>
          <hr />
          <h3>Groups Rearrange Functionality</h3>
          <p>
            Choose if you want to use functionality that allows you to rearrange
            your sidebar groups.
          </p>
          <div class="activate--box">
            <input
              type="checkbox"
              name="sidebarRearrangeGroups"
              id="rearrangegroups"
              ${
                getSetting("sidebarRearrangeGroups") === "true" ? "checked" : ""
              }
            /> 
            <label for="rearrangegroups">Activate</label>
          
          </div>
        </div>
        <div class="even-better__colorize-http">
          <h2>Colorize HTTP</h2>
          <p>
            Choose if you want to use colorize http functionality and specify the
            parameter name
          </p>

          <div class="activate--box">
            <input
              type="checkbox"
              name="colorizeHttpRows"
              id="colorizehttp"
              ${
                getSetting("colorizeHttpRows") === "true"
                  ? "checked"
                  : ""
              }
            />
            <label for="colorizehttp">Activate</label>
          </div>

          <br />
          <label for="param">Parameter name</label>
          <br />
          <input type="text" name="colorizeParameterName" id="colorizeParameterName" placeholder="_color" />
        </div>
        <div class="even-better__quick-ssrf">
          <h2>Quick SSRF Instance</h2>
          <p>
            Choose if you want to use quick ssrf instance functionality and
            specify the placeholder
          </p>

          <div class="activate--box">
            <input
              type="checkbox"
              name="ssrfInstanceFunctionality"
              id="ssrfinstance"
              ${
                getSetting("ssrfInstanceFunctionality") === "true"
                  ? "checked"
                  : ""
              }
            />
            <label for="ssrfinstance">Activate</label>
          </div>
          <br />
          <label for="placeholder">Placeholder</label>
          <br />
          <input type="text" name="ssrfInstancePlaceholder" id="ssrfplaceholder" placeholder="$ssrfinstance" />
        </div>
        <div class="even-better__theme-section">
          <h2>Theme</h2>
          <p>Choose your Caido theme</p>
          <select name="theme" class="even-better__theme-select">
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
    </div>`;

  evenBetterTab.id = "evenbetter-settings-content";

  evenBetterTab.querySelector("#ssrfplaceholder").value = getSetting("ssrfInstancePlaceholder");
  evenBetterTab.querySelector("#colorizeParameterName").value = getSetting("colorizeParameterName");

  const select = evenBetterTab.querySelector(".even-better__theme-select");
  select.addEventListener("change", (event) => {
    const theme = event.target.value;
    setSetting("theme", theme);
    loadTheme(theme);
  });

  const checkboxes = evenBetterTab.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const name = event.target.name;
      const value = event.target.checked;

      setSetting(name, value);
      location.reload();
    });
  });

  const inputs = evenBetterTab.querySelectorAll("input[type=text]");

  let timeout;
  inputs.forEach((input) => {
    input.addEventListener("input", (event) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const name = event.target.name;
        const value = event.target.value;
        setSetting(name, value);

        location.reload();
      }, 1000);
    });
  });

  return evenBetterTab;
};
