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
    function ViewObjectNode(id, left, top, width, height,json) {
        var that = this;

        var _fromResource = json;

        AbstractNode.call(this, id, ViewObjectNode.TYPE, left, top, width, height);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(objectNodeHtml, {type:'ViewObject'}));

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

        var attributeList = new RenamingListAttribute("[attributes]", "Attributes", this,  {
            "show" : "Visible",
            "hide" : "Hidden"
        });
        this.addAttribute(attributeList);

        var model = y.share.data.get('model');
        var selectionValues = ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList2(model.nodes, ['Object']);
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
                    var attrList = _fromResource.attributes['[attributes]'].list;
                    var targetAttrList = {};
                    for (var attrKey in attrList) {
                        if (attrList.hasOwnProperty(attrKey)) {
                            targetAttrList[attrKey] = attrList[attrKey].val.value;
                        }
                    }
                    var cla = new ConditionListAttribute("[condition]", "Conditions", that, targetAttrList, LogicalOperator);
                    cla.setValueFromJSON(conditionList);
                    that.addAttribute(cla);
                    that.get$node().find('.attributes').append(cla.get$node());
                }
            }
            _fromResource = null;
        }
        that.addAttribute(attribute);
        that.get$node().find('.attributes').prepend(attribute.get$node());

        _$node.find(".label").append(this.getLabel().get$node());

        for (var attributeKey in _attributes) {
            if (_attributes.hasOwnProperty(attributeKey)) {
                _$attributeNode.append(_attributes[attributeKey].get$node());
            }
        }

        this.registerYType = function(){
            var registerValue = function(ymap, value){
                ymap.get(value.getEntityId()).then(function(ytext){
                    value.registerYType(ytext);
                })
            };

            AbstractNode.prototype.registerYType.call(this);
            y.share.nodes.get(that.getEntityId()).then(function(ymap){
                var attrs = _attributes["[attributes]"].getAttributes();
                for(var attributeKey in attrs){
                    if(attrs.hasOwnProperty(attributeKey)){
                        var attr = attrs[attributeKey];
                        registerValue(ymap,attr.getKey());
                    }
                }

                if(_attributes['[condition]']) {
                    var conditions = _attributes['[condition]'].getAttributes();
                    for (var attrKey4 in conditions) {
                        if (conditions.hasOwnProperty(attrKey4)) {
                            attr = conditions[attrKey4];
                            registerValue(ymap, attr.getKey());
                        }
                    }
                }
            });
        };
    }

    return ViewObjectNode;

});
