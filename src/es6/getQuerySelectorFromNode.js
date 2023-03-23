export function getQuerySelectorFromNode(node) {
  if (node instanceof jQuery) {
    node = node.get(0);
  }
  if (node.id) {
    return `[id="${node.id}"]`;
    // return `#${node.id}`; // This is not working since the implementation of querySelectorAll disallows getting elements by id with a hash if the id starts with a number
  }
  if (node.className) {
    return `.${node.className}`;
  }
  return null;
}
