// from https://marian-caikovski.medium.com/how-to-import-html-template-file-into-javascript-module-265746167974
export default function (htmlRelativeUrl, baseUrl) {
  const htmlUrl = new URL(htmlRelativeUrl, baseUrl).href;
  return fetch(htmlUrl).then((response) => response.text());
}
