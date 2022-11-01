import $ from 'jqueryui';
import jsPlumb from 'jsplumb';
import EdgeTool from 'canvas_widget/EdgeTool';
import AbstractClassNode from 'canvas_widget/AbstractClassNode';
import ObjectNode from 'canvas_widget/ObjectNode';
import RelationshipNode from 'canvas_widget/RelationshipNode';
import EnumNode from 'canvas_widget/EnumNode';
import NodeShapeNode from 'canvas_widget/NodeShapeNode';
import EdgeShapeNode from 'canvas_widget/EdgeShapeNode';
import UniDirAssociationEdge from 'canvas_widget/UniDirAssociationEdge';

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

    export default UniDirAssociationEdgeTool;

