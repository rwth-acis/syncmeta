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
    toolIcon = `<svg style="max-height:20px;max-width:20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>`,
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
