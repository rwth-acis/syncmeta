import NodeTool from "../NodeTool";
import ViewRelationshipNode from "./ViewRelationshipNode";


/**
 * ViewRelationshipNodeTool
 * @class canvas_widget.ViewRelationshipNodeTool
 * @extends canvas_widget.NodeTool
 * @memberof canvas_widget
 * @constructor
 */
class ViewRelationshipNodeTool extends NodeTool {
  constructor() {
    super(
      ViewRelationshipNode.TYPE,
      null,
      null,
      null,
      ViewRelationshipNode.DEFAULT_WIDTH,
      ViewRelationshipNode.DEFAULT_HEIGHT
    );
  }
}

export default ViewRelationshipNodeTool;
