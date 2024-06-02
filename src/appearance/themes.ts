// Created these themes with ChatGPT, feel free to create new themes and submit a PR :D
export interface Theme {
  [key: string]: string;
}

const themes: { [key: string]: Theme } = {
  gray: {
    name: "Gray",
    "--c-header-cell-border": "#101010",
    "--c-bg-default": "#202020",
    "--c-bg-subtle": "#252525",
    "--c-table-item-row": "#252525",
    "--c-table-item-row-hover": "#303030",
    "--header-cell-width": "1px",
    "--c-table-even-item-row": "#282828",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)",
    "--c-table-background": "#222222"
  },
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
    "--selected-row-background": "var(--c-bg-default)",
    "--c-table-background": "#0b0b0b"
  },
  caido: {
    name: "Caido Default",
    "--c-header-cell-border": "#101010",
    "--c-bg-default": "#25272d",
    "--c-bg-subtle": "var(--c-gray-800)",
    "--c-table-item-row": "#353942",
    "--c-table-item-row-hover": "#25272d",
    "--header-cell-width": "0px",
    "--c-table-even-item-row": "#353942",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)",
    "--c-table-background": "rgb(43, 46, 53)"
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
    "--selected-row-background": "var(--c-bg-default)",
    "--c-table-background": "#213345"
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
    "--c-fg-default": "#e3e3e3",
    "--c-fg-subtle": "#657b83",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "#073642",
    "--c-table-background": "#03303c"

  },
  black: {
    name: "Black",
    "--c-header-cell-border": "#070707",
    "--c-bg-default": "#000000",
    "--c-bg-subtle": "#000000",
    "--c-table-item-row": "#050505",
    "--c-table-item-row-hover": "#222222",
    "--header-cell-width": "0px",
    "--c-table-even-item-row": "#111111",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)",
    "--c-table-background": "#000000"
  },
  /*light: {
    name: "Light",
    customCSS: `
      .toggle-features,
      .settings-box {
        border: 1px solid var(--c-gray-400);
      }

      .c-table-item__key {
        background-color: #d3d3d3 !important;
      }
    `,
    "--c-bg-inset": "#ffffff",
    "--c-header-cell-border": "#e1e4e8",
    "--c-bg-default": "#f6f8fa",
    "--c-bg-subtle": "#f6f8fa",
    "--c-table-item-row": "#f1f1f1",
    "--c-table-item-row-hover": "#e7e7e7",
    "--header-cell-width": "1px",
    "--c-table-even-item-row": "#ffffff",
    "--c-fg-default": "var(--c-black-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--selection-background": "rgba(0, 0, 0, 0.15)",
    "--selected-row-background": "var(--c-bg-default)",
  },*/
  neon: {
    name: "Neon",
    "--c-header-cell-border": "#ff6ac1",
    "--c-bg-default": "#2b213a",
    "--c-bg-subtle": "#30263e",
    "--c-table-item-row": "#2b213a",
    "--c-table-item-row-hover": "#3c2e52",
    "--header-cell-width": "1px",
    "--c-table-even-item-row": "#372e45",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)",
    "--c-table-background": "#2b213a"
  },
  deepdark: {
    name: "Deep Dark",
    "--c-header-cell-border": "#101010",
    "--c-bg-default": "#0b0b0b",
    "--c-bg-subtle": "#050505",
    "--c-table-item-row": "#0f0f0f",
    "--c-table-item-row-hover": "#1a1a1a",
    "--header-cell-width": "1px",
    "--c-table-even-item-row": "#0e0e0e",
    "--c-fg-default": "var(--c-white-100)",
    "--c-fg-subtle": "var(--c-gray-400)",
    "--selection-background": "rgba(255, 255, 255, 0.15)",
    "--selected-row-background": "var(--c-bg-default)",
    "--c-table-background": "#0b0b0b"
  },
};

const loadTheme = (name: string) => {
  const theme = themes[name];
  if (!theme) return;

  document.getElementById("evenbetter-custom-theme")?.remove();

  Object.keys(theme).forEach((key) => {
    if (!key.startsWith("--")) return;
    document.documentElement.style.setProperty(key, theme[key], "important");
  });

  if (theme.customCSS) {
    const style = document.createElement("style");
    style.id = "evenbetter-custom-theme";
    style.innerHTML = theme.customCSS;
    document.head.appendChild(style);
  }
};

export { themes, loadTheme };
