define([
    'jqueryui',
    'jsplumb',
    'canvas_widget/EdgeTool',
    'canvas_widget/ObjectNode',
    'canvas_widget/RelationshipNode',
    'canvas_widget/EnumNode',
    'canvas_widget/NodeShapeNode',
    'canvas_widget/EdgeShapeNode',
    'canvas_widget/BiDirAssociationEdge'
],/** @lends BiDirAssociationEdgeTool */function($,jsPlumb,EdgeTool,ObjectNode,RelationshipNode,EnumNode,NodeShapeNode,EdgeShapeNode,BiDirAssociationEdge) {

    BiDirAssociationEdgeTool.prototype = new EdgeTool();
    BiDirAssociationEdgeTool.prototype.constructor = BiDirAssociationEdgeTool;
    /**
     * BiDirAssociationEdgeTool
     * @class canvas_widget.BiDirAssociationEdgeTool
     * @extends canvas_widget.EdgeTool
     * @memberof canvas_widget
     * @constructor
     */
    function BiDirAssociationEdgeTool(){
        EdgeTool.call(this,BiDirAssociationEdge.TYPE,BiDirAssociationEdge.RELATIONS);
    }

    return BiDirAssociationEdgeTool;

});