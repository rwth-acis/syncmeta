import $ from 'jqueryui';
import jsPlumb from 'jsplumb';
import _ from 'lodash';
import AbstractEdge from 'attribute_widget/AbstractEdge';
import AbstractClassNode from 'attribute_widget/AbstractClassNode';
import ObjectNode from 'attribute_widget/ObjectNode';
import RelationshipNode from 'attribute_widget/RelationshipNode';
import RelationshipGroupNode from 'attribute_widget/RelationshipGroupNode';
import EnumNode from 'attribute_widget/EnumNode';
import ViewObjectNode from 'attribute_widget/viewpoint/ViewObjectNode';
import ViewRelationshipNode from 'attribute_widget/viewpoint/ViewRelationshipNode';

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

    export default GeneralisationEdge;

