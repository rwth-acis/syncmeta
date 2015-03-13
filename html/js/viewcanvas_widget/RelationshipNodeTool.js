define([
    'jqueryui',
    'jsplumb',
    'viewcanvas_widget/NodeTool',
    'viewcanvas_widget/RelationshipNode'
],/** @lends RelationshipNodeTool */function($,jsPlumb,NodeTool,RelationshipNode) {

    RelationshipNodeTool.prototype = new NodeTool();
    RelationshipNodeTool.prototype.constructor = RelationshipNodeTool;
    /**
     * RelationshipNodeTool
     * @class canvas_widget.RelationshipNodeTool
     * @extends canvas_widget.NodeTool
     * @memberof canvas_widget
     * @constructor
     */
    function RelationshipNodeTool(){
        NodeTool.call(this,RelationshipNode.TYPE,null,null,RelationshipNode.DEFAULT_WIDTH,RelationshipNode.DEFAULT_HEIGHT);
    }

    return RelationshipNodeTool;

});