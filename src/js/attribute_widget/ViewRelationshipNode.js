define([
    'jqueryui',
    'lodash',
    'attribute_widget/AbstractNode',
    'attribute_widget/RenamingListAttribute',
    'attribute_widget/SingleSelectionAttribute',
    'attribute_widget/ConditionListAttribute',
    'canvas_widget/ViewTypesUtil',
    'canvas_widget/LogicalOperator',
    'canvas_widget/LogicalConjunctions',
    'text!templates/attribute_widget/relationship_node.html'
], /** @lends ViewRelationshipNode */
	function ($, _, AbstractNode, RenamingListAttribute, SingleSelectionAttribute, ConditionListAttribute, ViewTypesUtil,LogicalOperator,LogicalConjunctions, relationshipNodeHtml) {

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
     * @param {object} json the json representation form the role resource
	 * @constructor
	 */
	function ViewRelationshipNode(id, left, top, width, height,json) {
		var that = this;

        var _fromResource = json;

		AbstractNode.call(this, id, ViewRelationshipNode.TYPE, left, top, width, height);

		/**
		 * jQuery object of node template
		 * @type {jQuery}
		 * @private
		 */
		var $template = $(_.template(relationshipNodeHtml, {}));

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
		//this.addAttribute(new SingleSelectionAttribute("[target]", "Target", this, {"class1":"Class1", "class2":"Class2"}));
		ViewTypesUtil.GetCurrentBaseModel().then(function (model) {
			var selectionValues = ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList2(model.nodes, ['Relationship']);
            var attribute = new SingleSelectionAttribute(id+"[target]", "Target", that, selectionValues);

            var conjSelection = new SingleSelectionAttribute(id+'[conjunction]', 'Conjunction', that, LogicalConjunctions);
            that.addAttribute(conjSelection);
            that.get$node().find('.attributes').append(conjSelection.get$node());

            if(_fromResource){
                var targetId = null;
                for(var key in _fromResource.attributes){
                    if(_fromResource.attributes.hasOwnProperty(key) && key.indexOf('[target]') !== -1){
                        targetId = key;
                        break;
                    }
                }
                if(targetId){
                    attribute.setValueFromJSON(_fromResource.attributes[targetId]);
                    var conditionList = _fromResource.attributes["[condition]"];
                    if(conditionList){
                        var attrList = that.getAttribute('[attributes]').getAttributes();
                        var targetAttrList = {};
                        for (var attrKey in attrList) {
                            if (attrList.hasOwnProperty(attrKey)) {
                                targetAttrList[attrKey] = attrList[attrKey].getKey().getValue();
                            }
                        }
                        var cla = new ConditionListAttribute("[condition]", "Conditions", that, targetAttrList, LogicalOperator, LogicalConjunctions);
                        cla.setValueFromJSON(conditionList);
                        that.addAttribute(cla);
                        that.get$node().find('.attributes').append(cla.get$node());
                    }
                }
                _fromResource = null;
            }
			that.addAttribute(attribute);
			that.get$node().find('.attributes').prepend(attribute.get$node());
		});

		this.addAttribute(new RenamingListAttribute("[attributes]", "Attributes", this, {
            "hidden" : "Show",
            "top" : "Show Top",
            "center" : "Show Center",
            "bottom" : "Show Bottom",
            "hide": "Hide"
        }));

		_$node.find(".label").append(this.getLabel().get$node());

		for (var attributeKey in _attributes) {
			if (_attributes.hasOwnProperty(attributeKey)) {
				_$attributeNode.append(_attributes[attributeKey].get$node());
			}
		}
	}

	return ViewRelationshipNode;

});
