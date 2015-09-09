define([
    'jqueryui',
    'jsplumb',
    'viewcanvas_widget/NodeTool',
    'viewcanvas_widget/EntityManager',
    'viewcanvas_widget/EnumNode'
],/** @lends EnumNodeTool */function($,jsPlumb,NodeTool,EntityManager,EnumNode) {

    EnumNodeTool.prototype = new NodeTool();
    EnumNodeTool.prototype.constructor = EnumNodeTool;
    /**
     * EnumNodeTool
     * @class canvas_widget.ClassNodeTool
     * @extends canvas_widget.NodeTool
     * @memberof canvas_widget
     * @constructor
     */
    function EnumNodeTool(){
        NodeTool.call(this,EnumNode.TYPE,null,null,EnumNode.DEFAULT_WIDTH,EnumNode.DEFAULT_HEIGHT);
    }

    return EnumNodeTool;

});