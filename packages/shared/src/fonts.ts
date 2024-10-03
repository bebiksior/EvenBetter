const fonts = [
  { name: "Default", url: "" },
  {
    name: "JetBrains Mono",
    url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap",
  },
  {
    name: "Fira Code",
    url: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap",
  },
  {
    name: "Roboto Mono",
    url: "https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap",
  },
  {
    name: "Inconsolata",
    url: "https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..700&display=swap",
  },
];

export function getFontUrl(font: string) {
  const fontOption = fonts.find((f) => f.name === font);
  return fontOption ? fontOption.url : "";
}
