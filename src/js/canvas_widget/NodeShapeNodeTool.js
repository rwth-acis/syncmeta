define([
    'jqueryui',
    'jsplumb',
    'canvas_widget/NodeTool',
    'canvas_widget/NodeShapeNode'
],/** @lends NodeShapeNodeTool */function($,jsPlumb,NodeTool,NodeShapeNode) {

    NodeShapeNodeTool.prototype = new NodeTool();
    NodeShapeNodeTool.prototype.constructor = NodeShapeNodeTool;
    /**
     * NodeShapeNodeTool
     * @class canvas_widget.ClassNodeTool
     * @extends canvas_widget.NodeTool
     * @memberof canvas_widget
     * @constructor
     */
    function NodeShapeNodeTool(){
        NodeTool.call(this,NodeShapeNode.TYPE,null,null,NodeShapeNode.DEFAULT_WIDTH,NodeShapeNode.DEFAULT_HEIGHT);
    }

    return NodeShapeNodeTool;

});