define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'attribute_widget/AbstractNode',
    'attribute_widget/KeySelectionValueListAttribute',
    'attribute_widget/BooleanAttribute',
    'attribute_widget/SingleMultiLineValueAttribute',
    'text!templates/attribute_widget/abstract_class_node.html'
],/** @lends AbstractClassNode */function($,jsPlumb,_,AbstractNode,KeySelectionValueListAttribute,BooleanAttribute,SingleMultiLineValueAttribute,abstractClassNodeHtml) {

    AbstractClassNode.TYPE = "Abstract Class";

    AbstractClassNode.prototype = new AbstractNode();
    AbstractClassNode.prototype.constructor = AbstractClassNode;
    /**
     * Abstract Class Node
     * @class attribute_widget.AbstractClassNode
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractNode
     * @constructor
     * @param {string} id Entity identifier of node
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     */
    function AbstractClassNode(id,left,top,width,height){
        var that = this;
        AbstractNode.call(this,id,AbstractClassNode.TYPE,left,top,width,height);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(abstractClassNodeHtml,{}));

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
        var _attributes = this.getAttributes();

        this.addAttribute(new KeySelectionValueListAttribute("[attributes]","Attributes",this,{"string":"String","boolean":"Boolean","integer":"Integer","file":"File"}));

        _$node.find(".label").append(this.getLabel().get$node());

        this.registerYType = function(){
            var registerValue = function(ymap, value){
                ymap.get(value.getEntityId()).then(function(ytext){
                    value.registerYType(ytext);
                })
            };

            AbstractNode.prototype.registerYType.call(this);
            y.share.nodes.get(that.getEntityId()).then(function(ymap){
                var attrs = _attributes["[attributes]"].getAttributes();
                for(var attributeKey in attrs){
                    if(attrs.hasOwnProperty(attributeKey)){
                        var attr = attrs[attributeKey];
                        registerValue(ymap,attr.getKey());
                    }
                }
            });
        };

        for(var attributeKey in _attributes){
            if(_attributes.hasOwnProperty(attributeKey)){
                _$attributeNode.append(_attributes[attributeKey].get$node());
            }
        }
    }

    return AbstractClassNode;

});