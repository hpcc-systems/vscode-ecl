import * as  hpccComms from "@hpcc-js/comms";
import * as hpccEclwatch from "@hpcc-js/eclwatch";
import { div } from "./util";

export async function esp(url: string) {
    return {
        url,
        wu: (wuid: string) => wu(hpccComms.Workunit.attach({ baseUrl: url }, wuid))
    };
}

function wu(wu: hpccComms.Workunit) {
    return {
        wuid: wu.Wuid,
        results: async () => {
            const results = await wu.fetchResults();
            const retVal = results.map(result);
            retVal.forEach(r => {
                retVal[r.name] = r;
            });
            return retVal;
        }
    };
}

function result(r: hpccComms.Result) {
    return {
        name: r.Name,
        data: (from?: number, count?: number) => {
            return r.fetchRows(from, count);
        },
        async *table(props: { height?: number, [key: string]: any } = {}) {
            const wuResult = new hpccEclwatch.WUResult()
                .baseUrl(r.BaseUrl)
                .wuid(r.Wuid)
                .resultName(r.Name)
                .on("click", (row, col, sel) => {
                    _div.notify(sel ? row && row.__lparam ? row && row.__lparam : row : null);
                })
                ;

            const _div = div(wuResult, props);

            yield _div;

            _div.widget
                .target(_div)
                .lazyRender()
                ;
        }
    };
}
