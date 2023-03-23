// from https://marian-caikovski.medium.com/how-to-import-html-template-file-into-javascript-module-265746167974
// loadHTML function is replaced by the corresponding html string using the rollup plugin widgets\importmap.plugin.js
export default function (htmlRelativeUrl, baseUrl) {
  const htmlUrl = new URL(htmlRelativeUrl, baseUrl).href;
  return fetch(htmlUrl).then((response) => response.text());
}
