define([
    'require',
    'jqueryui',
    'jsplumb',
    'lodash',
    'viewcanvas_widget/AbstractNode',
    'viewcanvas_widget/SingleSelectionAttribute',
    'viewcanvas_widget/KeySelectionValueSelectionValueListAttribute',
    'viewcanvas_widget/ConditionListAttribute',
    'viewcanvas_widget/ViewTypesUtil',
    'viewcanvas_widget/LogicalOperator',
    'viewcanvas_widget/LogicalConjunctions',
    'text!templates/viewcanvas_widget/viewrelationship_node.html'
], /** @lends ViewRelationshipNode */
function (require, $, jsPlumb, _, AbstractNode, SingleSelectionAttribute, KeySelectionValueSelectionValueListAttribute, ConditionListAttribute, ViewTypesUtil, LogicalOperator, LogicalConjunctions, viewrelationshipNodeHtml) {

	ViewRelationshipNode.TYPE = "ViewRelationship";
	ViewRelationshipNode.DEFAULT_WIDTH = 150;
	ViewRelationshipNode.DEFAULT_HEIGHT = 100;

	ViewRelationshipNode.prototype = new AbstractNode();
	ViewRelationshipNode.prototype.constructor = ViewRelationshipNode;
	/**
	 * ViewRelationshipNode
	 * @class viewcanvas_widget.ViewRelationshipNode
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
            that.get$node().find('.attributes').append(conjSelection.get$node());

            if(_fromResource){
                var targetId = null;
                for(var key in _fromResource.attributes){
                    if(_fromResource.attributes.hasOwnProperty(key) && key.indexOf('[target]') != -1){
                        targetId = key;
                        break;
                    }
                }
                if(targetId){
                    attribute.setValueFromJSON(_fromResource.attributes[targetId]);
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
                        that.addAttribute(cla);
                        that.get$node().find('.attributes').append(cla.get$node());
                    }
                }
                _fromResource = null;
            }
			that.addAttribute(attribute);
			that.get$node().find('.attributes').prepend(attribute.get$node());
		});
		this.addAttribute(new KeySelectionValueSelectionValueListAttribute("[attributes]", "Attributes", this, {
				"string" : "String",
				"boolean" : "Boolean",
				"integer" : "Integer",
				"file" : "File"
			}, {
				"hidden" : "Show",
				"top" : "Show Top",
				"center" : "Show Center",
				"bottom" : "Show Bottom",
                "hide": "Hide"
			}));

		
		$node.find(".label").append(this.getLabel().get$node());

		for (var attributeKey in _attributes) {
			if (_attributes.hasOwnProperty(attributeKey)) {
				_$attributeNode.append(_attributes[attributeKey].get$node());
			}
		}

		this.setContextMenuItemCallback(function () {
			var EdgeShapeNode = require('viewcanvas_widget/EdgeShapeNode'),
			BiDirAssociationEdge = require('viewcanvas_widget/BiDirAssociationEdge'),
			UniDirAssociationEdge = require('viewcanvas_widget/UniDirAssociationEdge');
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
				sepConvertTo : "---------",
				convertTo : {
					name : "Convert to..",
					items : {
						abstractNode : {
							name : "..Abstract Class Node",
							callback : function () {
								var canvas = that.getCanvas(),
								appearance = that.getAppearance(),
								nodeId;

								//noinspection JSAccessibilityCheck
								nodeId = canvas.createNode(require('viewcanvas_widget/AbstractClassNode').TYPE, appearance.left, appearance.top, appearance.width, appearance.height, that.getZIndex(), that.toJSON());
								var edges = that.getOutgoingEdges(),
								edge,
								edgeId;

								for (edgeId in edges) {
									if (edges.hasOwnProperty(edgeId)) {
										edge = edges[edgeId];
										canvas.createEdge(edge.getType(), nodeId, edge.getTarget().getEntityId(), edge.toJSON(), null, viewId);
									}
								}

								edges = that.getIngoingEdges();

								for (edgeId in edges) {
									if (edges.hasOwnProperty(edgeId)) {
										edge = edges[edgeId];
										if (edge.getSource() !== edge.getTarget()) {
											canvas.createEdge(edge.getType(), edge.getSource().getEntityId(), nodeId, edge.toJSON(), null, viewId);
										}
									}
								}

								that.triggerDeletion();

							}
						},
						objectNode : {
							name : "..Object Node",
							callback : function () {
								var canvas = that.getCanvas(),
								appearance = that.getAppearance(),
								nodeId;

								//noinspection JSAccessibilityCheck
								nodeId = canvas.createNode(require('viewcanvas_widget/ObjectNode').TYPE, appearance.left, appearance.top, appearance.width, appearance.height, that.getZIndex(), that.toJSON());
								var edges = that.getOutgoingEdges(),
								edge,
								edgeId;

								for (edgeId in edges) {
									if (edges.hasOwnProperty(edgeId)) {
										edge = edges[edgeId];
										canvas.createEdge(edge.getType(), nodeId, edge.getTarget().getEntityId(), edge.toJSON(), null, viewId);
									}
								}

								edges = that.getIngoingEdges();

								for (edgeId in edges) {
									if (edges.hasOwnProperty(edgeId)) {
										edge = edges[edgeId];
										if (edge.getSource() !== edge.getTarget()) {
											canvas.createEdge(edge.getType(), edge.getSource().getEntityId(), nodeId, edge.toJSON(), null, viewId);
										}
									}
								}

								that.triggerDeletion();

							}
						},
						relationshipGroupNode : {
							name : "..Relationship Group",
							callback : function () {
								var canvas = that.getCanvas(),
								appearance = that.getAppearance(),
								nodeId;

								//noinspection JSAccessibilityCheck
								nodeId = canvas.createNode(require('viewcanvas_widget/RelationshipGroupNode').TYPE, appearance.left, appearance.top, appearance.width, appearance.height, that.getZIndex(), that.toJSON());
								var edges = that.getOutgoingEdges(),
								edge,
								edgeId;

								for (edgeId in edges) {
									if (edges.hasOwnProperty(edgeId)) {
										edge = edges[edgeId];
										canvas.createEdge(edge.getType(), nodeId, edge.getTarget().getEntityId(), edge.toJSON(), null, viewId);
									}
								}

								edges = that.getIngoingEdges();

								for (edgeId in edges) {
									if (edges.hasOwnProperty(edgeId)) {
										edge = edges[edgeId];
										if (edge.getSource() !== edge.getTarget()) {
											canvas.createEdge(edge.getType(), edge.getSource().getEntityId(), nodeId, edge.toJSON(), null, viewId);
										}
									}
								}

								that.triggerDeletion();

							}
						}
					}
				},
				sep : "---------"
			};
		});
	}

	return ViewRelationshipNode;

});
