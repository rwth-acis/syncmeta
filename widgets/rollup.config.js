// Import rollup plugins
import { rollupPluginHTML as html } from "@web/rollup-plugin-html";
import { copy } from "@web/rollup-plugin-copy";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
// import minifyHTML from "rollup-plugin-minify-html-literals";
// import summary from "rollup-plugin-summary";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-import-css";

import { dependencies } from "./package.json";

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve(),
      terser({
        ecma: 2020,
        module: true,
        warnings: true,
      }),
    ],
    input: "src/widgets/partials/activity.widget.ts",
    output: {
      file: "build/widgets/partials/activity.widget.ts",
      sourcemap: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve(),
      terser({
        ecma: 2020,
        module: true,
        warnings: true,
      }),
    ],
    input: "src/widgets/partials/attribute.widget.ts",
    output: {
      file: "build/widgets/partials/attribute.widget.ts",
      sourcemap: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve(),
      terser({
        ecma: 2020,
        module: true,
        warnings: true,
      }),
    ],
    input: "src/widgets/partials/debug.widget.ts",
    output: {
      file: "build/widgets/partials/debug.widget.ts",
      sourcemap: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve(),
      terser({
        ecma: 2020,
        module: true,
        warnings: true,
      }),
    ],
    input: "src/widgets/partials/guidance.widget.ts",
    output: {
      file: "build/widgets/partials/guidance.widget.ts",
      sourcemap: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve(),
      terser({
        ecma: 2020,
        module: true,
        warnings: true,
      }),
    ],
    input: "src/widgets/partials/heatmap.widget.ts",
    output: {
      file: "build/widgets/partials/heatmap.widget.ts",
      sourcemap: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve(),
      terser({
        ecma: 2020,
        module: true,
        warnings: true,
      }),
    ],
    input: "src/widgets/partials/imsld.widget.ts",
    output: {
      file: "build/widgets/partials/imsld.widget.ts",
      sourcemap: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve(),
      terser({
        ecma: 2020,
        module: true,
        warnings: true,
      }),
    ],
    input: "src/widgets/partials/json.widget.ts",
    output: {
      file: "build/widgets/partials/json.widget.ts",
      sourcemap: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve(),
      terser({
        ecma: 2020,
        module: true,
        warnings: true,
      }),
    ],
    input: "src/widgets/partials/main.widget.ts",
    output: {
      file: "build/widgets/partials/main.widget.ts",
      sourcemap: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve(),
      terser({
        ecma: 2020,
        module: true,
        warnings: true,
      }),
    ],
    input: "src/widgets/partials/palette.widget.ts",
    output: {
      file: "build/widgets/partials/palette.widget.ts",
      sourcemap: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve(),
      terser({
        ecma: 2020,
        module: true,
        warnings: true,
      }),
    ],
    input: "src/widgets/partials/test.widget.ts",
    output: {
      file: "build/widgets/partials/test.widget.ts",
      sourcemap: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve(),
      terser({
        ecma: 2020,
        module: true,
        warnings: true,
      }),
    ],
    input: "src/widgets/partials/viewcontrol.widget.ts",
    output: {
      file: "build/widgets/partials/viewcontrol.widget.ts",
      sourcemap: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
];
