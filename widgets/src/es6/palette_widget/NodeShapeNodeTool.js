import AbstractTool from "./AbstractTool";

// NodeShapeNodeTool.prototype = new AbstractTool();
;
/**
 * NodeShapeNodeTool
 * @class palette_widget.NodeShapeNodeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
class NodeShapeNodeTool extends AbstractTool {
  constructor(
    toolName = null,
    toolLabel = null,
    toolDescription = null,
    toolIcon = null,
    type = "svg"
  ) {
    super(
      toolName || "Node Shape",
      toolLabel || "Node Shape",
      toolDescription || "Click on an empty part of the canvas to add a node",
      toolIcon,
      null,
      type
    );
  }
}

export default NodeShapeNodeTool;
