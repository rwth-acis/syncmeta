import AbstractTool from "./AbstractTool";

// NodeTool.prototype = new AbstractTool();
;
/**
 * NodeTool
 * @class palette_widget.NodeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
class NodeTool extends AbstractTool{
  constructor(toolName, toolLabel, toolDescription, toolIcon) {
    super(
            toolName,
      toolLabel,
      toolDescription || "Click on an empty part of the canvas to add a node",
      toolIcon || "class.png", null
    );
  }
}

export default NodeTool;
