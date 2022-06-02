define([
    'jqueryui',
    'jsplumb',
    'canvas_widget/NodeTool',
    'canvas_widget/viewpoint/ViewObjectNode'
],/** @lends ObjectNodeTool */function($,jsPlumb,NodeTool,ViewObjectNode) {

    ViewObjectNodeTool.prototype = new NodeTool();
    ViewObjectNodeTool.prototype.constructor = ViewObjectNodeTool;
    /**
     * ViewObjectNodeTool
     * @class canvas_widget.ViewObjectNodeTool
     * @memberof canvas_widget
     * @constructor
     */
    function ViewObjectNodeTool(){
        NodeTool.call(this,ViewObjectNode.TYPE,null,null,null,ViewObjectNode.DEFAULT_WIDTH,ViewObjectNode.DEFAULT_HEIGHT);
    }

    return ViewObjectNodeTool;

});
