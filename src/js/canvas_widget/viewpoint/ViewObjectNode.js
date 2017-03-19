define([
    'require',
    'jqueryui',
    'lodash',
    'canvas_widget/AbstractNode',
    'canvas_widget/SingleSelectionAttribute',
    'canvas_widget/viewpoint/RenamingListAttribute',
    'canvas_widget/viewpoint/ConditionListAttribute',
    'canvas_widget/viewpoint/ViewTypesUtil',
    'canvas_widget/viewpoint/LogicalOperator',
    'canvas_widget/viewpoint/LogicalConjunctions',
    'text!templates/canvas_widget/viewobject_node.html'
],/** @lends ViewObjectNode */function (require, $, _, AbstractNode, SingleSelectionAttribute, RenamingListAttribute, ConditionListAttribute, ViewTypesUtil, LogicalOperator, LogicalConjunctions, viewobjectNodeHtml) {

    ViewObjectNode.TYPE = "ViewObject";
    ViewObjectNode.DEFAULT_WIDTH = 150;
    ViewObjectNode.DEFAULT_HEIGHT = 100;

    ViewObjectNode.prototype = new AbstractNode();
    ViewObjectNode.prototype.constructor = ViewObjectNode;
    /**
     * ViewObjectNode
     * @class canvas_widget.ViewObjectNode
     * @extends canvas_widget.AbstractNode
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity identifier of node
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     * @param {number} zIndex Position of node on z-axis
     * @param {object} jsonFromResource the ViewObjectNode is created from a json
     */
    function ViewObjectNode(id, left, top, width, height, zIndex, json) {
        var that = this;

        AbstractNode.call(this, id, ViewObjectNode.TYPE, left, top, width, height, zIndex, json);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(viewobjectNodeHtml, { type: that.getType() }));

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = AbstractNode.prototype.get$node.call(this).append(_$template).addClass("viewobject");

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
        this.toJSON = function () {
            return AbstractNode.prototype.toJSON.call(this);
        };

        this.createConditionListAttribute = function (refAttrs) {
            var targetAttrList = {};
            if (refAttrs && refAttrs.constructor.name === "RenamingListAttribute") {
                var attrs = refAttrs.getAttributes();
                for (var key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        targetAttrList[key] = attrs[key].getKey().getValue();
                    }
                }
            } else {
                for (var key in refAttrs) {
                    if (refAttrs.hasOwnProperty(key)) {
                        targetAttrList[key] = refAttrs[key].val.value;
                    }
                }
            }
            var conditionListAttr = new ConditionListAttribute("[condition]", "Conditions", that, targetAttrList, LogicalOperator);
            that.addAttribute(conditionListAttr);
            _$attributeNode.append(conditionListAttr.get$node());
            conditionListAttr.get$node().hide();
            return conditionListAttr;
        }

        this.registerYMap = function () {
            AbstractNode.prototype.registerYMap.call(this);
            that.getLabel().getValue().registerYType();
            renamingList.registerYMap();
            if (cla)
                cla.registerYMap();
            targetAttribute.getValue().registerYType();
            conjSelection.getValue().registerYType();
        };

        this.showAttributes = function () {
            if (renamingList.get$node().is(':hidden'))
                renamingList.get$node().show();
            if (conjSelection.get$node().is(':hidden'))
                conjSelection.get$node().show();
            if (cla.get$node().is(':hidden'))
                cla.get$node().show();
            if (!targetAttribute.get$node().is(':hidden'))
                targetAttribute.get$node().hide();
        }


        var targetAttribute, renamingList, conjSelection, cla;
        _$node.find(".label").append(this.getLabel().get$node());
        if (window.hasOwnProperty("y")) {
            var model = y.share.data.get('model');
            if (model) {
                var selectionValues = ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList2(model.nodes, ['Object']);
                targetAttribute = new SingleSelectionAttribute(id + "[target]", "Target", that, selectionValues);
                that.addAttribute(targetAttribute);
                _$attributeNode.prepend(targetAttribute.get$node());
            }
            if (json)
                cla = that.createConditionListAttribute(json.attributes['[attributes]'].list);
            else cla = that.createConditionListAttribute();
        }

        renamingList = new RenamingListAttribute("[attributes]", "Attributes", that, { "show": "Visible", "hide": "Hidden" });
        that.addAttribute(renamingList);
        _$attributeNode.append(renamingList.get$node());
        renamingList.get$node().hide();

        conjSelection = new SingleSelectionAttribute(id + '[conjunction]', 'Conjunction', that, LogicalConjunctions);
        that.addAttribute(conjSelection);
        _$attributeNode.append(conjSelection.get$node());
        conjSelection.get$node().hide();

        if(json && conjSelection && cla && renamingList && targetAttribute)
            that.showAttributes();

        this.setContextMenuItemCallback(function () {
            var NodeShapeNode = require('canvas_widget/NodeShapeNode'),
                BiDirAssociationEdge = require('canvas_widget/BiDirAssociationEdge'),
                UniDirAssociationEdge = require('canvas_widget/UniDirAssociationEdge');
            var viewId = $('#lblCurrentView').text();
            return {
                addShape: {
                    name: "Add Node Shape",
                    callback: function () {
                        var canvas = that.getCanvas(),
                            appearance = that.getAppearance(),
                            nodeId;

                        //noinspection JSAccessibilityCheck
                        canvas.createNode(NodeShapeNode.TYPE, appearance.left + appearance.width + 50, appearance.top, 150, 100).done(function (nodeId) {
                            canvas.createEdge(BiDirAssociationEdge.TYPE, that.getEntityId(), nodeId, null, null, viewId);
                        });
                    },
                    disabled: function () {
                        var edges = that.getEdges(),
                            edge,
                            edgeId;

                        for (edgeId in edges) {
                            if (edges.hasOwnProperty(edgeId)) {
                                edge = edges[edgeId];
                                if ((edge instanceof BiDirAssociationEdge &&
                                    (edge.getTarget() === that && edge.getSource() instanceof NodeShapeNode ||
                                        edge.getSource() === that && edge.getTarget() instanceof NodeShapeNode)) ||

                                    (edge instanceof UniDirAssociationEdge && edge.getTarget() instanceof NodeShapeNode)) {

                                    return true;
                                }
                            }
                        }
                        return false;
                    }
                },
                sep: "---------"
            };
        });

    }

    return ViewObjectNode;

});