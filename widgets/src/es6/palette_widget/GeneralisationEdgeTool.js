import AbstractTool from "./AbstractTool";

GeneralisationEdgeTool.prototype = new AbstractTool();
;
/**
 * GeneralisationEdgeTool
 * @class palette_widget.GeneralisationEdgeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
class GeneralisationEdgeTool {
  constructor(toolName=null, toolLabel=null, toolDescription=null, toolIcon=null) {
    AbstractTool.call(
      this,
      toolName || "Generalisation",
      toolLabel || "Generalisation",
      toolDescription ||
      "Click and hold on one Node and release on another node to add an edge between these two nodes.",
      toolIcon || "generalisation.png"
    );
  }
}

export default GeneralisationEdgeTool;
