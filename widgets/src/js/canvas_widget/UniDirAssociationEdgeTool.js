define([
    'jqueryui',
    'jsplumb',
    'canvas_widget/EdgeTool',
    'canvas_widget/AbstractClassNode',
    'canvas_widget/ObjectNode',
    'canvas_widget/RelationshipNode',
    'canvas_widget/EnumNode',
    'canvas_widget/NodeShapeNode',
    'canvas_widget/EdgeShapeNode',
    'canvas_widget/UniDirAssociationEdge'
],/** @lends UniDirAssociationEdgeTool */function($,jsPlumb,EdgeTool,AbstractClassNode,ObjectNode,RelationshipNode,EnumNode,NodeShapeNode,EdgeShapeNode,UniDirAssociationEdge) {

    UniDirAssociationEdgeTool.prototype = new EdgeTool();
    UniDirAssociationEdgeTool.prototype.constructor = UniDirAssociationEdgeTool;
    /**
     * BiDirAssociationEdgeTool
     * @class canvas_widget.UniDirAssociationEdgeTool
     * @extends canvas_widget.EdgeTool
     * @memberof canvas_widget
     * @constructor
     */
    function UniDirAssociationEdgeTool(){
        EdgeTool.call(this,UniDirAssociationEdge.TYPE,UniDirAssociationEdge.RELATIONS);
    }

    return UniDirAssociationEdgeTool;

});