import { NodeShapeNode } from "./Manager";
import NodeTool from "./NodeTool";

NodeShapeNodeTool.prototype = new NodeTool();
NodeShapeNodeTool.prototype.constructor = NodeShapeNodeTool;
/**
 * NodeShapeNodeTool
 * @class canvas_widget.ClassNodeTool
 * @extends canvas_widget.NodeTool
 * @memberof canvas_widget
 * @constructor
 */
function NodeShapeNodeTool() {
  NodeTool.call(
    this,
    NodeShapeNode.TYPE,
    null,
    null,
    null,
    NodeShapeNode.DEFAULT_WIDTH,
    NodeShapeNode.DEFAULT_HEIGHT
  );
}

export default NodeShapeNodeTool;
