// Import rollup plugins
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-import-css";

import { dependencies } from "./package.json";

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  // activity widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve({ browser: true }),
    ],
    input: "src/widgets/partials/activity.widget.ts",
    output: {
      file: "build/widgets/partials/activity.widget.ts",
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
  // attribute.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve({ browser: true }),
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
  // debug.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve({ browser: true }),
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
  // guidance.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve({ browser: true }),
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
  // heatmap.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve({ browser: true }),
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
  // imsld.export.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve({ browser: true }),
    ],
    input: "src/widgets/partials/imsld.export.widget.ts",
    output: {
      file: "build/widgets/partials/imsld.export.widget.ts",
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
  // json.export.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve({ browser: true }),
    ],
    input: "src/widgets/partials/json.export.widget.ts",
    output: {
      file: "build/widgets/partials/json.export.widget.ts",
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
  // main.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve({ browser: true }),
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
  // palette.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve({ browser: true }),
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
  // test.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve({ browser: true }),
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
  // viewcontrol.widget
  {
    plugins: [
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required
      css(),
      resolve({ browser: true }),
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
