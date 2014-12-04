define([
    'require',
    'jqueryui',
    'jsplumb',
    'lodash',
    'canvas_widget/AbstractNode',
    'canvas_widget/KeySelectionValueListAttribute',
    'canvas_widget/BooleanAttribute',
    'canvas_widget/SingleMultiLineValueAttribute',
    'text!templates/canvas_widget/relationship_group_node.html'
],/** @lends RelationshipGroupNode */function(require,$,jsPlumb,_,AbstractNode,KeySelectionValueListAttribute,BooleanAttribute,SingleMultiLineValueAttribute,relationshipGroupNodeHtml) {

    RelationshipGroupNode.TYPE = "Relation";
    RelationshipGroupNode.DEFAULT_WIDTH = 150;
    RelationshipGroupNode.DEFAULT_HEIGHT = 100;

    RelationshipGroupNode.prototype = new AbstractNode();
    RelationshipGroupNode.prototype.constructor = RelationshipGroupNode;
    /**
     * Abstract Class Node
     * @class canvas_widget.RelationshipGroupNode
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
    function RelationshipGroupNode(id,left,top,width,height,zIndex){
        var that = this;

        AbstractNode.call(this,id,RelationshipGroupNode.TYPE,left,top,width,height,zIndex);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(relationshipGroupNodeHtml,{type: that.getType()}));

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
            json.type = RelationshipGroupNode.TYPE;
            return json;
        };

        //this.addAttribute(new KeySelectionValueListAttribute("[attributes]","Attributes",this,{"string":"String","boolean":"Boolean","integer":"Integer","file":"File"}));

        _$node.find(".label").append(this.getLabel().get$node());

        for(var attributeKey in _attributes){
            if(_attributes.hasOwnProperty(attributeKey)){
                _$attributeNode.append(_attributes[attributeKey].get$node());
            }
        }

    }

    return RelationshipGroupNode;

});