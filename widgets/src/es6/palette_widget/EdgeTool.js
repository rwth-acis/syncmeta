import AbstractTool from "./AbstractTool";

EdgeTool.prototype = new AbstractTool();
EdgeTool.prototype.constructor = EdgeTool;
/**
 * EdgeTool
 * @class palette_widget.EdgeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
function EdgeTool(toolName, toolLabel, toolDescription, toolIcon, toolColor) {
  AbstractTool.call(
    this,
    toolName,
    toolLabel,
    toolDescription ||
      "Click and hold on one Node and release on another node to add an edge between these two nodes.",
    toolIcon || "path.png",
    toolColor || "#000000"
  );
}

export default EdgeTool;
