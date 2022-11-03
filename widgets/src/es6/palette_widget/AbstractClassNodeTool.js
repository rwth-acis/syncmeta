import AbstractTool from "./AbstractTool";

/**
 * AbstractClassNodeTool
 * @class palette_widget.AbstractClassNodeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
class AbstractClassNodeTool extends AbstractTool {
  constructor(
    toolName = null,
    toolLabel = null,
    toolDescription = null,
    toolIcon = null
  ) {
    super(
      toolName || "Abstract Class",
      toolLabel || "Abstract Class",
      toolDescription || "Click on an empty part of the canvas to add a node",
      toolIcon || "class.png",
      null
    );
  }
}

export default AbstractClassNodeTool;
