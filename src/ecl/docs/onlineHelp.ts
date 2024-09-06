import * as vscode from "vscode";
import { loadStore } from "./SimilarityModel";
import { convert } from "html-to-text";

export const BASE_URL = "https://hpccsystems.com/wp-content/uploads/_documents";
export const ECLR_EN_US = `${BASE_URL}/ECLR_EN_US`;
export const SLR_EN_US = `${BASE_URL}/SLR_EN_US`;
export const ProgrammersGuide_EN_US = `${BASE_URL}/ProgrammersGuide_EN_US`;

interface HelpMeta {
    orig: string;
    partialUrl: string;
    title: string;
    titleParts: string[];
    url: string;
}

async function parseIndex(url: string): Promise<HelpMeta[]> {
    return fetch(`${url}/index.html`)
        .then(response => response.text())
        .then(html => [...html.matchAll(/<a\s+href="([^"]+)">([^<]+)<\/a>/g)])
        .then(matches => matches.map(row => {
            const title = row[2].split("\n").join(" | ");
            const titleParts = row[2].split("\n").join(" ").split(" ").map(str => str.trim().toLocaleLowerCase()).filter(term => !!term);
            return {
                orig: row[0],
                partialUrl: row[1],
                title,
                titleParts,
                url
            };
        }));
}

let _labelUriCache: Promise<HelpMeta[]>;
interface MatchUri {
    label: string;
    uri: vscode.Uri;
    exact: boolean;
}

export async function matchTopics(_word: string): Promise<MatchUri[]> {
    if (!_labelUriCache) {
        const langRef = parseIndex(ECLR_EN_US);
        const stdLib = parseIndex(SLR_EN_US);
        const progGuide = parseIndex(ProgrammersGuide_EN_US);
        _labelUriCache = Promise.all([langRef, stdLib, progGuide]).then(([langRef, stdLib, progGuide]) => {
            return progGuide.concat(stdLib).concat(langRef);
        });
    }

    const word = _word.toLocaleLowerCase();
    return _labelUriCache.then((links: HelpMeta[]) => {
        return links
            .filter(row => {
                return row.titleParts.some(term => term.indexOf(word) >= 0);
            }).map(row => {
                return {
                    label: row.title,
                    uri: vscode.Uri.parse(`${row.url}/${row.partialUrl}`),
                    exact: row.titleParts.includes(word)
                };
            }).sort((a, b) => a.exact ? -1 : b.exact ? 1 : 0);
    });
}

export interface Hit {
    label: string;
    url: string;
    content: string;
    error?: string;
}
const _labelContentCache: { [id: string]: Promise<Hit> } = {};

function fetchContent(url: string, label: string): Promise<Hit> {
    if (!_labelContentCache[url]) {
        _labelContentCache[url] = fetch(url)
            .then(async response => {
                return {
                    label,
                    url,
                    content: convert(await response.text(), { wordwrap: false })
                };
            }).catch(e => {
                return {
                    label,
                    url,
                    content: "",
                    error: e.message()
                };
            });
    }
    return _labelContentCache[url];
}

export async function fetchIndexes(): Promise<Hit[]> {
    return Promise.all([ECLR_EN_US, SLR_EN_US, ProgrammersGuide_EN_US].map(url => {
        return fetchContent(url, url);
    }));
}

export async function fetchContext(query: string, modelPath: Promise<vscode.Uri>, docsPath: vscode.Uri): Promise<Hit[]> {
    const docsVStore = await loadStore(modelPath, docsPath);
    const similarPages = await docsVStore.similaritySearch(query, 5);

    return similarPages.map(similarPage => {
        const parts = similarPage.metadata.url.split("/");
        const label = parts[parts.length - 1].split(".")[0];
        const url = `${BASE_URL}/${similarPage.metadata.url}`;
        return {
            label,
            url,
            content: similarPage.pageContent
        };
    });
}
