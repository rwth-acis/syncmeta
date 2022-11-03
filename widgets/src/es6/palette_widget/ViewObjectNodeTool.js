import AbstractTool from "./AbstractTool";

ViewObjectNodeTool.prototype = new AbstractTool();
ViewObjectNodeTool.prototype.constructor = ViewObjectNodeTool;
/**
 * ViewObjectNodeTool
 * @class palette_widget.ViewObjectNodeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
function ViewObjectNodeTool(
  toolName = null,
  toolLabel = null,
  toolDescription = null,
  toolIcon = null
) {
  AbstractTool.call(
    this,
    toolName || "ViewObject",
    toolLabel || "ViewObject",
    toolDescription ||
      "Click on an empty part of the canvas to add a view type",
    toolIcon || "class.png"
  );
}

export default ViewObjectNodeTool;
