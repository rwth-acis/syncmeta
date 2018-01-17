define([
    'jqueryui',
    'jsplumb',
    'canvas_widget/NodeTool',
    'canvas_widget/RelationshipGroupNode'
],/** @lends RelationshipGroupNodeTool */function($,jsPlumb,NodeTool,RelationshipGroupNode) {

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
        NodeTool.call(this,RelationshipGroupNode.TYPE,null,null,RelationshipGroupNode.DEFAULT_WIDTH,RelationshipGroupNode.DEFAULT_HEIGHT);
    }

    return RelationshipGroupNodeTool;

});