define([
    'jqueryui',
    'jsplumb',
    'viewcanvas_widget/EdgeTool',
    'viewcanvas_widget/AbstractClassNode',
    'viewcanvas_widget/ObjectNode',
    'viewcanvas_widget/RelationshipNode',
    'viewcanvas_widget/EnumNode',
    'viewcanvas_widget/NodeShapeNode',
    'viewcanvas_widget/EdgeShapeNode',
    'viewcanvas_widget/UniDirAssociationEdge'
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