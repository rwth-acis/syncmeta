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
	'attribute_widget/ViewObjectNode',
	'attribute_widget/ViewRelationshipNode'
],/** @lends GeneralisationEdge */function($,jsPlumb,_,AbstractEdge,AbstractClassNode,ObjectNode,RelationshipNode,RelationshipGroupNode,EnumNode,ViewObjectNode,ViewRelationshipNode) {

    GeneralisationEdge.TYPE = "Generalisation";
    GeneralisationEdge.RELATIONS = [
        {
            sourceTypes: [ObjectNode.TYPE],
            targetTypes: [ObjectNode.TYPE,AbstractClassNode.TYPE]
        },
        {
            sourceTypes: [RelationshipNode.TYPE],
            targetTypes: [RelationshipNode.TYPE,AbstractClassNode.TYPE]
        },
        {
            sourceTypes: [RelationshipGroupNode.TYPE],
            targetTypes: [RelationshipNode.TYPE]
        },
        {
            sourceTypes: [AbstractClassNode.TYPE],
            targetTypes: [AbstractClassNode.TYPE]
        },
        {
            sourceTypes: [EnumNode.TYPE],
            targetTypes: [EnumNode.TYPE]
        }
    ];

    GeneralisationEdge.prototype = new AbstractEdge();
    GeneralisationEdge.prototype.constructor = GeneralisationEdge;
    /**
     * GeneralisationEdge
     * @class attribute_widget.GeneralisationEdge
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractEdge
     * @param {string} id Entity identifier of edge
     * @param {attribute_widget.AbstractNode} source Source node
     * @param {attribute_widget.AbstractNode} target Target node
     * @constructor
     */
    function GeneralisationEdge(id,source,target){
        AbstractEdge.call(this,GeneralisationEdge.TYPE,id,source,target);
    }

    return GeneralisationEdge;

});