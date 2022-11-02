import NodeTool from "./NodeTool";
import AbstractClassNode from "./AbstractClassNode";

AbstractClassNodeTool.prototype = new NodeTool();
AbstractClassNodeTool.prototype.constructor = AbstractClassNodeTool;
/**
 * AbstractClassNodeTool
 * @class canvas_widget.ClassNodeTool
 * @extends canvas_widget.NodeTool
 * @memberof canvas_widget
 * @constructor
 */
function AbstractClassNodeTool() {
  NodeTool.call(
    this,
    AbstractClassNode.TYPE,
    null,
    null,
    null,
    AbstractClassNode.DEFAULT_WIDTH,
    AbstractClassNode.DEFAULT_HEIGHT
  );
}

export default AbstractClassNodeTool;
