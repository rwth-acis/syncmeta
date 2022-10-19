// Import rollup plugins
import { rollupPluginHTML as html } from "@web/rollup-plugin-html";
import { copy } from "@web/rollup-plugin-copy";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import minifyHTML from "rollup-plugin-minify-html-literals";
import summary from "rollup-plugin-summary";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

export default {
  plugins: [
    typescript(),
    // Entry point for application build; can specify a glob to build multiple
    // HTML files for non-SPA app
    html({
      input: "index.html",
    }),
    // Resolve bare module specifiers to relative paths
    nodeResolve({ moduleDirectories: ["node_modules"] }),
    commonjs(),
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
    format: "cjs",
  },
  external: [
    "y-websocket",
    "yjs",
    "jquery",
    "@polymer/paper-button/paper-button.js",
    "@polymer/iron-pages/iron-pages.js",
    "las2peer-frontend-statusbar/las2peer-frontend-statusbar.js",
  ],
  preserveEntrySignatures: "strict",
};
