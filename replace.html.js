import path from "path";
import { readFileSync } from "fs";
import MagicString from "magic-string";
import { install } from "source-map-support";
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
export function replaceHtml() {
  const re = /await\s+loadHTML\(\s+"([^,]+)",\s+.+\s+\);*/g;

  return {
    name: "replace-html-import",
    // replaces the import with the contents of the file
    transform(code, id) {
      function replacer(match, relativeUrl) {
        const filePath = path.resolve(path.dirname(id), relativeUrl);
        const html = readFileSync(filePath, { encoding: "utf8" });

        return JSON.stringify(html) + "; // replaced by importmap.plugin.js";
      }
      // Create a new MagicString object to manipulate the code
      const magicString = new MagicString(code);
      let match;
      while ((match = re.exec(code)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        magicString.overwrite(start, end, replacer(match[0], match[1]));
      }

      // Generate a new source map
      const map = magicString.generateMap({
        source: id,
        includeContent: true,
      });
      // Add the source map to the code using source-map-support
      install();

      // Return the modified code and source map
      const annotatedCode = magicString.toString();

      return { code: annotatedCode, map };
    },
  };
}

// from https://marian-caikovski.medium.com/how-to-import-html-template-file-into-javascript-module-265746167974
// loadHTML function is replaced by the corresponding html string using the rollup plugin widgets\importmap.plugin.js
export async function loadHTML(htmlRelativeUrl, baseUrl) {
  const htmlUrl = new URL(htmlRelativeUrl, baseUrl).href;
  const response = await fetch(htmlUrl);
  return await response.text();
}
