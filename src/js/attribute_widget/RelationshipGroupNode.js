define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'attribute_widget/AbstractNode',
    'attribute_widget/KeySelectionValueListAttribute',
    'attribute_widget/BooleanAttribute',
    'attribute_widget/SingleMultiLineValueAttribute',
    'text!templates/attribute_widget/relationship_group_node.html'
],/** @lends RelationshipGroupNode */function($,jsPlumb,_,AbstractNode,KeySelectionValueListAttribute,BooleanAttribute,SingleMultiLineValueAttribute,relationshipGroupNodeHtml) {

    RelationshipGroupNode.TYPE = "Relation";

    RelationshipGroupNode.prototype = new AbstractNode();
    RelationshipGroupNode.prototype.constructor = RelationshipGroupNode;
    /**
     * Abstract Class Node
     * @class attribute_widget.RelationshipGroupNode
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractNode
     * @constructor
     * @param {string} id Entity identifier of node
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     */
    function RelationshipGroupNode(id,left,top,width,height){

        AbstractNode.call(this,id,RelationshipGroupNode.TYPE,left,top,width,height);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(relationshipGroupNodeHtml,{}));

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = AbstractNode.prototype.get$node.call(this).append(_$template);

        /**
         * jQuery object of DOM node representing the attributes
         * @type {jQuery}
         * @private
         */
        var _$attributeNode = _$node.find(".attributes");

        /**
         * Attributes of node
         * @type {Object}
         * @private
         */
        var attributes = this.getAttributes();

        //this.addAttribute(new KeySelectionValueListAttribute("[attributes]","Attributes",this,{"string":"String","boolean":"Boolean","integer":"Integer","file":"File"}));

        _$node.find(".label").append(this.getLabel().get$node());

        for(var attributeKey in attributes){
            if(attributes.hasOwnProperty(attributeKey)){
                _$attributeNode.append(attributes[attributeKey].get$node());
            }
        }
    }

    return RelationshipGroupNode;

});