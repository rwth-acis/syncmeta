import { ObjectNode } from "./Manager";
import NodeTool from "./NodeTool";

ObjectNodeTool.prototype = new NodeTool();
ObjectNodeTool.prototype.constructor = ObjectNodeTool;
/**
 * ObjectNodeTool
 * @class canvas_widget.ObjectNodeTool
 * @memberof canvas_widget
 * @constructor
 */
function ObjectNodeTool() {
  NodeTool.call(
    this,
    ObjectNode.TYPE,
    null,
    null,
    null,
    ObjectNode.DEFAULT_WIDTH,
    ObjectNode.DEFAULT_HEIGHT
  );
}

export default ObjectNodeTool;
