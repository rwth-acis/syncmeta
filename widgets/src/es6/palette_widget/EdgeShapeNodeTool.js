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
    toolIcon = null
  ) {
    super(
      toolName || "Edge Shape",
      toolLabel || "Edge Shape",
      toolDescription || "Click on an empty part of the canvas to add a node",
      toolIcon || "class.png",
      null
    );
  }
}

export default EdgeShapeNodeTool;
