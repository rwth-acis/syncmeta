import $ from 'jqueryui';
import jsPlumb from 'jsplumb';
import _ from 'lodash';
import AbstractEdge from 'attribute_widget/AbstractEdge';
import AbstractClassNode from 'attribute_widget/AbstractClassNode';
import ObjectNode from 'attribute_widget/ObjectNode';
import RelationshipNode from 'attribute_widget/RelationshipNode';
import RelationshipGroupNode from 'attribute_widget/RelationshipGroupNode';
import EnumNode from 'attribute_widget/EnumNode';
import NodeShapeNode from 'attribute_widget/NodeShapeNode';
import EdgeShapeNode from 'attribute_widget/EdgeShapeNode';
import ViewObjectNode from 'attribute_widget/viewpoint/ViewObjectNode';
import ViewRelationshipNode from 'attribute_widget/viewpoint/ViewRelationshipNode';

    BiDirAssociationEdge.TYPE = "Bi-Dir-Association";
    BiDirAssociationEdge.RELATIONS = [
        {
            sourceTypes: [ObjectNode.TYPE],
            targetTypes: [EnumNode.TYPE,NodeShapeNode.TYPE,RelationshipNode.TYPE,RelationshipGroupNode.TYPE,ViewRelationshipNode.TYPE]
        },
        {
            sourceTypes: [RelationshipNode.TYPE],
            targetTypes: [EnumNode.TYPE,EdgeShapeNode.TYPE,ObjectNode.TYPE,AbstractClassNode.TYPE,ViewObjectNode.TYPE]
        },
        {
            sourceTypes: [RelationshipGroupNode.TYPE],
            targetTypes: [ObjectNode.TYPE,AbstractClassNode.TYPE]
        },
        {
            sourceTypes: [AbstractClassNode.TYPE],
            targetTypes: [EnumNode.TYPE,RelationshipNode.TYPE,RelationshipGroupNode.TYPE]
        },
        {
            sourceTypes: [EnumNode.TYPE],
            targetTypes: [ObjectNode.TYPE,RelationshipNode.TYPE,AbstractClassNode.TYPE]
        },
        {
            sourceTypes: [NodeShapeNode.TYPE],
            targetTypes: [ObjectNode.TYPE]
        },
        {
            sourceTypes: [EdgeShapeNode.TYPE],
            targetTypes: [RelationshipNode.TYPE]
        },
		{
            sourceTypes: [ViewObjectNode.TYPE],
            targetTypes: [EnumNode.TYPE,NodeShapeNode.TYPE,RelationshipNode.TYPE,RelationshipGroupNode.TYPE,ViewRelationshipNode.TYPE]
        },
		{
            sourceTypes: [ViewRelationshipNode.TYPE],
            targetTypes: [EnumNode.TYPE,EdgeShapeNode.TYPE,ObjectNode.TYPE,AbstractClassNode.TYPE,ViewObjectNode.TYPE]
        }
    ];

    BiDirAssociationEdge.prototype = new AbstractEdge();
	BiDirAssociationEdge.prototype.constructor = BiDirAssociationEdge;
    /**
     * BiDirAssociationEdge
     * @class attribute_widget.BiDirAssociationEdge
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractEdge
     * @constructor
     * @param {string} id
     * @param {attribute_widget.AbstractNode} source
     * @param {attribute_widget.AbstractNode} target
     */
    function BiDirAssociationEdge(id,source,target){
        AbstractEdge.call(this,BiDirAssociationEdge.TYPE,id,source,target);
    }

    export default BiDirAssociationEdge;
