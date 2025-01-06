import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], // File patterns to lint
    languageOptions: {
      globals: globals.browser, // Enable browser globals
      parserOptions: {
        ecmaVersion: "latest", // Support modern JavaScript
        sourceType: "module", // Enable ES modules
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // ESLint recommended rules
      ...tseslint.configs.recommended.rules, // TypeScript rules
      ...pluginReact.configs.flat.recommended.rules, // React rules
    },
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
  },
];
