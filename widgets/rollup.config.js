// Import rollup plugins
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { replaceHtml } from "./replace.html.js";
import css from "rollup-plugin-import-css";
import terser from "@rollup/plugin-terser";

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
  "https://cdn.quilljs.com/1.3.6/quill.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js",
  "lit",
  "y-websocket",
  "y-quill",
];

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  // palette.widget
  {
    plugins: [
      replaceHtml(),
      typescript(),
      nodeResolve({ browser: true }),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required      css(),
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
        yjs: "Y",
      },
    },
    external: externalDependencies,
  },
  // activity widget
  {
    plugins: [
      replaceHtml(),
      typescript(),
      nodeResolve({ browser: true }),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required      css(),
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
        yjs: "Y",
      },
    },
    external: externalDependencies,
    preserveEntrySignatures: "strict",
  },
  // attribute.widget
  {
    plugins: [
      css(),
      replaceHtml(),
      typescript(),
      nodeResolve({ browser: true }),
      commonjs({
        extensions: [".js", ".ts"],
        include: [/node_modules/, "./src/attribute.widget.ts"],
      }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required      css(),
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
        yjs: "Y",
      },
    },
    external: externalDependencies,
    preserveEntrySignatures: "strict",
  },
  // debug.widget
  {
    plugins: [
      replaceHtml(),
      typescript(),
      nodeResolve({ browser: true }),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required      css(),
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
        yjs: "Y",
      },
    },
    external: externalDependencies,
    preserveEntrySignatures: "strict",
  },
  // guidance.widget
  {
    plugins: [
      replaceHtml(),
      nodeResolve({ browser: true }),
      typescript(),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required      css(),
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
        yjs: "Y",
      },
    },
    external: externalDependencies,
    preserveEntrySignatures: "strict",
  },
  // heatmap.widget
  {
    plugins: [
      replaceHtml(),
      typescript(),
      nodeResolve({ browser: true }),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required      css(),
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
        yjs: "Y",
      },
    },
    external: externalDependencies,
    preserveEntrySignatures: "strict",
  },
  // imsld.export.widget
  {
    plugins: [
      replaceHtml(),
      typescript(),
      nodeResolve({ browser: true }),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required      css(),
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
        yjs: "Y",
      },
    },
    external: externalDependencies,
    preserveEntrySignatures: "strict",
  },
  // json.export.widget
  {
    plugins: [
      replaceHtml(),
      typescript(),
      nodeResolve({ browser: true }),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required      css(),
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
        yjs: "Y",
      },
    },
    external: externalDependencies,
    preserveEntrySignatures: "strict",
  },
  // main.widget
  {
    plugins: [
      replaceHtml(),
      typescript(),
      css(),
      nodeResolve({ browser: true }),
      commonjs({
        include: [/node_modules/, "./src/main.widget.ts"],
        extensions: [".js", ".ts"],
      }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required      css(),
      // css(),
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
        yjs: "Y",
      },
    },
    external: externalDependencies,
    preserveEntrySignatures: "strict",
  },

  // test.widget
  {
    plugins: [
      replaceHtml(),
      typescript(),
      nodeResolve({ browser: true }),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required      css(),
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
        yjs: "Y",
      },
    },
    external: externalDependencies,
    preserveEntrySignatures: "strict",
  },
  // viewcontrol.widget
  {
    plugins: [
      replaceHtml(),
      typescript(),
      nodeResolve({ browser: true }),
      commonjs({ extensions: [".js", ".ts"] }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required      css(),
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
        yjs: "Y",
      },
    },
    external: externalDependencies,
    preserveEntrySignatures: "strict",
  },
  // widget container
  {
    plugins: [
      replaceHtml(),
      typescript(),
      css(),
      nodeResolve({ browser: true }),
      commonjs({
        include: [/node_modules/],
        extensions: [".js", ".ts"],
      }), // makes sure that any commonjs modules are transformed to es6 to be bundled the ".ts" extension is required      css(),
      // css(),
      // terser(),
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
