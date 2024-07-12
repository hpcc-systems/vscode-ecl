import { getColorFromString, IColor, IThemeRules, loadTheme, ThemeGenerator as FluentThemeGenerator, themeRulesStandardCreator } from "@fluentui/react";

class ThemeGenerator {
    private themeRules: IThemeRules;

    constructor(foreground: string, background: string) {
        const themeRules = themeRulesStandardCreator();
        FluentThemeGenerator.insureSlots(this.themeRules, false);
        FluentThemeGenerator.setSlot(themeRules.backgroundColor, getColorFromString(background), false, true, true);
        FluentThemeGenerator.setSlot(themeRules.foregroundColor, getColorFromString(foreground), false, true, true);
        this.themeRules = themeRules;
    }

    public loadThemeForColor(primary: string): void {
        const newColor: IColor = getColorFromString(primary);

        const themeRules = this.themeRules;
        FluentThemeGenerator.setSlot(themeRules.primaryColor, newColor.str, false, true, true);
        this.themeRules = themeRules;
        const theme = FluentThemeGenerator.getThemeAsJson(this.themeRules);
        loadTheme({
            ...{ palette: theme },
            isInverted: false,
        });
    }
}

export function initTheme() {
    const bodyStyles = window.getComputedStyle(document.body);

    const backColor = bodyStyles.getPropertyValue("--vscode-editor-background") || "white";
    const foreColour = bodyStyles.getPropertyValue("--vscode-input-foreground") || "black";

    const themeProvider = new ThemeGenerator(foreColour, backColor);
    themeProvider.loadThemeForColor(bodyStyles.getPropertyValue("--vscode-progressBar-background") || "navy");
}