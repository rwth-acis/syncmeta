import $ from "jquery-ui";
import jsPlumb from "jsplumb";
import NodeTool from "canvas_widget/NodeTool";
import ViewRelationshipNode from "canvas_widget/viewpoint/ViewRelationshipNode";

ViewRelationshipNodeTool.prototype = new NodeTool();
ViewRelationshipNodeTool.prototype.constructor = ViewRelationshipNodeTool;
/**
 * ViewRelationshipNodeTool
 * @class canvas_widget.ViewRelationshipNodeTool
 * @extends canvas_widget.NodeTool
 * @memberof canvas_widget
 * @constructor
 */
function ViewRelationshipNodeTool() {
  NodeTool.call(
    this,
    ViewRelationshipNode.TYPE,
    null,
    null,
    null,
    ViewRelationshipNode.DEFAULT_WIDTH,
    ViewRelationshipNode.DEFAULT_HEIGHT
  );
}

export default ViewRelationshipNodeTool;
