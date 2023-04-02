/**
 * This bundles only the minified widget container
 */
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { replaceHtml } from "./replace.html.js";
import css from "rollup-plugin-import-css";
import terser from "@rollup/plugin-terser";
import url from "postcss-url";
import postcss from "rollup-plugin-postcss";

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
export default [
  // widget container
  {
    plugins: [
      replaceHtml(),
      typescript(),
      css(),
      postcss({
        plugins: [
          url({
            url: "inline", // enable inline assets using base64 encoding
          }),
        ],
      }),
      nodeResolve({ browser: true }),
      commonjs({
        include: [/node_modules/],
        extensions: [".js", ".ts"],
      }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required      css(),
      // css(),
      terser(),
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
