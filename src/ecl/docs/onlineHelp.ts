import * as vscode from "vscode";
import { convert } from "html-to-text";

export const ECLR_EN_US = "https://hpccsystems.com/wp-content/uploads/_documents/ECLR_EN_US";
export const SLR_EN_US = "https://hpccsystems.com/wp-content/uploads/_documents/SLR_EN_US";
export const ProgrammersGuide_EN_US = "https://hpccsystems.com/wp-content/uploads/_documents/ProgrammersGuide_EN_US";

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

const commonFillWords = [
    "the", "and", "for", "with", "from", "that", "this", "which", "what", "how",
    "why", "when", "where", "who", "whom", "whose", "will", "would", "should", "could",
    "can", "may", "might", "shall", "must", "have", "has", "had", "do", "does", "did",
    "is", "are", "was", "were", "be", "been", "being", "it", "its", "they", "them",
    "their", "our", "we", "us", "you", "your", "my", "mine", "his", "her",
    "he", "she", "it", "its", "him", "her", "his", "hers", "they", "them", "their",
    "theirs", "we", "us", "our", "ours", "you", "your", "yours", "my", "mine",
    "our", "ours", "your", "yours", "my", "mine", "his", "her", "he", "she", "about", "know"
];

function simpleNormalize(text: string): string[] {
    const s = text.toLocaleLowerCase().replace(/[^a-z0-9]/g, " ");

    const words = s.split(" ")
        .filter((word) => word.length > 2)
        .filter((word) => !commonFillWords.includes(word))
        .map((e) => e.trim())
        .filter((e) => !!e);

    return words;
}

export interface Hit {
    label: string;
    url: string;
    exact: number;
    content: string;
    error?: string;
}
const _labelContentCache: { [id: string]: Promise<Hit> } = {};

function fetchContent(url: string, label: string, exact: number): Promise<Hit> {
    if (!_labelContentCache[url]) {
        _labelContentCache[url] = fetch(url)
            .then(async response => {
                return {
                    label,
                    url,
                    exact,
                    content: convert(await response.text(), { wordwrap: false })
                };
            }).catch(e => {
                return {
                    label,
                    url,
                    content: "",
                    exact: 0,
                    error: e.message()
                };
            });
    }
    return _labelContentCache[url];
}

export async function fetchIndexes(): Promise<Hit[]> {
    return Promise.all([ECLR_EN_US, SLR_EN_US, ProgrammersGuide_EN_US].map(url => {
        return fetchContent(url, url, 0);
    }));
}

export async function fetchContext(query: string): Promise<Hit[]> {

    const terms = simpleNormalize(query);
    const retVal: Promise<Hit>[] = [];
    await Promise.all(terms.map(term => {
        let exact = 0;
        return matchTopics(term)
            .then(async matches => {
                matches.forEach((match) => {
                    if (match.exact) {
                        exact++;
                    }

                    const url = match.uri.toString();
                    retVal.push(fetchContent(url, match.label, match.exact ? 1 : 0));
                });
            });
    }));

    return Promise.all(retVal).then(hits => {
        return hits.sort((a, b) => b.exact - a.exact);
    });
}
