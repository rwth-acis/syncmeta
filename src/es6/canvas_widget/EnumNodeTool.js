import { EnumNode } from "./Manager";
import NodeTool from "./NodeTool";

/**
 * EnumNodeTool
 * @class canvas_widget.ClassNodeTool
 * @extends canvas_widget.NodeTool
 * @memberof canvas_widget
 * @constructor
 */
class EnumNodeTool extends NodeTool {
  constructor() {
    super(
      EnumNode.TYPE,
      null,
      null,
      null,
      EnumNode.DEFAULT_WIDTH,
      EnumNode.DEFAULT_HEIGHT
    );
  }
}

export default EnumNodeTool;
