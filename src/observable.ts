import { ObservableMD } from "@hpcc-js/observable-md";
import { esp } from './plugins/esp';
import { roxie } from "./plugins/roxie"
import { chart } from './plugins/chart';
import { hipie } from './plugins/hipie';
import { editor } from './plugins/editor';
import { table } from './plugins/table';
import { dot } from './plugins/dot';
import { geospatial } from './plugins/geospatial';

export class ObservableWidget extends ObservableMD {
    constructor() {
        super();
        this.plugins({
            esp,
            roxie,
            hipie,
            chart,
            editor,
            table,
            dot,
            geospatial
        });
    }
}

