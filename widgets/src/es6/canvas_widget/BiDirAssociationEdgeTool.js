import $ from 'jqueryui';
import jsPlumb from 'jsplumb';
import EdgeTool from 'canvas_widget/EdgeTool';
import ObjectNode from 'canvas_widget/ObjectNode';
import RelationshipNode from 'canvas_widget/RelationshipNode';
import EnumNode from 'canvas_widget/EnumNode';
import NodeShapeNode from 'canvas_widget/NodeShapeNode';
import EdgeShapeNode from 'canvas_widget/EdgeShapeNode';
import BiDirAssociationEdge from 'canvas_widget/BiDirAssociationEdge';

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

    export default BiDirAssociationEdgeTool;

