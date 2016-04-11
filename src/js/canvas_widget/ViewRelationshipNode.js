define([
    'require',
    'jqueryui',
    'jsplumb',
    'lodash',
    'canvas_widget/AbstractNode',
    'canvas_widget/SingleSelectionAttribute',
    'canvas_widget/RenamingListAttribute',
    'canvas_widget/ConditionListAttribute',
    'canvas_widget/ViewTypesUtil',
    'canvas_widget/LogicalOperator',
    'canvas_widget/LogicalConjunctions',
    'text!templates/canvas_widget/viewrelationship_node.html'
], /** @lends ViewRelationshipNode */
function (require, $, jsPlumb, _, AbstractNode, SingleSelectionAttribute, RenamingListAttribute, ConditionListAttribute, ViewTypesUtil, LogicalOperator, LogicalConjunctions, viewrelationshipNodeHtml) {

	ViewRelationshipNode.TYPE = "ViewRelationship";
	ViewRelationshipNode.DEFAULT_WIDTH = 150;
	ViewRelationshipNode.DEFAULT_HEIGHT = 100;

	ViewRelationshipNode.prototype = new AbstractNode();
	ViewRelationshipNode.prototype.constructor = ViewRelationshipNode;
	/**
	 * ViewRelationshipNode
	 * @class canvas_widget.ViewRelationshipNode
	 * @extends canvas_widget.AbstractNode
	 * @memberof canvas_widget
	 * @constructor
	 * @param {string} id Entity identifier of node
	 * @param {number} left x-coordinate of node position
	 * @param {number} top y-coordinate of node position
	 * @param {number} width Width of node
	 * @param {number} height Height of node
	 * @param {number} zIndex Position of node on z-axis
     * @param {object} json indicates if the ViewObjectNode is created from a json

     */
	function ViewRelationshipNode(id, left, top, width, height, zIndex,json) {
		var that = this;

        var _fromResource = json;

		AbstractNode.call(this, id, ViewRelationshipNode.TYPE, left, top, width, height, zIndex);

		/**
		 * jQuery object of node template
		 * @type {jQuery}
		 * @private
		 */
		var _$template = $(_.template(viewrelationshipNodeHtml, {
					type : that.getType()
				}));

		/**
		 * jQuery object of DOM node representing the node
		 * @type {jQuery}
		 * @private
		 */
		var $node = AbstractNode.prototype.get$node.call(this).append(_$template).addClass("viewrelationship");

		/**
		 * jQuery object of DOM node representing the attributes
		 * @type {jQuery}
		 * @private
		 */
		var _$attributeNode = $node.find(".attributes");

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
		this.toJSON = function () {
			return AbstractNode.prototype.toJSON.call(this);
		};
		ViewTypesUtil.GetCurrentBaseModel().then(function (model) {
			var selectionValues = ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList2(model.nodes, ['Relationship']);
            var attribute = new SingleSelectionAttribute(id+"[target]", "Target", that, selectionValues);

            var conjSelection = new SingleSelectionAttribute(id+'[conjunction]', 'Conjunction', that, LogicalConjunctions);
            that.addAttribute(conjSelection);
			conjSelection.getValue().registerYType();
            that.get$node().find('.attributes').append(conjSelection.get$node());

            if(_fromResource){
                var targetId;
                var target = _fromResource.attributes[id + '[target]'];
                if(target)
                    targetId = target.value.value;

                if(targetId){
                    attribute.setValueFromJSON(_fromResource.attributes[id + '[target]']);
                    if(conditonList = _fromResource.attributes["[condition]"]){
                        var attrList = that.getAttribute('[attributes]').getAttributes();
                        var targetAttrList = {};
                        for (var key in attrList) {
                            if (attrList.hasOwnProperty(key)) {
                                targetAttrList[key] = attrList[key].getKey().getValue();
                            }
                        }
                        var cla = new ConditionListAttribute("[condition]", "Conditions", that, targetAttrList, LogicalOperator, LogicalConjunctions);
                        cla.setValueFromJSON(conditonList);
						cla.registerYMap();
						that.addAttribute(cla);
                        that.get$node().find('.attributes').append(cla.get$node());
                    }
                }
                _fromResource = null;
            }
			that.addAttribute(attribute);
			attribute.getValue().registerYType();
			that.get$node().find('.attributes').prepend(attribute.get$node());
		});
		var attributeList = new RenamingListAttribute("[attributes]", "Attributes", this, {
			"hidden" : "Show",
			"top" : "Show Top",
			"center" : "Show Center",
			"bottom" : "Show Bottom",
			"hide": "Hide"
		});
		this.addAttribute(attributeList);

		var registerYTextAttributes = function(map){
			map.get(that.getLabel().getValue().getEntityId()).then(function(ytext){
				that.getLabel().getValue().registerYType(ytext);
			});
		};
		this.registerYMap = function(map, disableYText){
			AbstractNode.prototype.registerYMap.call(this,map);
			if(!disableYText)
				registerYTextAttributes(map);
			attributeList.registerYMap(disableYText);
		};

		$node.find(".label").append(this.getLabel().get$node());

		for (var attributeKey in _attributes) {
			if (_attributes.hasOwnProperty(attributeKey)) {
				_$attributeNode.append(_attributes[attributeKey].get$node());
			}
		}

		this.setContextMenuItemCallback(function () {
			var EdgeShapeNode = require('canvas_widget/EdgeShapeNode'),
			BiDirAssociationEdge = require('canvas_widget/BiDirAssociationEdge'),
			UniDirAssociationEdge = require('canvas_widget/UniDirAssociationEdge');
            var viewId = $('#lblCurrentView').text();
			return {
				addShape : {
					name : "Add Edge Shape",
					callback : function () {
						var canvas = that.getCanvas(),
						appearance = that.getAppearance(),
						nodeId;

						//noinspection JSAccessibilityCheck
						nodeId = canvas.createNode(EdgeShapeNode.TYPE, appearance.left + appearance.width + 50, appearance.top, 150, 100);
						canvas.createEdge(BiDirAssociationEdge.TYPE, that.getEntityId(), nodeId, null, null, viewId);
					},
					disabled : function () {
						var edges = that.getEdges(),
						edge,
						edgeId;

						for (edgeId in edges) {
							if (edges.hasOwnProperty(edgeId)) {
								edge = edges[edgeId];
								if ((edge instanceof BiDirAssociationEdge &&
										(edge.getTarget() === that && edge.getSource()instanceof EdgeShapeNode ||
											edge.getSource() === that && edge.getTarget()instanceof EdgeShapeNode)) ||

									(edge instanceof UniDirAssociationEdge && edge.getTarget()instanceof EdgeShapeNode)) {

									return true;
								}
							}
						}
						return false;
					}
				},
				sep : "---------"
			};
		});
	}

	return ViewRelationshipNode;

});
