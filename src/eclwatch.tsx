import * as React from "react";
import { createRoot } from "react-dom/client";
import { Frame } from "./eclwatch/Frame";

import "./eclwatch.css";

const placeholder = document.getElementById("placeholder");

if (placeholder) {
    const root = createRoot(placeholder);
    root.render(
        <React.StrictMode>
            <Frame />
        </React.StrictMode>
    );
} else {
    console.warn("ECL Watch: 'placeholder' element not found - UI not mounted.");
}
