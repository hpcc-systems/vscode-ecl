import { exists, readFile } from "./fs";
import { resolve } from "path";
import { extensions } from "vscode";

export interface ILanguagePack {
    [key: string]: string;
}

let m_options: { locale: string };
let m_bundle = {} as ILanguagePack;

function init() {
    let nlsConfig = {};
    try {
        nlsConfig = JSON.parse((typeof process !== "undefined" ? process.env?.VSCODE_NLS_CONFIG : undefined) || "{}");
    } catch (e: any) {
        console.error(`Failed to parse VSCODE_NLS_CONFIG:  ${e?.message ?? e}`);
    }
    m_options = {
        ...m_options,
        ...nlsConfig
    };
}

async function resolveLanguagePack(): Promise<ILanguagePack> {
    init();

    const languageFormat = "package.nls{0}.json";
    const defaultLanguage = languageFormat.replace("{0}", "");

    const rootPath = extensions.getExtension("hpcc-systems.ecl")?.extensionPath;
    if (!rootPath) {
        return {};
    }

    const resolvedLanguage = await recurseCandidates(
        rootPath,
        languageFormat,
        m_options.locale
    );

    const languageFilePath = resolve(rootPath, resolvedLanguage);

    const defaultLanguageBundle = resolvedLanguage !== defaultLanguage
        ? await readBundle(resolve(rootPath, defaultLanguage))
        : {};

    const resolvedLanguageBundle = await readBundle(languageFilePath);

    return { ...defaultLanguageBundle, ...resolvedLanguageBundle };
}

async function readBundle(filePath: string): Promise<ILanguagePack> {
    try {
        return JSON.parse(await readFile(filePath, "utf-8"));
    } catch (e: any) {
        console.error(`Failed to load language bundle "${filePath}":  ${e?.message ?? e}`);
        return {};
    }
}

async function recurseCandidates(
    rootPath: string,
    format: string,
    candidate: string
): Promise<string> {
    if (rootPath !== undefined && format !== undefined && candidate !== undefined) {
        const filename = format.replace("{0}", `.${candidate}`);
        const filepath = resolve(rootPath, filename);
        if (await exists(filepath)) {
            return filename;
        }
        if (candidate.split("-")[0] !== candidate) {
            return await recurseCandidates(rootPath, format, candidate.split("-")[0]);
        }
    }
    return format.replace("{0}", "");
}

export async function initialize(): Promise<void> {
    m_bundle = await resolveLanguagePack();
}

export class Localize {

    public localize(key: string, ...args: string[]): string {
        const message = m_bundle[key] || key;
        return this.format(message, args);
    }

    private format(message: string, args: string[] = []): string {
        return args.length
            ? message.replace(
                /\{(\d+)\}/g,
                (match, rest: any[]) => args[rest[0]] || match
            )
            : message;
    }
}

export default Localize.prototype.localize.bind(new Localize());