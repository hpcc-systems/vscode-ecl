//@ts-ignore
import * as nlsHPCC from "../../../HPCC-Platform/esp/src/src/nls/hpcc";
//@ts-ignore
import * as bs from "../../../HPCC-Platform/esp/src/src/nls/bs/hpcc";
//@ts-ignore
import * as es from "../../../HPCC-Platform/esp/src/src/nls/es/hpcc";
//@ts-ignore
import * as fr from "../../../HPCC-Platform/esp/src/src/nls/fr/hpcc";
//@ts-ignore
import * as hr from "../../../HPCC-Platform/esp/src/src/nls/hr/hpcc";
//@ts-ignore
import * as hu from "../../../HPCC-Platform/esp/src/src/nls/hu/hpcc";
//@ts-ignore
import * as pt_br from "../../../HPCC-Platform/esp/src/src/nls/pt-br/hpcc";
//@ts-ignore
import * as sr from "../../../HPCC-Platform/esp/src/src/nls/sr/hpcc";
//@ts-ignore
import * as zh from "../../../HPCC-Platform/esp/src/src/nls/zh/hpcc";

import { outDir, sortAndWrite } from "./util";

const langs = {};
langs["bs"] = bs;
langs["es"] = es;
langs["fr"] = fr;
langs["hr"] = hr;
langs["hu"] = hu;
langs["pt-br"] = pt_br;
langs["sr"] = sr;
langs["zh"] = zh;

export function calcMissingECLWatch(vscodeLang) {
    const en = {
        ...vscodeLang,
        ...nlsHPCC.root
    };

    for (const lang in langs) {
        const foreign = langs[lang];

        const missing = {};
        const extra = {};
        const translated = {};
        for (const id in en) {
            if (!foreign[id]) {
                missing[id] = en[id];
            } else {
                translated[en[id]] = foreign[id];
            }
        }

        for (const id in foreign) {
            if (!en[id]) {
                extra[id] = foreign[id];
            }
        }

        if (Object.keys(missing).length) {
            sortAndWrite(`${outDir}/${lang}-missing.json`, missing);
        }

        if (Object.keys(extra).length) {
            sortAndWrite(`${outDir}/${lang}-extra.json`, extra);
        }

        if (Object.keys(extra).length) {
            sortAndWrite(`${outDir}/package.nls.${lang}.json`, translated);
        }
    }
}