import { ViewObjectNode } from "../Manager";
import NodeTool from "../NodeTool";

ViewObjectNodeTool.prototype = new NodeTool();
ViewObjectNodeTool.prototype.constructor = ViewObjectNodeTool;
/**
 * ViewObjectNodeTool
 * @class canvas_widget.ViewObjectNodeTool
 * @memberof canvas_widget
 * @constructor
 */
function ViewObjectNodeTool() {
  NodeTool.call(
    this,
    ViewObjectNode.TYPE,
    null,
    null,
    null,
    ViewObjectNode.DEFAULT_WIDTH,
    ViewObjectNode.DEFAULT_HEIGHT
  );
}

export default ViewObjectNodeTool;
