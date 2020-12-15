import KELParserVisitor from "../grammar/kel/KELParserVisitor";

interface ECLLocation {
    start: number;
    stop: number;
    text?: string;
}

export class KELVisitor extends KELParserVisitor {

    _eclLocations: ECLLocation[] = [];

    constructor() {
        super();
    }

    eclBodyContains(start: number, stop: number): boolean {
        for (const eclLocation of this._eclLocations) {
            if (start >= eclLocation.start && start <= eclLocation.stop) {
                return true;
            }
            if (stop >= eclLocation.start && stop <= eclLocation.stop) {
                return true;
            }
        }
        return false;
    }

    visitTerminal(ctx) {
        return ctx.symbol.text;
    }

    visitProgram(ctx) {
        const children = super.visitProgram(ctx);
        return children;
    }

    visitEntityMapping(ctx) {
        const children = super.visitEntityMapping(ctx);
        this._eclLocations.push({ start: ctx.start.start, stop: ctx.stop.stop, text: ctx.getText() });
        return children;
    }

    visitEclExpression(ctx) {
        const children = super.visitEclExpression(ctx);
        this._eclLocations.push({ start: ctx.start.start, stop: ctx.stop.stop, text: ctx.getText() });
        return children;
    }

    visitEclFragment(ctx) {
        const children = super.visitEclFragment(ctx);
        this._eclLocations.push({ start: ctx.start.start, stop: ctx.stop.stop, text: ctx.getText() });
        return children;
    }

    visitEclBody(ctx) {
        const children = super.visitEclBody(ctx);
        this._eclLocations.push({ start: ctx.start.start, stop: ctx.stop.stop, text: ctx.getText() });
        return children;
    }
}
