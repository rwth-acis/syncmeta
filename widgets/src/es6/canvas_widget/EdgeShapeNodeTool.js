import { EdgeShapeNode } from "./Manager";
import NodeTool from "./NodeTool";

EdgeShapeNodeTool.prototype = new NodeTool();
EdgeShapeNodeTool.prototype.constructor = EdgeShapeNodeTool;
/**
 * EdgeShapeNodeTool
 * @class canvas_widget.ClassNodeTool
 * @extends canvas_widget.NodeTool
 * @memberof canvas_widget
 * @constructor
 */
function EdgeShapeNodeTool() {
  NodeTool.call(
    this,
    EdgeShapeNode.TYPE,
    null,
    null,
    null,
    EdgeShapeNode.DEFAULT_WIDTH,
    EdgeShapeNode.DEFAULT_HEIGHT
  );
}

export default EdgeShapeNodeTool;
