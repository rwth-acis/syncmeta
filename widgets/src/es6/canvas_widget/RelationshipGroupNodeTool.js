import NodeTool from "./NodeTool";
import RelationshipGroupNode from "./RelationshipGroupNode";

RelationshipGroupNodeTool.prototype = new NodeTool();
/**
 * RelationshipGroupNodeTool
 * @class canvas_widget.ClassNodeTool
 * @extends canvas_widget.NodeTool
 * @memberof canvas_widget
 * @constructor
 */
class RelationshipGroupNodeTool {
  constructor() {
    NodeTool.call(
      this,
      RelationshipGroupNode.TYPE,
      null,
      null,
      null,
      RelationshipGroupNode.DEFAULT_WIDTH,
      RelationshipGroupNode.DEFAULT_HEIGHT
    );
  }
}

export default RelationshipGroupNodeTool;
