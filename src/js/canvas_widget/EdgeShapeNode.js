define([
    'jqueryui',
    'jsplumb',
    'lodash',
    'canvas_widget/AbstractNode',
    'canvas_widget/SingleSelectionAttribute',
    'canvas_widget/SingleValueAttribute',
    'canvas_widget/SingleColorValueAttribute',
    'canvas_widget/SingleMultiLineValueAttribute',
    'canvas_widget/BooleanAttribute',
    'text!templates/canvas_widget/edge_shape_node.html'
],/** @lends EdgeShapeNode */function($,jsPlumb,_,AbstractNode,SingleSelectionAttribute,SingleValueAttribute,SingleColorValueAttribute,SingleMultiLineValueAttribute,BooleanAttribute,edgeShapeNodeHtml) {

    EdgeShapeNode.TYPE = "Edge Shape";
    EdgeShapeNode.DEFAULT_WIDTH = 150;
    EdgeShapeNode.DEFAULT_HEIGHT = 150;

    EdgeShapeNode.prototype = new AbstractNode();
    EdgeShapeNode.prototype.constructor = EdgeShapeNode;
    /**
     * Abstract Class Node
     * @class canvas_widget.EdgeShapeNode
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
    function EdgeShapeNode(id,left,top,width,height,zIndex, json){
        var that = this;

        AbstractNode.call(this,id,EdgeShapeNode.TYPE,left,top,width,height,zIndex, json);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(edgeShapeNodeHtml,{type: that.getType()}));

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
            json.type = EdgeShapeNode.TYPE;
            return json;
        };

        var attrArrow = new SingleSelectionAttribute(this.getEntityId()+"[arrow]","Arrow",this,{"bidirassociation":"---","unidirassociation":"-->","generalisation":"--▷","diamond":"-◁▷"});
        var attrShape = new SingleSelectionAttribute(this.getEntityId()+"[shape]","Shape",this,{"straight":"Straight","curved":"Curved","segmented":"Segmented"});
        var attrColor = new SingleColorValueAttribute(this.getEntityId()+"[color]","Color",this);
        var attrOverlay= new SingleValueAttribute(this.getEntityId()+"[overlay]","Overlay Text",this);
        var attrOverlayPos= new SingleSelectionAttribute(this.getEntityId()+"[overlayPosition]","Overlay Position",this,{"hidden":"Hide","top":"Top","center":"Center","bottom":"Bottom"});
        var attrOverlayRotate = new BooleanAttribute(this.getEntityId()+"[overlayRotate]","Autoflip Overlay",this);

        this.addAttribute(attrArrow);
        this.addAttribute(attrShape);
        this.addAttribute(attrColor);
        this.addAttribute(attrOverlay);
        this.addAttribute(attrOverlayPos);
        this.addAttribute(attrOverlayRotate);

        this.registerYMap = function(map,disableYText){
            AbstractNode.prototype.registerYMap.call(this,map);
            attrArrow.getValue().registerYType();
            attrShape.getValue().registerYType();
            attrOverlayPos.getValue().registerYType();
            attrOverlayRotate.getValue().registerYType();
            that.getLabel().getValue().registerYType();
            attrColor.getValue().registerYType();
            attrOverlay.getValue().registerYType();  
          
        };
      
        _$node.find(".label").append(this.getLabel().get$node());

        for(var attributeKey in _attributes){
            if(_attributes.hasOwnProperty(attributeKey)){
                _$attributeNode.append(_attributes[attributeKey].get$node());
            }
        }

    }

    return EdgeShapeNode;

});