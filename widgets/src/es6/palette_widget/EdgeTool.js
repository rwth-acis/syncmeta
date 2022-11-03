import AbstractTool from "./AbstractTool";


/**
 * EdgeTool
 * @class palette_widget.EdgeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
class EdgeTool extends AbstractTool {
  constructor(toolName, toolLabel, toolDescription, toolIcon, toolColor) {
    super(
      toolName,
      toolLabel,
      toolDescription ||
        "Click and hold on one Node and release on another node to add an edge between these two nodes.",
      toolIcon || "path.png",
      toolColor || "#000000"
    );
  }
}

export default EdgeTool;
