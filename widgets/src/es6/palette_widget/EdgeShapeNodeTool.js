import AbstractTool from "./AbstractTool";

// EdgeShapeNodeTool.prototype = new AbstractTool();
/**
 * EdgeShapeNodeTool
 * @class palette_widget.EdgeShapeNodeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
class EdgeShapeNodeTool extends AbstractTool {
  constructor(
    toolName = null,
    toolLabel = null,
    toolDescription = null,
    toolIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-app" viewBox="0 0 16 16"><path d="M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h6zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4H5z"/></svg>`,
    type = "svg"
  ) {
    super(
      toolName || "Edge Shape",
      toolLabel || "Edge Shape",
      toolDescription || "Click on an empty part of the canvas to add a node",
      toolIcon,
      null,
      type
    );
  }
}

export default EdgeShapeNodeTool;
