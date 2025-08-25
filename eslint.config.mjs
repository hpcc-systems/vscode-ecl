import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default [
    // Ignore generated parser / grammar artifacts
    { ignores: ["src/grammar/**/*"] },
    // Base JS recommended
    js.configs.recommended,
    // TypeScript support (parser + recommended rules)
    ...tseslint.configs.recommended,
    // React hooks (only hooks; project uses React 17 APIs)
    {
        plugins: { "react-hooks": reactHooks },
        rules: {
            ...reactHooks.configs.recommended.rules
        }
    },
    // Project specific overrides
    {
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module"
            },
            globals: {
                dojo: "readonly",
                dijit: "readonly",
                dojoConfig: "readonly",
                debugConfig: "readonly",
                Promise: "readonly"
            }
        },
        // per-file overrides (no additional ignores here)
        rules: {
            // Disabled legacy rules carried over from .eslintrc.js
            "no-redeclare": "off",
            "no-empty": "off",
            "no-empty-pattern": "off",
            "no-constant-condition": "off",
            "no-case-declarations": "off",
            "no-prototype-builtins": "off",
            "no-unused-vars": "off",
            "no-useless-escape": "off",
            "no-unexpected-multiline": "off",
            "no-extra-boolean-cast": "off",
            "no-self-assign": "off",
            "no-multiple-empty-lines": ["error", { max: 1 }],
            "func-call-spacing": ["error", "never"],
            "space-before-function-paren": ["error", { anonymous: "always", named: "never", asyncArrow: "always" }],
            "comma-spacing": ["error", { before: false, after: true }],
            "prefer-rest-params": "off",
            "prefer-spread": "off",
            "semi": ["error", "always"],
            "quotes": ["error", "double", { avoidEscape: true }],
            // TypeScript specific disables
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-inferrable-types": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-interface": "off",
            "@typescript-eslint/no-this-alias": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/no-var-require": "off",
            "@typescript-eslint/no-unsafe-declaration-merging": "off"
        }
    }
];
