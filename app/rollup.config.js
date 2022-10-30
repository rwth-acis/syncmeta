// Import rollup plugins
import { rollupPluginHTML as html } from "@web/rollup-plugin-html";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-import-css";

const pkg = require("./package.json");

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  plugins: [
    // Resolve bare module specifiers to relative paths
    resolve({ browser: true, mainFields: ["module", "browser"] }),
    commonjs({
      include: ["node_modules/**"],
      transformMixedEsModules: true,
      extensions: [".js", ".ts"],
    }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
    typescript(),
    css(),
    // Entry point for application build; can specify a glob to build multiple
    // HTML files for non-SPA app
    html({
      input: "index.html",
    }),
  ],
  output: {
    dir: "build",
    sourcemap: true,
    format: "iife",
    globals: {
      jquery: "$",
      lit: "lit",
      yjs: "Y",
      "y-websocket": "WebsocketProvider",
    },
  },
  external: Object.keys(pkg.dependencies),
  preserveEntrySignatures: "strict",
};
