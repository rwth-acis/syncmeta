define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'attribute_widget/AbstractNode',
    'attribute_widget/KeySelectionValueSelectionValueListAttribute',
	'attribute_widget/SingleSelectionAttribute',
    'text!templates/attribute_widget/object_node.html'
],/** @lends ViewObjectNode */function($,jsPlumb,_,AbstractNode,KeySelectionValueSelectionValueListAttribute,SingleSelectionAttribute,objectNodeHtml) {

    ViewObjectNode.TYPE = "ViewObject";

    ViewObjectNode.prototype = new AbstractNode();
    ViewObjectNode.prototype.constructor = ViewObjectNode;
    /**
     * ViewObjectNode
     * @class attribute_widget.ViewObjectNode
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractNode
     * @constructor
     * @param {string} id Entity identifier of node
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     */
    function ViewObjectNode(id,left,top,width,height){
        AbstractNode.call(this,id,ViewObjectNode.TYPE,left,top,width,height);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(objectNodeHtml,{}));

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
		this.addAttribute(new SingleSelectionAttribute("[target]", "Target", this, {"class1":"Class1", "class2":"Class2"}));
        this.addAttribute(new KeySelectionValueSelectionValueListAttribute("[attributes]","Attributes",this,{"string":"String","boolean":"Boolean","integer":"Integer","file":"File"},{"hidden":"Hidden","show":"Visible"}));
		
        _$node.find(".label").append(this.getLabel().get$node());

        for(var attributeKey in _attributes){
            if(_attributes.hasOwnProperty(attributeKey)){
                _$attributeNode.append(_attributes[attributeKey].get$node());
            }
        }
    }

    return ViewObjectNode;

});