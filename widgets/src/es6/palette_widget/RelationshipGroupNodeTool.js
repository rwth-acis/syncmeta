import AbstractTool from "./AbstractTool";

/**
 * RelationshipGroupNodeTool
 * @class palette_widget.RelationshipGroupNodeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
class RelationshipGroupNodeTool extends AbstractTool {
  constructor(
    toolName = null,
    toolLabel = null,
    toolDescription = null,
    toolIcon = null
  ) {
    super(
      toolName || "Relation",
      toolLabel || "Relation",
      toolDescription || "Click on an empty part of the canvas to add a node",
      toolIcon || "class.png",
      null
    );
  }
}

export default RelationshipGroupNodeTool;
