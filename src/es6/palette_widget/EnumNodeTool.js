import AbstractTool from "./AbstractTool";

// EnumNodeTool.prototype = new AbstractTool();
/**
 * EnumNodeTool
 * @class palette_widget.EnumNodeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
class EnumNodeTool extends AbstractTool {
  constructor(
    toolName = null,
    toolLabel = null,
    toolDescription = null,
    toolIcon = null,
    type = "svg"
  ) {
    super(
      toolName || "Enumeration",
      toolLabel || "Enum",
      toolDescription || "Click on an empty part of the canvas to add a node",
      toolIcon,
      null,
      type
    );
  }
}

export default EnumNodeTool;
