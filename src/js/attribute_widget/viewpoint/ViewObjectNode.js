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

            var _fromResource = json;

            AbstractNode.call(this, id, ViewObjectNode.TYPE, left, top, width, height);

            /**
             * jQuery object of node template
             * @type {jQuery}
             * @private
             */
            var _$template = $(_.template(objectNodeHtml, { type: 'ViewObject' }));

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
                return conditionListAttr;
            }

            var targetAttribute, renamingList, conjSelection, cla;
            var model = y.share.data.get('model');
            if (model) {
                var selectionValues = ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList2(model.nodes, ['Object']);
                targetAttribute = new SingleSelectionAttribute(id + "[target]", "Target", that, selectionValues);
                that.addAttribute(targetAttribute);
                _$attributeNode.prepend(targetAttribute.get$node());

                renamingList = new RenamingListAttribute("[attributes]", "Attributes", this, { "show": "Visible", "hide": "Hidden" });
                that.addAttribute(renamingList);
                _$attributeNode.append(renamingList.get$node());

                conjSelection = new SingleSelectionAttribute(id + '[conjunction]', 'Conjunction', that, LogicalConjunctions);
                that.addAttribute(conjSelection);
                _$attributeNode.append(conjSelection.get$node());

                cla = that.createConditionListAttribute();
            }

            
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
