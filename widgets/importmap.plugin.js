import path from "path";
import { readFileSync } from "fs";

export function ImportmapPlugin() {
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
