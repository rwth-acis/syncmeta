import { AbstractClassNode } from "./Manager";
import NodeTool from "./NodeTool";

/**
 * AbstractClassNodeTool
 * @class canvas_widget.ClassNodeTool
 * @extends canvas_widget.NodeTool
 * @memberof canvas_widget
 * @constructor
 */
class AbstractClassNodeTool extends NodeTool{
  constructor() {
    super(
      AbstractClassNode.TYPE,
      null,
      null,
      null,
      AbstractClassNode.DEFAULT_WIDTH,
      AbstractClassNode.DEFAULT_HEIGHT
    );
  }
}

export default AbstractClassNodeTool;
