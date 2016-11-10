define([
    'jqueryui',
    'jsplumb',
    'canvas_widget/NodeTool',
    'canvas_widget/viewpoint/ViewRelationshipNode'
],/** @lends ViewRelationshipNodeTool */function($,jsPlumb,NodeTool,ViewRelationshipNode) {

    ViewRelationshipNodeTool.prototype = new NodeTool();
    ViewRelationshipNodeTool.prototype.constructor = ViewRelationshipNodeTool;
    /**
     * ViewRelationshipNodeTool
     * @class canvas_widget.ViewRelationshipNodeTool
     * @extends canvas_widget.NodeTool
     * @memberof canvas_widget
     * @constructor
     */
    function ViewRelationshipNodeTool(){
        NodeTool.call(this,ViewRelationshipNode.TYPE,null,null,ViewRelationshipNode.DEFAULT_WIDTH,ViewRelationshipNode.DEFAULT_HEIGHT);
    }

    return ViewRelationshipNodeTool;

});