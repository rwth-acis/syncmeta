import path from "path";
import { readFileSync } from "fs";
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
    // replaces the import with the contents of the file
    transform(code, id) {
      function replacer(match, relativeUrl) {
        const filePath = path.resolve(path.dirname(id), relativeUrl);
        const html = readFileSync(filePath, { encoding: "utf8" });

        return JSON.stringify(html) + "; // replaced by importmap.plugin.js";
      }
      const replaced = code.replace(re, replacer);
      return replaced;
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
