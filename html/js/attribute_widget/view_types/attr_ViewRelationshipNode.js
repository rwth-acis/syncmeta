define([
    'jqueryui',
    'lodash',
    'attribute_widget/AbstractNode',
    'attribute_widget/KeySelectionValueSelectionValueListAttribute',
	'attribute_widget/SingleSelectionAttribute',
	'attribute_widget/view_types/attr_ConditionListAttribute',
    'text!templates/attribute_widget/relationship_node.html'
],/** @lends ViewRelationshipNode */function($,_,AbstractNode,KeySelectionValueSelectionValueListAttribute,SingleSelectionAttribute,ConditionListAttribute,relationshipNodeHtml) {

    ViewRelationshipNode.TYPE = "ViewRelationship";

    ViewRelationshipNode.prototype = new AbstractNode();
	ViewRelationshipNode.prototype.constructor = ViewRelationshipNode;
    /**
     * ViewRelationshipNode
     * @class attribute_widget.ViewRelationshipNode
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractNode
     * @param {string} id Entity identifier of node
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     * @constructor
     */
    function ViewRelationshipNode(id,left,top,width,height){
        AbstractNode.call(this,id,ViewRelationshipNode.TYPE,left,top,width,height);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var $template = $(_.template(relationshipNodeHtml,{}));

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = AbstractNode.prototype.get$node.call(this).append($template);

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
		this.addAttribute(new SingleSelectionAttribute("[target]", "Target", this, {"class1":"Class1", "class2":"Class2"}));
        this.addAttribute(new KeySelectionValueSelectionValueListAttribute("[attributes]","Attributes",this,{"string":"String","boolean":"Boolean","integer":"Integer","file":"File"},{"hidden":"Hide","top":"Top","center":"Center","bottom":"Bottom"}));
		 
		var attributeOfClass = {"testattr1":"attr1", "testattr2":"attr2"};
		var operators = {"greater":">", "smaller":"<", "equal":"==","greater_eq":">=","smaller_eq":"<=","nequal":"!="};
		var operators2 = {"AND":"&&", "OR":"||"};
		this.addAttribute(new ConditionListAttribute("[condition]", "Conditions", this, attributeOfClass, operators, operators2));
       
		 
		 _$node.find(".label").append(this.getLabel().get$node());

        for(var attributeKey in _attributes){
            if(_attributes.hasOwnProperty(attributeKey)){
                _$attributeNode.append(_attributes[attributeKey].get$node());
            }
        }
    }

    return ViewRelationshipNode;

});