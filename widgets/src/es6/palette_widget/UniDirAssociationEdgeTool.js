import AbstractTool from "./AbstractTool";

// UniDirAssociationEdgeTool.prototype = new AbstractTool();
/**
 * UniDirAssociationEdgeTool
 * @class palette_widget.palette_widget.UniDirAssociationEdgeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
class UniDirAssociationEdgeTool extends AbstractTool {
  constructor(
    toolName = null,
    toolLabel = null,
    toolDescription = null,
    toolIcon = null
  ) {
    super(
      toolName || "Uni-Dir-Association",
      toolLabel || "Uni-Dir-Assoc",
      toolDescription ||
        "Click and hold on one Node and release on another node to add an edge between these two nodes.",
      toolIcon || "unidirassociation.png",
      null
    );
  }
}

export default UniDirAssociationEdgeTool;
