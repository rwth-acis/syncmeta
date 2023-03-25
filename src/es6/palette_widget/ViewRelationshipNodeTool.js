import AbstractTool from "./AbstractTool";

// ViewRelationshipNodeTool.prototype = new AbstractTool();
/**
 * ViewRelationshipNodeTool
 * @class palette_widget.ViewRelationshipNodeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
class ViewRelationshipNodeTool extends AbstractTool {
  constructor(
    toolName = null,
    toolLabel = null,
    toolDescription = null,
    toolIcon = null
  ) {
    super(
      toolName || "ViewRelationship",
      toolLabel || "ViewRelationship",
      toolDescription ||
        "Click on an empty part of the canvas to add a view type",
      toolIcon,
      null
    );
  }
}
export default ViewRelationshipNodeTool;
