// Created these themes with ChatGPT, feel free to create new themes and submit a PR :D
const themes = {
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
    "--selected-row-background": "var(--c-bg-default)",
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
    "--selected-row-background": "var(--c-bg-default)",
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
    "--selected-row-background": "#073642",
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
    "--selected-row-background": "var(--c-bg-default)",
  }
};

const loadTheme = (name) => {
  const theme = themes[name];
  if (!theme) return;

  Object.keys(theme).forEach((key) => {
    document.documentElement.style.setProperty(key, theme[key], "important");
  });
};

export { themes, loadTheme };
