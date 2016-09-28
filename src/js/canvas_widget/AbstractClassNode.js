define([
    'require',
    'jqueryui',
    'jsplumb',
    'lodash',
    'canvas_widget/AbstractNode',
    'canvas_widget/KeySelectionValueListAttribute',
    'canvas_widget/BooleanAttribute',
    'canvas_widget/SingleMultiLineValueAttribute',
    'text!templates/canvas_widget/abstract_class_node.html'
],/** @lends AbstractClassNode */function(require,$,jsPlumb,_,AbstractNode,KeySelectionValueListAttribute,BooleanAttribute,SingleMultiLineValueAttribute,abstractClassNodeHtml) {

    AbstractClassNode.TYPE = "Abstract Class";
    AbstractClassNode.DEFAULT_WIDTH = 150;
    AbstractClassNode.DEFAULT_HEIGHT = 100;

    AbstractClassNode.prototype = new AbstractNode();
    AbstractClassNode.prototype.constructor = AbstractClassNode;
    /**
     * Abstract Class Node
     * @class canvas_widget.AbstractClassNode
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
    function AbstractClassNode(id,left,top,width,height,zIndex){
        var that = this;

        AbstractNode.call(this,id,AbstractClassNode.TYPE,left,top,width,height,zIndex);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(abstractClassNodeHtml,{type: that.getType()}));

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
            json.type = AbstractClassNode.TYPE;
            return json;
        };

        var attr= new KeySelectionValueListAttribute("[attributes]","Attributes",this,{"string":"String","boolean":"Boolean","integer":"Integer","file":"File"});
        this.addAttribute(attr);

        this.registerYMap = function(){
            AbstractNode.prototype.registerYMap.call(this);
            that.getLabel().getValue().registerYType();
            attr.registerYMap();
        };

        _$node.find(".label").append(this.getLabel().get$node());

        for(var attributeKey in _attributes){
            if(_attributes.hasOwnProperty(attributeKey)){
                _$attributeNode.append(_attributes[attributeKey].get$node());
            }
        }

        this.setContextMenuItemCallback(function(){
            return {
                convertTo: {
                    name: "Convert to..",
                    items: {
                        objectNode: {
                            name: "..Object",
                            callback: function(){
                                var canvas = that.getCanvas(),
                                    appearance = that.getAppearance(),
                                    nodeId;

                                //noinspection JSAccessibilityCheck
                                nodeId = canvas.createNode(require('canvas_widget/ObjectNode').TYPE,appearance.left,appearance.top,appearance.width,appearance.height,that.getZIndex(),that.toJSON());
                                var edges = that.getOutgoingEdges(),
                                    edge,
                                    edgeId;

                                for(edgeId in edges){
                                    if(edges.hasOwnProperty(edgeId)){
                                        edge = edges[edgeId];
                                        canvas.createEdge(edge.getType(),nodeId,edge.getTarget().getEntityId(),edge.toJSON());
                                    }
                                }

                                edges = that.getIngoingEdges();

                                for(edgeId in edges){
                                    if(edges.hasOwnProperty(edgeId)){
                                        edge = edges[edgeId];
                                        if(edge.getSource() !== edge.getTarget()){
                                            canvas.createEdge(edge.getType(),edge.getSource().getEntityId(),nodeId,edge.toJSON());
                                        }
                                    }
                                }

                                that.triggerDeletion();

                            }
                        },
                        relationshipNode: {
                            name: "..Relationship",
                            callback: function(){
                                var canvas = that.getCanvas(),
                                    appearance = that.getAppearance(),
                                    nodeId;

                                //noinspection JSAccessibilityCheck
                                nodeId = canvas.createNode(require('canvas_widget/RelationshipNode').TYPE,appearance.left,appearance.top,appearance.width,appearance.height,that.getZIndex(),that.toJSON());
                                var edges = that.getOutgoingEdges(),
                                    edge,
                                    edgeId;

                                for(edgeId in edges){
                                    if(edges.hasOwnProperty(edgeId)){
                                        edge = edges[edgeId];
                                        canvas.createEdge(edge.getType(),nodeId,edge.getTarget().getEntityId(),edge.toJSON());
                                    }
                                }

                                edges = that.getIngoingEdges();

                                for(edgeId in edges){
                                    if(edges.hasOwnProperty(edgeId)){
                                        edge = edges[edgeId];
                                        if(edge.getSource() !== edge.getTarget()){
                                            canvas.createEdge(edge.getType(),edge.getSource().getEntityId(),nodeId,edge.toJSON());
                                        }
                                    }
                                }

                                that.triggerDeletion();

                            }
                        },
                        relationshipGroupNode: {
                            name: "..Relationship Group",
                            callback: function(){
                                var canvas = that.getCanvas(),
                                    appearance = that.getAppearance(),
                                    nodeId;

                                //noinspection JSAccessibilityCheck
                                nodeId = canvas.createNode(require('canvas_widget/RelationshipGroupNode').TYPE,appearance.left,appearance.top,appearance.width,appearance.height,that.getZIndex(),that.toJSON());
                                var edges = that.getOutgoingEdges(),
                                    edge,
                                    edgeId;

                                for(edgeId in edges){
                                    if(edges.hasOwnProperty(edgeId)){
                                        edge = edges[edgeId];
                                        canvas.createEdge(edge.getType(),nodeId,edge.getTarget().getEntityId(),edge.toJSON());
                                    }
                                }

                                edges = that.getIngoingEdges();

                                for(edgeId in edges){
                                    if(edges.hasOwnProperty(edgeId)){
                                        edge = edges[edgeId];
                                        if(edge.getSource() !== edge.getTarget()){
                                            canvas.createEdge(edge.getType(),edge.getSource().getEntityId(),nodeId,edge.toJSON());
                                        }
                                    }
                                }

                                that.triggerDeletion();

                            }
                        }
                    }
                },
                sep: "---------"
            };

        });

    }

    return AbstractClassNode;

});