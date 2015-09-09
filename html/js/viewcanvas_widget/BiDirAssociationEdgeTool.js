define([
    'jqueryui',
    'jsplumb',
    'viewcanvas_widget/EdgeTool',
    'viewcanvas_widget/ObjectNode',
    'viewcanvas_widget/RelationshipNode',
    'viewcanvas_widget/EnumNode',
    'viewcanvas_widget/NodeShapeNode',
    'viewcanvas_widget/EdgeShapeNode',
    'viewcanvas_widget/BiDirAssociationEdge'
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