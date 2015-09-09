define([
    'jqueryui',
    'jsplumb',
    'viewcanvas_widget/NodeTool',
    'viewcanvas_widget/EdgeShapeNode'
],/** @lends EdgeShapeNodeTool */function($,jsPlumb,NodeTool,EdgeShapeNode) {

    EdgeShapeNodeTool.prototype = new NodeTool();
    EdgeShapeNodeTool.prototype.constructor = EdgeShapeNodeTool;
    /**
     * EdgeShapeNodeTool
     * @class canvas_widget.ClassNodeTool
     * @extends canvas_widget.NodeTool
     * @memberof canvas_widget
     * @constructor
     */
    function EdgeShapeNodeTool(){
        NodeTool.call(this,EdgeShapeNode.TYPE,null,null,EdgeShapeNode.DEFAULT_WIDTH,EdgeShapeNode.DEFAULT_HEIGHT);
    }

    return EdgeShapeNodeTool;

});