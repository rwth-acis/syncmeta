import AbstractTool from "./AbstractTool";

/**
 * ObjectNodeTool
 * @class palette_widget.ObjectNodeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
class ObjectNodeTool extends AbstractTool {
  constructor(
    toolName = null,
    toolLabel = null,
    toolDescription = null,
    toolIcon = null
  ) {
    super(
      toolName || "Object",
      toolLabel || "Object",
      toolDescription || "Click on an empty part of the canvas to add a node",
      toolIcon || "class.png",
      null
    );
  }
}

export default ObjectNodeTool;
