import $ from 'jqueryui';
import jsPlumb from 'jsplumb';
import NodeTool from 'canvas_widget/NodeTool';
import RelationshipGroupNode from 'canvas_widget/RelationshipGroupNode';

    RelationshipGroupNodeTool.prototype = new NodeTool();
    RelationshipGroupNodeTool.prototype.constructor = RelationshipGroupNodeTool;
    /**
     * RelationshipGroupNodeTool
     * @class canvas_widget.ClassNodeTool
     * @extends canvas_widget.NodeTool
     * @memberof canvas_widget
     * @constructor
     */
    function RelationshipGroupNodeTool(){
        NodeTool.call(this,RelationshipGroupNode.TYPE,null,null,null,RelationshipGroupNode.DEFAULT_WIDTH,RelationshipGroupNode.DEFAULT_HEIGHT);
    }

    export default RelationshipGroupNodeTool;


