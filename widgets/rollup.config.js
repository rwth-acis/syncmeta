// Import rollup plugins
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-import-css";

import { dependencies } from "./package.json";
import json from "@rollup/plugin-json";
import html from "rollup-plugin-html";

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  // palette.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      json(),
      html({
        include: "**/*.html",
      }),
      resolve({ browser: true }),
    ],
    watch: {
      include: "src/**",
    },
    input: "src/widgets/partials/palette.widget.ts",
    output: {
      file: "build/widgets/partials/palette.widget.js",
      sourcemap: true,
      inlineDynamicImports: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
        jsPlumb: "jsPlumb",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  // activity widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      json(),
      html({
        include: "**/*.html",
      }),
      resolve({ browser: true }),
    ],
    watch: {
      include: "src/**",
    },
    input: "src/widgets/partials/activity.widget.ts",
    output: {
      file: "build/widgets/partials/activity.widget.js",
      sourcemap: true,
      inlineDynamicImports: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
        jsPlumb: "jsPlumb",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  // attribute.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      json(),
      html({
        include: "**/*.html",
      }),
      resolve({ browser: true }),
    ],
    watch: {
      include: "src/**",
    },
    input: "src/widgets/partials/attribute.widget.ts",
    output: {
      file: "build/widgets/partials/attribute.widget.js",
      sourcemap: true,
      inlineDynamicImports: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
        jsPlumb: "jsPlumb",
        ace: "ace",
        "jquery-ui": "jquery-ui",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  // debug.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      json(),
      html({
        include: "**/*.html",
      }),
      resolve({ browser: true }),
    ],
    watch: {
      include: "src/**",
    },
    input: "src/widgets/partials/debug.widget.ts",
    output: {
      file: "build/widgets/partials/debug.widget.js",
      sourcemap: true,
      inlineDynamicImports: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
        jsPlumb: "jsPlumb",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  // guidance.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      json(),
      html({
        include: "**/*.html",
      }),
      resolve({ browser: true }),
    ],
    watch: {
      include: "src/**",
    },
    input: "src/widgets/partials/guidance.widget.ts",
    output: {
      file: "build/widgets/partials/guidance.widget.js",
      sourcemap: true,
      inlineDynamicImports: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
        classjs: "classjs",
        graphlib: "graphlib",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  // heatmap.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      json(),
      html({
        include: "**/*.html",
      }),
      resolve({ browser: true }),
    ],
    watch: {
      include: "src/**",
    },
    input: "src/widgets/partials/heatmap.widget.ts",
    output: {
      file: "build/widgets/partials/heatmap.widget.js",
      sourcemap: true,
      inlineDynamicImports: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
        "lodash-es": "lodash-es",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  // imsld.export.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      json(),
      html({
        include: "**/*.html",
      }),
      resolve({ browser: true }),
    ],
    watch: {
      include: "src/**",
    },
    input: "src/widgets/partials/imsld.export.widget.ts",
    output: {
      file: "build/widgets/partials/imsld.export.widget.js",
      sourcemap: true,
      inlineDynamicImports: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
        ildeApi: "ildeApi",
        mfexport: "mfexport",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  // json.export.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      json(),
      html({
        include: "**/*.html",
      }),
      resolve({ browser: true }),
    ],
    watch: {
      include: "src/**",
    },
    input: "src/widgets/partials/json.export.widget.ts",
    output: {
      file: "build/widgets/partials/json.export.widget.js",
      sourcemap: true,
      inlineDynamicImports: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "WebsocketProvider",
        mfexport: "mfexport",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },
  // main.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      json(),
      html({
        include: "**/*.html",
      }),
      resolve({ browser: true }),
    ],
    watch: {
      include: "src/**",
    },
    input: "src/widgets/partials/main.widget.ts",
    output: {
      file: "build/widgets/partials/main.widget.js",
      sourcemap: true,
      inlineDynamicImports: true,
      format: "es",
      globals: {
        jquery: "$",
        lit: "lit",
        yjs: "Y",
        "y-websocket": "y-websocket",
        jsPlumb: "jsPlumb",
        "jquery-ui": "jquery-ui",
      },
    },
    external: Object.keys(dependencies),
    preserveEntrySignatures: "strict",
  },

  // test.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      json(),
      html({
        include: "**/*.html",
      }),
      resolve({ browser: true }),
    ],
    watch: {
      include: "src/**",
    },
    input: "src/widgets/partials/test.widget.ts",
    output: {
      file: "build/widgets/partials/test.widget.js",
      sourcemap: true,
      inlineDynamicImports: true,
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
  // viewcontrol.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      json(),
      html({
        include: "**/*.html",
      }),
      resolve({ browser: true }),
    ],
    watch: {
      include: "src/**",
    },
    input: "src/widgets/partials/viewcontrol.widget.ts",
    output: {
      file: "build/widgets/partials/viewcontrol.widget.js",
      sourcemap: true,
      inlineDynamicImports: true,
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
