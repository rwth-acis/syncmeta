define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'attribute_widget/AbstractNode',
    'attribute_widget/SingleSelectionAttribute',
    'attribute_widget/SingleValueAttribute',
    'attribute_widget/IntegerAttribute',
    'attribute_widget/SingleColorValueAttribute',
    'attribute_widget/SingleMultiLineValueAttribute',
    'text!templates/attribute_widget/node_shape_node.html'
],/** @lends NodeShapeNode */function($,jsPlumb,_,AbstractNode,SingleSelectionAttribute,SingleValueAttribute,IntegerAttribute,SingleColorValueAttribute,SingleMultiLineValueAttribute,nodeShapeNodeHtml) {

    NodeShapeNode.TYPE = "Node Shape";

    NodeShapeNode.prototype = new AbstractNode();
    NodeShapeNode.prototype.constructor = NodeShapeNode;
    /**
     * Abstract Class Node
     * @class attribute_widget.NodeShapeNode
     * @memberof attribute_widget
     * @extends attribute_widget.AbstractNode
     * @constructor
     * @param {string} id Entity identifier of node
     * @param {number} left x-coordinate of node position
     * @param {number} top y-coordinate of node position
     * @param {number} width Width of node
     * @param {number} height Height of node
     */
    function NodeShapeNode(id,left,top,width,height){

        var that = this;

        AbstractNode.call(this,id,NodeShapeNode.TYPE,left,top,width,height);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(nodeShapeNodeHtml,{}));

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
        var $attributeNode = _$node.find(".attributes");

        /**
         * Attributes of node
         * @type {Object}
         * @private
         */
        var attributes = this.getAttributes();

        this.addAttribute(new SingleSelectionAttribute(this.getEntityId()+"[shape]","Shape",this,{"circle":"Circle","diamond":"Diamond","rectangle":"Rectangle","rounded_rectangle":"Rounded Rectangle","triangle":"Triangle"}));
        this.addAttribute(new SingleColorValueAttribute(this.getEntityId()+"[color]","Color",this));
        this.addAttribute(new IntegerAttribute(this.getEntityId()+"[defaultWidth]","Default Width",this));
        this.addAttribute(new IntegerAttribute(this.getEntityId()+"[defaultHeight]","Default Height",this));
        this.addAttribute(new SingleMultiLineValueAttribute(this.getEntityId()+"[customShape]","Custom Shape",this));
        this.addAttribute(new SingleValueAttribute(this.getEntityId()+"[customAnchors]","Custom Anchors",this));

        _$node.find(".label").append(this.getLabel().get$node());

        this.registerYType = function(){
            var registerValue = function(ymap, value){
                ymap.get(value.getEntityId()).then(function(ytext){
                    value.registerYType(ytext);
                })
            };

            AbstractNode.prototype.registerYType.call(this);
            y.share.nodes.get(that.getEntityId()).then(function(ymap){
                var colorAttr = that.getAttribute(that.getEntityId()+'[color]');
                registerValue(ymap, colorAttr.getValue());

                var customShapeAttr = that.getAttribute(that.getEntityId()+"[customShape]");
                registerValue(ymap, customShapeAttr.getValue());

                var customAnchorAttr = that.getAttribute(that.getEntityId()+"[customAnchors]");
                registerValue(ymap, customShapeAttr.getValue());
            });
        };

        for(var attributeKey in attributes){
            if(attributes.hasOwnProperty(attributeKey)){
                $attributeNode.append(attributes[attributeKey].get$node());
            }
        }
    }

    return NodeShapeNode;

});