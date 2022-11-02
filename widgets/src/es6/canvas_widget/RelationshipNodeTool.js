import $ from "jquery-ui";
import jsPlumb from "jsplumb";
import NodeTool from "canvas_widget/NodeTool";
import RelationshipNode from "canvas_widget/RelationshipNode";

RelationshipNodeTool.prototype = new NodeTool();
RelationshipNodeTool.prototype.constructor = RelationshipNodeTool;
/**
 * RelationshipNodeTool
 * @class canvas_widget.RelationshipNodeTool
 * @extends canvas_widget.NodeTool
 * @memberof canvas_widget
 * @constructor
 */
function RelationshipNodeTool() {
  NodeTool.call(
    this,
    RelationshipNode.TYPE,
    null,
    null,
    null,
    RelationshipNode.DEFAULT_WIDTH,
    RelationshipNode.DEFAULT_HEIGHT
  );
}

export default RelationshipNodeTool;
