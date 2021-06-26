define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'attribute_widget/AbstractNode',
    'attribute_widget/viewpoint/RenamingListAttribute',
    'attribute_widget/SingleSelectionAttribute',
    'attribute_widget/viewpoint/ConditionListAttribute',
    'canvas_widget/viewpoint/ViewTypesUtil',
    'canvas_widget/viewpoint/LogicalOperator',
    'canvas_widget/viewpoint/LogicalConjunctions',
    'text!templates/attribute_widget/object_node.html'
], /** @lends ViewObjectNode */
    function ($, jsPlumb, _, AbstractNode, RenamingListAttribute, SingleSelectionAttribute, ConditionListAttribute, ViewTypesUtil, LogicalOperator, LogicalConjunctions, objectNodeHtml) {

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
         * @param {object} json the json representation
         */
        function ViewObjectNode(id, left, top, width, height, json) {
            var that = this;

            AbstractNode.call(this, id, ViewObjectNode.TYPE, left, top, width, height, json);

            /**
             * jQuery object of node template
             * @type {jQuery}
             * @private
             */
            var _$template = $(_.template(objectNodeHtml)({ type: 'ViewObject' }));

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

            var targetAttribute, renamingList, conjSelection, cla;

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

            _$node.find(".label").append(this.getLabel().get$node());
            var model = y.share.data.get('model');
            if (model) {
                var selectionValues = ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList2(model.nodes, ['Object']);
                targetAttribute = new SingleSelectionAttribute(id + "[target]", "Target", that, selectionValues);
                that.addAttribute(targetAttribute);
                _$attributeNode.prepend(targetAttribute.get$node());

                renamingList = new RenamingListAttribute("[attributes]", "Attributes", that, { "show": "Visible", "hide": "Hidden" });
                that.addAttribute(renamingList);
                _$attributeNode.append(renamingList.get$node());
                renamingList.get$node().hide();

                conjSelection = new SingleSelectionAttribute(id + '[conjunction]', 'Conjunction', that, LogicalConjunctions);
                that.addAttribute(conjSelection);
                _$attributeNode.append(conjSelection.get$node());
                conjSelection.get$node().hide();

                if (json) {
                    cla = that.createConditionListAttribute(json.attributes['[attributes]'].list);
                    that.showAttributes();
                    targetAttribute.get$node().hide();
                }
                else cla = that.createConditionListAttribute();

            }

            /**
            * register the y-object to enable NRT collaboration
            */
            this.registerYType = function () {
                AbstractNode.prototype.registerYType.call(this);
                var ymap = y.share.nodes.get(that.getEntityId());
                var attrs = _attributes["[attributes]"].getAttributes();
                for (var attributeKey in attrs) {
                    if (attrs.hasOwnProperty(attributeKey)) {
                        var keyVal = attrs[attributeKey].getKey();
                        var ytext = ymap.get(keyVal.getEntityId());
                        keyVal.registerYType(ytext);
                    }
                }

                if (_attributes['[condition]']) {
                    var conditions = _attributes['[condition]'].getAttributes();
                    for (var attrKey4 in conditions) {
                        if (conditions.hasOwnProperty(attrKey4)) {
                            var keyVal = attrs[attributeKey].getKey();
                            var ytext = ymap.get(keyVal.getEntityId());
                            keyVal.registerYType(ytext);
                        }
                    }
                }
            };
        }

        return ViewObjectNode;

    });
