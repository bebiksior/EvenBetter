export interface Font {
    name: string;
    url?: string;
}

export const fonts: { [key: string]: Font } = {
    defaultCaido: {
        name: "Caido Default",
    },
    jetbrainsMono: {
        name: "Jetbrains Mono",
        url: "https://fonts.cdnfonts.com/css/jetbrains-mono"
    },
    comicSans: {
        name: "Comic Sans MS",
        url: "https://fonts.googleapis.com/css2?family=Comic+Sans+MS"
    },
    firaCode: {
        name: "Fira Code",
        url: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..600&display=swap"
    }
}

export const loadFont = (fontName: string) => {
    const font = fonts[fontName];
    if (!font) return;

    if (document.getElementById(`evenbetter-custom-font`)) {
        document.getElementById(`evenbetter-custom-font`).remove();
    }

    if (!font.url) return;

    const style = document.createElement("style");
    style.id = `evenbetter-custom-font`;
    style.innerHTML = `@import url('${font.url}'); body { font-family: '${font.name}', sans-serif; }`;
    document.head.appendChild(style);
}