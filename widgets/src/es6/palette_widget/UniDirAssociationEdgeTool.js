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
    toolIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>`,
    type = "svg"
  ) {
    super(
      toolName || "Uni-Dir-Association",
      toolLabel || "Uni-Dir-Assoc",
      toolDescription ||
        "Click and hold on one Node and release on another node to add an edge between these two nodes.",
      toolIcon,
      null,
      type
    );
  }
}

export default UniDirAssociationEdgeTool;
