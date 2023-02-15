import { RelationshipGroupNode } from "./Manager";
import NodeTool from "./NodeTool";

/**
 * RelationshipGroupNodeTool
 * @class canvas_widget.ClassNodeTool
 * @extends canvas_widget.NodeTool
 * @memberof canvas_widget
 * @constructor
 */
class RelationshipGroupNodeTool extends NodeTool {
  constructor() {
    super(
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
