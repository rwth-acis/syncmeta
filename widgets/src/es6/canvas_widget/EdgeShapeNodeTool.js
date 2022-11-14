import { EdgeShapeNode } from "./Manager";
import NodeTool from "./NodeTool";


/**
 * EdgeShapeNodeTool
 * @class canvas_widget.ClassNodeTool
 * @extends canvas_widget.NodeTool
 * @memberof canvas_widget
 * @constructor
 */
class EdgeShapeNodeTool extends NodeTool {
  constructor() {
    super(
      EdgeShapeNode.TYPE,
      null,
      null,
      null,
      EdgeShapeNode.DEFAULT_WIDTH,
      EdgeShapeNode.DEFAULT_HEIGHT
    );
  }
}

export default EdgeShapeNodeTool;
