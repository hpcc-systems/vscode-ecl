import { loadTheme } from "@uifabric/styling";
import {
    IThemeRules,
    ThemeGenerator,
    themeRulesStandardCreator,
} from "@fluentui/react/lib/ThemeGenerator";
import { getColorFromString } from "@fluentui/react";
import { IColor } from "@fluentui/react";

export class ThemeProvider {
    private themeRules: IThemeRules;

    constructor(foreground: string, background: string) {
        const themeRules = themeRulesStandardCreator();
        ThemeGenerator.insureSlots(this.themeRules, false);
        ThemeGenerator.setSlot(themeRules.backgroundColor, getColorFromString(background), false, true, true);
        ThemeGenerator.setSlot(themeRules.foregroundColor, getColorFromString(foreground), false, true, true);
        this.themeRules = themeRules;
    }

    public loadThemeForColor(primary: string): void {
        const newColor: IColor = getColorFromString(primary);

        const themeRules = this.themeRules;
        ThemeGenerator.setSlot(themeRules.primaryColor, newColor.str, false, true, true);
        this.themeRules = themeRules;
        const theme = ThemeGenerator.getThemeAsJson(this.themeRules);
        loadTheme({
            ...{ palette: theme },
            isInverted: false,
        });
    }
}