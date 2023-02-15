import { RelationshipNode } from "./Manager";
import NodeTool from "./NodeTool";


/**
 * RelationshipNodeTool
 * @class canvas_widget.RelationshipNodeTool
 * @extends canvas_widget.NodeTool
 * @memberof canvas_widget
 * @constructor
 */
class RelationshipNodeTool extends NodeTool {
  constructor() {
    super(
      RelationshipNode.TYPE,
      null,
      null,
      null,
      RelationshipNode.DEFAULT_WIDTH,
      RelationshipNode.DEFAULT_HEIGHT
    );
  }
}

export default RelationshipNodeTool;
