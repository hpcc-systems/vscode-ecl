import { EclBodyContext, EclExpressionContext, EclFragmentContext, EntityMappingContext, ProgramContext } from "../grammar/kel/KELParser";
import KELParserVisitor from "../grammar/kel/KELParserVisitor";

interface ECLLocation {
    start: number;
    stop: number;
    text?: string;
}

export class KELVisitor extends KELParserVisitor<void> {

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

    visitProgram = (ctx: ProgramContext) => {
        const children = this.visitChildren(ctx);
        return children;
    }

    visitEntityMapping = (ctx: EntityMappingContext) => {
        const children = this.visitChildren(ctx);
        this._eclLocations.push({ start: ctx.start.start, stop: ctx.stop.stop, text: ctx.getText() });
        return children;
    }

    visitEclExpression = (ctx: EclExpressionContext) => {
        const children = this.visitChildren(ctx);
        this._eclLocations.push({ start: ctx.start.start, stop: ctx.stop.stop, text: ctx.getText() });
        return children;
    }

    visitEclFragment = (ctx: EclFragmentContext) => {
        const children = this.visitChildren(ctx);
        this._eclLocations.push({ start: ctx.start.start, stop: ctx.stop.stop, text: ctx.getText() });
        return children;
    }

    visitEclBody = (ctx: EclBodyContext) => {
        const children = this.visitChildren(ctx);
        this._eclLocations.push({ start: ctx.start.start, stop: ctx.stop.stop, text: ctx.getText() });
        return children;
    }
}
