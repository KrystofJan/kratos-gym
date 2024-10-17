import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
    {
        files: ["./src/*.{js,mjs,cjs,ts}"],
    },
    {
        languageOptions: { globals: globals.node },

    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "no-console": "error",
            "@typescript-eslint/no-explicit-any": "warn"
        }
    }
];

