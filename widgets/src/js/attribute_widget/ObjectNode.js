define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'attribute_widget/AbstractNode',
    'attribute_widget/KeySelectionValueListAttribute',
    'text!templates/attribute_widget/object_node.html'
],/** @lends ObjectNode */function($, jsPlumb, _, AbstractNode, KeySelectionValueListAttribute, objectNodeHtml) {

    ObjectNode.TYPE = "Object";

    ObjectNode.prototype = new AbstractNode();
    ObjectNode.prototype.constructor = ObjectNode;
    /**
     * ObjectNode
     * @class attribute_widget.ObjectNode
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractNode
     * @constructor
     * @param {string} id Entity identifier of node
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     */
    function ObjectNode(id, left, top, width, height) {
        var that = this;
        AbstractNode.call(this, id, ObjectNode.TYPE, left, top, width, height);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(objectNodeHtml)({ type: "Object" }));

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

        this.registerYType = function() {
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
        };
        
        this.remove  = function(){
            AbstractNode.prototype.remove.call(this);
            this.getAttribute('[attributes]').unregisterCallbacks();
        }
        
        this.addAttribute(new KeySelectionValueListAttribute("[attributes]", "Attributes", this, { "string": "String", "boolean": "Boolean", "integer": "Integer", "file": "File" , "quiz": "Questions"}));

        _$node.find(".label").append(this.getLabel().get$node());

        for (var attributeKey in _attributes) {
            if (_attributes.hasOwnProperty(attributeKey)) {
                _$attributeNode.append(_attributes[attributeKey].get$node());
            }
        }
    }

    return ObjectNode;

});