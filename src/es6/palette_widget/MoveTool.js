import AbstractTool from "./AbstractTool";

// MoveTool.prototype = new AbstractTool();
/**
 * MoveTool
 * @class palette_widget.MoveTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
class MoveTool extends AbstractTool {
  constructor(
    toolName = null,
    toolLabel = null,
    toolDescription = null,
    toolIcon = null,
    iconType = null
  ) {
    const icon =
      toolIcon ||
      `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrows-move" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z"/>
</svg>`;
    super(
      toolName || "MoveTool",
      toolLabel || "Move",
      toolDescription ||
        "Move a node by dragging and dropping it. Resize a node by dragging and dropping its bottom right corner. Remove a node or edge by clicking on it with the right mouse button and selecting 'Delete'.",
      icon,
      "#FFFFFF",
      iconType || "svg"
    );
  }
}

export default MoveTool;
