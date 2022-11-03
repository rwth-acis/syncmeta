import AbstractTool from "./AbstractTool";

// ViewObjectNodeTool.prototype = new AbstractTool();
;
/**
 * ViewObjectNodeTool
 * @class palette_widget.ViewObjectNodeTool
 * @memberof palette_widget
 * @extends palette_widget.AbstractTool
 * @constructor
 */
class ViewObjectNodeTool extends AbstractTool{
  constructor(toolName = null,
    toolLabel = null,
    toolDescription = null,
    toolIcon = null) {
      super(
        toolName || "ViewObject",
        toolLabel || "ViewObject",
        toolDescription ||
          "Click on an empty part of the canvas to add a view type",
        toolIcon || "class.png",null
      );
    // AbstractTool.call(
    //   toolName || "ViewObject",
    //   toolLabel || "ViewObject",
    //   toolDescription ||
    //   "Click on an empty part of the canvas to add a view type",
    //   toolIcon || "class.png"
    // );
  }
}

export default ViewObjectNodeTool;
