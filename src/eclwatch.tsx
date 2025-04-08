import * as React from "react";
import * as ReactDOM from "react-dom";
import { Frame } from "./eclwatch/Frame";

import "./eclwatch.css";

const placeholder = document.getElementById("placeholder");

ReactDOM.render(
    <React.StrictMode>
        <Frame />
    </React.StrictMode>,
    placeholder
);
