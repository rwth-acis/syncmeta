import AbstractTool from "./AbstractTool";

// MoveTool.prototype = new AbstractTool();
;
/**
 * MoveTool
 * @class palette_widget.MoveTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
class MoveTool extends AbstractTool {
  constructor(toolName = null,
    toolLabel = null,
    toolDescription = null,
    toolIcon = null) {
    super(
      
      toolName || "MoveTool",
      toolLabel || "Move",
      toolDescription ||
      "Move a node by dragging and dropping it. Resize a node by dragging and dropping its bottom right corner. Remove a node or edge by clicking on it with the right mouse button and selecting 'Delete'.",
      toolIcon || "arrow.png",
      "#FFFFFF"
    );
  }
}

export default MoveTool;
