import AbstractTool from "./AbstractTool";

AbstractClassNodeTool.prototype = new AbstractTool();
AbstractClassNodeTool.prototype.constructor = AbstractClassNodeTool;
/**
 * AbstractClassNodeTool
 * @class palette_widget.AbstractClassNodeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
function AbstractClassNodeTool(toolName, toolLabel, toolDescription, toolIcon) {
  AbstractTool.call(
    this,
    toolName || "Abstract Class",
    toolLabel || "Abstract Class",
    toolDescription || "Click on an empty part of the canvas to add a node",
    toolIcon || "class.png"
  );
}

export default AbstractClassNodeTool;
