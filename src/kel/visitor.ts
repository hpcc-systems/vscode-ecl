import KELParserVisitor from "../grammar/kel/KELParserVisitor";

export interface ECLLocation {
    start: number;
    stop: number;
}

export type KELSymbolKind = "association" | "entity" | "era" | "function" | "package" | "query" | "shell";

export interface KELSymbol {
    name: string;
    kind: KELSymbolKind;
    detail: string;
    start: number;
    stop: number;
    selectionStart: number;
    selectionStop: number;
    container?: string;
}

export interface KELImport {
    source: string;
    names: string[];
    alias?: string;
    start: number;
    stop: number;
    sourceStart: number;
    sourceStop: number;
}

export class KELVisitor extends KELParserVisitor {

    private _eclLocations: ECLLocation[];
    symbols: KELSymbol[] = [];
    imports: KELImport[] = [];

    private _containers: string[] = [];

    constructor(eclLocations: ECLLocation[] = []) {
        super();
        this._eclLocations = eclLocations;
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

    private addSymbol(ctx, token, kind: KELSymbolKind, detail: string): void {
        if (!token) {
            return;
        }
        this.symbols.push({
            name: token.text,
            kind,
            detail,
            start: ctx.start.start,
            stop: ctx.stop.stop,
            selectionStart: token.start,
            selectionStop: token.stop,
            container: this._containers.at(-1)
        });
    }

    visitEraDeclaration(ctx) {
        this.addSymbol(ctx, ctx.name, "era", `ERA ${ctx.type?.text ?? ""}`.trim());
        return super.visitEraDeclaration(ctx);
    }

    visitPackageDeclaration(ctx) {
        const name = ctx.ID()?.symbol;
        this.addSymbol(ctx, name, "package", "PACKAGE");
        if (name) {
            this._containers.push(name.text);
        }
        const children = super.visitPackageDeclaration(ctx);
        if (name) {
            this._containers.pop();
        }
        return children;
    }

    visitEntityDeclaration(ctx) {
        const kind = ctx.t?.text?.toLowerCase() === "association" ? "association" : "entity";
        this.addSymbol(ctx, ctx.ID()?.symbol, kind, ctx.t?.text ?? "ENTITY");
        return super.visitEntityDeclaration(ctx);
    }

    visitFunctionStatement(ctx) {
        const params = ctx.ps?.getText() ?? "";
        this.addSymbol(ctx, ctx.name, "function", `FUNCTION ${params}`.trim());
        return super.visitFunctionStatement(ctx);
    }

    visitQueryDeclaration(ctx) {
        const params = ctx.ps?.getText() ?? "";
        this.addSymbol(ctx, ctx.name, "query", `QUERY ${params}`.trim());
        return super.visitQueryDeclaration(ctx);
    }

    visitShellDeclaration(ctx) {
        const params = ctx.ps?.getText() ?? "";
        this.addSymbol(ctx, ctx.name, "shell", `SHELL ${params}`.trim());
        return super.visitShellDeclaration(ctx);
    }

    visitPackageExportDeclaration(ctx) {
        this.addSymbol(ctx, ctx.name, "shell", "SHELL");
        return super.visitPackageExportDeclaration(ctx);
    }

    visitSimpleImport(ctx) {
        for (const source of ctx.dotId()) {
            this.imports.push({
                source: source.getText(),
                names: [],
                start: ctx.start.start,
                stop: ctx.stop.stop,
                sourceStart: source.start.start,
                sourceStop: source.stop.stop
            });
        }
        return super.visitSimpleImport(ctx);
    }

    visitPackageImport(ctx) {
        const source = ctx.dotId();
        this.imports.push({
            source: source.getText(),
            names: ctx.ID().map(id => id.getText()),
            start: ctx.start.start,
            stop: ctx.stop.stop,
            sourceStart: source.start.start,
            sourceStop: source.stop.stop
        });
        return super.visitPackageImport(ctx);
    }

    visitSpcImport(ctx) {
        const source = ctx.dotId();
        this.imports.push({
            source: source.getText(),
            names: ["SPC"],
            alias: ctx.ID().getText(),
            start: ctx.start.start,
            stop: ctx.stop.stop,
            sourceStart: source.start.start,
            sourceStop: source.stop.stop
        });
        return super.visitSpcImport(ctx);
    }

}
