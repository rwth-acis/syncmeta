import AbstractTool from "./AbstractTool";

RelationshipGroupNodeTool.prototype = new AbstractTool();
RelationshipGroupNodeTool.prototype.constructor = RelationshipGroupNodeTool;
/**
 * RelationshipGroupNodeTool
 * @class palette_widget.RelationshipGroupNodeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
function RelationshipGroupNodeTool(
  toolName,
  toolLabel,
  toolDescription,
  toolIcon
) {
  AbstractTool.call(
    this,
    toolName || "Relation",
    toolLabel || "Relation",
    toolDescription || "Click on an empty part of the canvas to add a node",
    toolIcon || "class.png"
  );
}

export default RelationshipGroupNodeTool;
