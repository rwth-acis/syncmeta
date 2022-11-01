import $ from 'jqueryui';
import jsPlumb from 'jsplumb';
import _ from 'lodash';
import AbstractNode from 'attribute_widget/AbstractNode';
import BooleanAttribute from 'attribute_widget/BooleanAttribute';
import IntegerAttribute from 'attribute_widget/IntegerAttribute';
import FileAttribute from 'attribute_widget/FileAttribute';
import SingleValueAttribute from 'attribute_widget/SingleValueAttribute';
import SingleSelectionAttribute from 'attribute_widget/SingleSelectionAttribute';
import SingleMultiLineValueAttribute from 'attribute_widget/SingleMultiLineValueAttribute';
import modelAttributesNodeHtml from 'text!templates/attribute_widget/model_attributes_node.html';

    ModelAttributesNode.TYPE = "ModelAttributesNode";

    ModelAttributesNode.prototype = new AbstractNode();
    ModelAttributesNode.prototype.constructor = ModelAttributesNode;
    /**
     * Abstract Class Node
     * @class attribute_widget.ModelAttributesNode
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractNode
     * @constructor
     * @param {string} id Entity identifier of node
     * @param {object} [attr] model attributes
     */
    function ModelAttributesNode(id, attr) {

        AbstractNode.call(this, id, ModelAttributesNode.TYPE, 0, 0, 0, 0);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(modelAttributesNodeHtml)());

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
        var attributes = this.getAttributes();

        if (attr) {
            if (_.size(attr) === 0) {
                _$node.children().hide();
            }
            for (var attrKey in attr) {
                if (attr.hasOwnProperty(attrKey)) {
                    switch (attr[attrKey].value) {
                        case "boolean":
                            this.addAttribute(new BooleanAttribute(this.getEntityId() + "[" + attr[attrKey].key.toLowerCase() + "]", attr[attrKey].key, this));
                            break;
                        case "string":
                            this.addAttribute(new SingleValueAttribute(this.getEntityId() + "[" + attr[attrKey].key.toLowerCase() + "]", attr[attrKey].key, this));
                            break;
                        case "integer":
                            this.addAttribute(new IntegerAttribute(this.getEntityId() + "[" + attr[attrKey].key.toLowerCase() + "]", attr[attrKey].key, this));
                            break;
                        case "file":
                            this.addAttribute(new FileAttribute(this.getEntityId() + "[" + attr[attrKey].key.toLowerCase() + "]", attr[attrKey].key, this));
                            break;
                        default:
                            if (attr[attrKey].options) {
                                this.addAttribute(new SingleSelectionAttribute(this.getEntityId() + "[" + attr[attrKey].key.toLowerCase() + "]", attr[attrKey].key, this, attr[attrKey].options));
                            }
                            break;
                    }
                }
            }
        } else {
            this.addAttribute(new SingleValueAttribute(this.getEntityId() + "[name]", "Name", this));
            this.addAttribute(new SingleMultiLineValueAttribute(this.getEntityId() + "[description]", "Description", this));
        }

        this.registerYType = function () {
            var attrs = this.getAttributes();
            for (var key in attrs) {
                if (attrs.hasOwnProperty(key)) {
                    var val = attrs[key].getValue();
                    if (val.constructor.name === "Value" || val.constructor.name === "MultiLineValue") {
                        const nodesMap = y.getMap("nodes");
                        var ymap = nodesMap.get(this.getEntityId());
                        var ytext = ymap.get(val.getEntityId());
                        val.registerYType(ytext);
                    }
                }
            }
        };

        _$node.find(".label").hide();

        for (var attributeKey in attributes) {
            if (attributes.hasOwnProperty(attributeKey)) {
                _$attributeNode.append(attributes[attributeKey].get$node());
            }
        }
    }

    export default ModelAttributesNode;

