import { NodeShapeNode } from "./Manager";
import NodeTool from "./NodeTool";

/**
 * NodeShapeNodeTool
 * @class canvas_widget.ClassNodeTool
 * @extends canvas_widget.NodeTool
 * @memberof canvas_widget
 * @constructor
 */
class NodeShapeNodeTool extends NodeTool {
  constructor() {
    super(
      NodeShapeNode.TYPE,
      null,
      null,
      null,
      NodeShapeNode.DEFAULT_WIDTH,
      NodeShapeNode.DEFAULT_HEIGHT
    );
  }
}

export default NodeShapeNodeTool;
