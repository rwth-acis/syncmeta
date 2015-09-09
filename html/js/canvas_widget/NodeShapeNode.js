define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'canvas_widget/AbstractNode',
    'canvas_widget/SingleSelectionAttribute',
    'canvas_widget/SingleValueAttribute',
    'canvas_widget/IntegerAttribute',
    'canvas_widget/SingleColorValueAttribute',
    'canvas_widget/SingleMultiLineValueAttribute',
    'text!templates/canvas_widget/node_shape_node.html'
],/** @lends NodeShapeNode */function($,jsPlumb,_,AbstractNode,SingleSelectionAttribute,SingleValueAttribute,IntegerAttribute,SingleColorValueAttribute,SingleMultiLineValueAttribute,nodeShapeNodeHtml) {

    NodeShapeNode.TYPE = "Node Shape";
    NodeShapeNode.DEFAULT_WIDTH = 150;
    NodeShapeNode.DEFAULT_HEIGHT = 150;

    NodeShapeNode.prototype = new AbstractNode();
    NodeShapeNode.prototype.constructor = NodeShapeNode;
    /**
     * Abstract Class Node
     * @class canvas_widget.NodeShapeNode
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
    function NodeShapeNode(id,left,top,width,height,zIndex){
        var that = this;

        AbstractNode.call(this,id,NodeShapeNode.TYPE,left,top,width,height,zIndex);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(nodeShapeNodeHtml,{type: that.getType()}));

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = AbstractNode.prototype.get$node.call(this).append(_$template).addClass("class");

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
        this.toJSON = function(){
            var json = AbstractNode.prototype.toJSON.call(this);
            json.type = NodeShapeNode.TYPE;
            return json;
        };

        this.addAttribute(new SingleSelectionAttribute(this.getEntityId()+"[shape]","Shape",this,{"circle":"Circle","diamond":"Diamond","rectangle":"Rectangle","rounded_rectangle":"Rounded Rectangle","triangle":"Triangle"}));
        this.addAttribute(new SingleColorValueAttribute(this.getEntityId()+"[color]","Color",this));
        this.addAttribute(new IntegerAttribute(this.getEntityId()+"[defaultWidth]","Default Width",this));
        this.addAttribute(new IntegerAttribute(this.getEntityId()+"[defaultHeight]","Default Height",this));
        this.addAttribute(new SingleMultiLineValueAttribute(this.getEntityId()+"[customShape]","Custom Shape",this));
        this.addAttribute(new SingleValueAttribute(this.getEntityId()+"[customAnchors]","Custom Anchors",this));

        _$node.find(".label").append(this.getLabel().get$node());

        for(var attributeKey in _attributes){
            if(_attributes.hasOwnProperty(attributeKey)){
                _$attributeNode.append(_attributes[attributeKey].get$node());
            }
        }

    }

    return NodeShapeNode;

});