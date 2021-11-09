import { exists, readFile } from "./fs";
import { resolve } from "path";
import { extensions } from "vscode";

export interface ILanguagePack {
    [key: string]: string;
}

let m_options: { locale: string };
let m_bundle = {} as ILanguagePack;

function init() {
    m_options = {
        ...m_options,
        ...JSON.parse(process.env.VSCODE_NLS_CONFIG || "{}")
    };
}

async function resolveLanguagePack(): Promise<ILanguagePack> {
    init();

    const languageFormat = "package.nls{0}.json";
    const defaultLanguage = languageFormat.replace("{0}", "");

    const rootPath = extensions.getExtension("hpcc-systems.ecl")?.extensionPath;

    const resolvedLanguage = await recurseCandidates(
        rootPath,
        languageFormat,
        m_options.locale
    );

    const languageFilePath = resolve(rootPath, resolvedLanguage);

    const defaultLanguageBundle = JSON.parse(
        resolvedLanguage !== defaultLanguage
            ? await readFile(resolve(rootPath, defaultLanguage), "utf-8")
            : "{}"
    );

    const resolvedLanguageBundle = JSON.parse(
        await readFile(languageFilePath, "utf-8")
    );

    return { ...defaultLanguageBundle, ...resolvedLanguageBundle };
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