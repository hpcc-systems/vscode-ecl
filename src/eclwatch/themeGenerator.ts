import { webDarkTheme, webLightTheme, type Theme } from "@fluentui/react-components";

function isDark(background: string): boolean {
    const match = background.match(/^#([0-9a-f]{6})$/i);
    if (!match) {
        return false;
    }
    const value = parseInt(match[1], 16);
    const red = (value >> 16) & 0xff;
    const green = (value >> 8) & 0xff;
    const blue = value & 0xff;
    return (red * 299 + green * 587 + blue * 114) / 1000 < 128;
}

export function initTheme(): Theme {
    const bodyStyles = window.getComputedStyle(document.body);

    const backColor = bodyStyles.getPropertyValue("--vscode-editor-background") || "white";
    const foreColour = bodyStyles.getPropertyValue("--vscode-input-foreground") || "black";
    const primary = bodyStyles.getPropertyValue("--vscode-progressBar-background") || "navy";
    return {
        ...(isDark(backColor) ? webDarkTheme : webLightTheme),
        colorNeutralBackground1: backColor,
        colorNeutralForeground1: foreColour,
        colorBrandBackground: primary,
        colorBrandForeground1: foreColour
    };
}