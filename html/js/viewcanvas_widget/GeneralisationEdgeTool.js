define([
    'jqueryui',
    'jsplumb',
    'viewcanvas_widget/EdgeTool',
    'viewcanvas_widget/AbstractClassNode',
    'viewcanvas_widget/ObjectNode',
    'viewcanvas_widget/RelationshipNode',
    'viewcanvas_widget/EnumNode',
    'viewcanvas_widget/GeneralisationEdge'
],/** @lends GeneralisationEdgeTool */function($,jsPlumb,EdgeTool,AbstractClassNode,ObjectNode,RelationshipNode,EnumNode,GeneralisationEdge) {

    GeneralisationEdgeTool.prototype = new EdgeTool();
    GeneralisationEdgeTool.prototype.constructor = GeneralisationEdgeTool;
    /**
     * GeneralisationEdgeTool
     * @class canvas_widget.GeneralisationEdgeTool
     * @extends canvas_widget.EdgeTool
     * @memberof canvas_widget
     * @constructor
     */
    function GeneralisationEdgeTool(){
        EdgeTool.call(this,GeneralisationEdge.TYPE,GeneralisationEdge.RELATIONS);
    }

    return GeneralisationEdgeTool;

});