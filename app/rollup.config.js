// Import rollup plugins
import { rollupPluginHTML as html } from "@web/rollup-plugin-html";
import { copy } from "@web/rollup-plugin-copy";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import minifyHTML from "rollup-plugin-minify-html-literals";
import summary from "rollup-plugin-summary";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

const pkg = require("./package.json");

export default {
  plugins: [
    // Resolve bare module specifiers to relative paths
    nodeResolve(),
    commonjs(), // makes sure that any commonjs modules are transformed to es6 to be bundled
    typescript(),
    // Entry point for application build; can specify a glob to build multiple
    // HTML files for non-SPA app
    html({
      input: "index.html",
    }),

    // Minify HTML template literals
    minifyHTML.default(),
    // Minify JS
    terser({
      ecma: 2020,
      module: true,
      warnings: true,
    }),
    // Print bundle summary
    summary.default(),
    // Optional: copy any static assets to build directory
    copy({
      patterns: ["images/**/*"],
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
