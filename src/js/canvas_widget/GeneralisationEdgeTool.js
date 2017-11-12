define([
    'jqueryui',
    'jsplumb',
    'canvas_widget/EdgeTool',
    'canvas_widget/AbstractClassNode',
    'canvas_widget/ObjectNode',
    'canvas_widget/RelationshipNode',
    'canvas_widget/EnumNode',
    'canvas_widget/GeneralisationEdge'
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