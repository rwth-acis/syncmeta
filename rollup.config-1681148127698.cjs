'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pluginNodeResolve = require('@rollup/plugin-node-resolve');
var typescript = require('@rollup/plugin-typescript');
var commonjs = require('@rollup/plugin-commonjs');
var path = require('path');
var fs = require('fs');
var url = require('postcss-url');
var postcss = require('rollup-plugin-postcss');

/**
 * @typedef {import('rollup').Plugin} Plugin
 * Used to replace html template imports with the contents of the file as template string.
 * Make sure to use the loadHTML function in your js files to load the html template.
 * @example
 * import { loadHTML } from "./replace.html.js";
 * const html = await loadHTML("./my-template.html", import.meta.url);
 * // will be replace by the contents of the file my-template.html
 * @returns {Plugin}
 */
function replaceHtml() {
  const re = /await\s+loadHTML\(\s+"([^,]+)",\s+.+\s+\);*/g;

  return {
    // replaces the import with the contents of the file
    transform(code, id) {
      function replacer(match, relativeUrl) {
        const filePath = path.resolve(path.dirname(id), relativeUrl);
        const html = fs.readFileSync(filePath, { encoding: "utf8" });

        return JSON.stringify(html) + "; // replaced by importmap.plugin.js";
      }
      const replaced = code.replace(re, replacer);
      return replaced;
    },
  };
}

// from https://marian-caikovski.medium.com/how-to-import-html-template-file-into-javascript-module-265746167974
// loadHTML function is replaced by the corresponding html string using the rollup plugin widgets\importmap.plugin.js
async function loadHTML(htmlRelativeUrl, baseUrl) {
  const htmlUrl = new URL(htmlRelativeUrl, baseUrl).href;
  const response = await fetch(htmlUrl);
  return await response.text();
}

/**
 * This bundles only the widget container
 */

// dependencies which are not bundled
const externalDependencies = [
  "yjs",
  "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js",
  "https://unpkg.com/jquery@3.6.0/dist/jquery.js",
  "https://cdnjs.cloudflare.com/ajax/libs/graphlib/2.1.8/graphlib.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.9.2/jquery.contextMenu.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jquery-migrate/1.4.1/jquery-migrate.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/dagre/0.8.5/dagre.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js",
  "lit",
  "y-websocket",
  "y-quill",
  "quill",
];

/**
 * @type {import('rollup').RollupOptions}
 */
var rollup_config_dev = [
  // widget container
  {
    plugins: [
      replaceHtml(),
      typescript(),
      postcss({
        plugins: [
          url({
            url: "inline", // enable inline assets using base64 encoding
          }),
        ],
      }),
      pluginNodeResolve.nodeResolve({ browser: true }),
      commonjs({
        include: [/node_modules/],
        extensions: [".js", ".ts"],
      }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required      css(),
    ],
    watch: {
      include: "src/**",
    },
    input: "src/widgets/widget.container.ts",
    output: {
      file: "build/widgets/widget.container.js",
      sourcemap: true,
      inlineDynamicImports: true,
      format: "es",
      globals: {
        yjs: "Y",
        "y-quill": "QuillBinding",
        "y-websocket": "WebsocketProvider",
      },
    },
    external: externalDependencies,
    preserveEntrySignatures: "strict",
  },
];

exports.default = rollup_config_dev;
