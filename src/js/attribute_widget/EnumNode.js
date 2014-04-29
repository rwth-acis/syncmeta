define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'attribute_widget/AbstractNode',
    'attribute_widget/SingleValueListAttribute',
    'attribute_widget/BooleanAttribute',
    'attribute_widget/SingleMultiLineValueAttribute',
    'text!templates/attribute_widget/enum_node.html'
],/** @lends EnumNode */function($,jsPlumb,_,AbstractNode,SingleValueListAttribute,BooleanAttribute,SingleMultiLineValueAttribute,enumNodeHtml) {

    EnumNode.TYPE = "Enumeration";

    EnumNode.prototype = new AbstractNode();
    EnumNode.prototype.constructor = EnumNode;
    /**
     * Abstract Class Node
     * @class attribute_widget.EnumNode
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractNode
     * @constructor
     * @param {string} id Entity identifier of node
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     */
    function EnumNode(id,left,top,width,height){

        AbstractNode.call(this,id,EnumNode.TYPE,left,top,width,height);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(enumNodeHtml,{}));

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
        var $attributeNode = _$node.find(".attributes");

        /**
         * Attributes of node
         * @type {Object}
         * @private
         */
        var attributes = this.getAttributes();

        this.addAttribute(new SingleValueListAttribute("[attributes]","Attributes",this));

        _$node.find(".label").append(this.getLabel().get$node());

        for(var attributeKey in attributes){
            if(attributes.hasOwnProperty(attributeKey)){
                $attributeNode.append(attributes[attributeKey].get$node());
            }
        }
    }

    return EnumNode;

});