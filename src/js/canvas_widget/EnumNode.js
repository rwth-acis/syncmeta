define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'canvas_widget/AbstractNode',
    'canvas_widget/SingleValueListAttribute',
    'canvas_widget/BooleanAttribute',
    'canvas_widget/SingleMultiLineValueAttribute',
    'text!templates/canvas_widget/enum_node.html'
],/** @lends EnumNode */function($,jsPlumb,_,AbstractNode,SingleValueListAttribute,BooleanAttribute,SingleMultiLineValueAttribute,enumNodeHtml) {

    EnumNode.TYPE = "Enumeration";
    EnumNode.DEFAULT_WIDTH = 150;
    EnumNode.DEFAULT_HEIGHT = 100;

    EnumNode.prototype = new AbstractNode();
    EnumNode.prototype.constructor = EnumNode;
    /**
     * Abstract Class Node
     * @class canvas_widget.EnumNode
     * @extends canvas_widget.AbstractNode
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity identifier of node
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     * @param {number} zIndex Position of node on z-axis
     */
    function EnumNode(id,left,top,width,height,zIndex){
        var that = this;

        AbstractNode.call(this,id,EnumNode.TYPE,left,top,width,height,zIndex);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(enumNodeHtml,{type: that.getType()}));

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = AbstractNode.prototype.get$node.call(this).append(_$template).addClass("class");

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

        /**
         * Get JSON representation of the node
         * @returns {Object}
         */
        this.toJSON = function(){
            var json = AbstractNode.prototype.toJSON.call(this);
            json.type = EnumNode.TYPE;
            return json;
        };
        var attr= new SingleValueListAttribute("[attributes]","Attributes",this);
        this.addAttribute(attr);

        this.registerYMap = function(map,disableYText){
            AbstractNode.prototype.registerYMap.call(this,map);
            if(!disableYText)
                registerYTextAttributes(map);
            attr.registerYMap(disableYText);
        };
        var registerYTextAttributes = function(map){
            map.get(that.getLabel().getValue().getEntityId()).then(function(ytext){
                that.getLabel().getValue().registerYType(ytext);
            });
        };

        _$node.find(".label").append(this.getLabel().get$node());

        for(var attributeKey in _attributes){
            if(_attributes.hasOwnProperty(attributeKey)){
                _$attributeNode.append(_attributes[attributeKey].get$node());
            }
        }

    }

    return EnumNode;

});