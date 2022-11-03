import AbstractTool from "./AbstractTool";

NodeShapeNodeTool.prototype = new AbstractTool();
NodeShapeNodeTool.prototype.constructor = NodeShapeNodeTool;
/**
 * NodeShapeNodeTool
 * @class palette_widget.NodeShapeNodeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
function NodeShapeNodeTool(
  toolName = null,
  toolLabel = null,
  toolDescription = null,
  toolIcon = null
) {
  AbstractTool.call(
    this,
    toolName || "Node Shape",
    toolLabel || "Node Shape",
    toolDescription || "Click on an empty part of the canvas to add a node",
    toolIcon || "class.png"
  );
}

export default NodeShapeNodeTool;
