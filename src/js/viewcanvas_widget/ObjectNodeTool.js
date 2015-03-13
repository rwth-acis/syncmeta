define([
    'jqueryui',
    'jsplumb',
    'viewcanvas_widget/NodeTool',
    'viewcanvas_widget/ObjectNode'
],/** @lends ObjectNodeTool */function($,jsPlumb,NodeTool,ObjectNode) {

    ObjectNodeTool.prototype = new NodeTool();
    ObjectNodeTool.prototype.constructor = ObjectNodeTool;
    /**
     * ObjectNodeTool
     * @class canvas_widget.ObjectNodeTool
     * @memberof canvas_widget
     * @constructor
     */
    function ObjectNodeTool(){
        NodeTool.call(this,ObjectNode.TYPE,null,null,ObjectNode.DEFAULT_WIDTH,ObjectNode.DEFAULT_HEIGHT);
    }

    return ObjectNodeTool;

});