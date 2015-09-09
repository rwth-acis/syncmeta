define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'attribute_widget/AbstractEdge',
    'attribute_widget/AbstractClassNode',
    'attribute_widget/ObjectNode',
    'attribute_widget/RelationshipNode',
    'attribute_widget/RelationshipGroupNode',
    'attribute_widget/EnumNode',
    'attribute_widget/NodeShapeNode',
    'attribute_widget/EdgeShapeNode',
	'attribute_widget/ViewObjectNode',
	'attribute_widget/ViewRelationshipNode'
],/** @lends UniDirAssociationEdge */function($,jsPlumb,_,AbstractEdge,AbstractClassNode,ObjectNode,RelationshipNode,RelationshipGroupNode,EnumNode,NodeShapeNode,EdgeShapeNode,ViewObjectNode,ViewRelationshipNode) {

    UniDirAssociationEdge.TYPE = "Uni-Dir-Association";
    UniDirAssociationEdge.RELATIONS = [
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
            sourceTypes: [ViewObjectNode.TYPE],
            targetTypes: [EnumNode.TYPE,NodeShapeNode.TYPE,RelationshipNode.TYPE,RelationshipGroupNode.TYPE,ViewRelationshipNode.TYPE]
        },
        {
            sourceTypes: [ViewRelationshipNode.TYPE],
            targetTypes: [EnumNode.TYPE,EdgeShapeNode.TYPE,ObjectNode.TYPE,AbstractClassNode.TYPE,ViewObjectNode.TYPE]
        }
    ];

    UniDirAssociationEdge.prototype = new AbstractEdge();
	UniDirAssociationEdge.prototype.constructor = UniDirAssociationEdge;
    /**
     * UniDirAssociationEdge
     * @class attribute_widget.UniDirAssociationEdge
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractEdge
     * @constructor
     * @param {string} id
     * @param {attribute_widget.AbstractNode} source
     * @param {attribute_widget.AbstractNode} target
     */
    function UniDirAssociationEdge(id,source,target){
        AbstractEdge.call(this,UniDirAssociationEdge.TYPE,id,source,target);
    }

    return UniDirAssociationEdge;

});