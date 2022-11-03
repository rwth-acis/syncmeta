import AbstractTool from "./AbstractTool";

// RelationshipNodeTool.prototype = new AbstractTool();

/**
 * RelationshipNodeTool
 * @class palette_widget.RelationshipNodeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
class RelationshipNodeTool extends AbstractTool {
  constructor(
    toolName = null,
    toolLabel = null,
    toolDescription = null,
    toolIcon = null
  ) {
    super(
      toolName || "Relationship",
      toolLabel || "Relationship",
      toolDescription || "Click on an empty part of the canvas to add a node",
      toolIcon || "class.png",
      null
    );
  }
}

export default RelationshipNodeTool;
