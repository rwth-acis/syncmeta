import AbstractTool from "./AbstractTool";

// BiDirAssociationEdgeTool.prototype = new AbstractTool();
/**
 * BiDirAssociationEdgeTool
 * @class palette_widget.palette_widget.BiDirAssociationEdgeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
class BiDirAssociationEdgeTool extends AbstractTool {
  constructor(
    toolName = null,
    toolLabel = null,
    toolDescription = null,
    toolIcon = `<svg style="max-height:20px;max-width:20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M406.6 374.6l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224l-293.5 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288l293.5 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"/></svg>`,
    type = "svg"
  ) {
    super(
      toolName || "Bi-Dir-Association",
      toolLabel || "Bi-Dir-Assoc",
      toolDescription ||
        "Click and hold on one Node and release on another node to add an edge between these two nodes.",
      toolIcon,
      null,
      type
    );
  }
}

export default BiDirAssociationEdgeTool;
