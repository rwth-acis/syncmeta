import require from 'require';
import $ from 'jqueryui';
import jsPlumb from 'jsplumb';
import _ from 'lodash';
import AbstractNode from 'canvas_widget/AbstractNode';
import KeySelectionValueListAttribute from 'canvas_widget/KeySelectionValueListAttribute';
import objectNodeHtml from 'text!templates/canvas_widget/object_node.html';
import $__canvas_widget_NodeShapeNode from 'canvas_widget/NodeShapeNode';
import $__canvas_widget_BiDirAssociationEdge from 'canvas_widget/BiDirAssociationEdge';
import $__canvas_widget_UniDirAssociationEdge from 'canvas_widget/UniDirAssociationEdge';
import $__canvas_widget_AbstractClassNode from 'canvas_widget/AbstractClassNode';
import $__canvas_widget_RelationshipNode from 'canvas_widget/RelationshipNode';
import $__canvas_widget_RelationshipGroupNode from 'canvas_widget/RelationshipGroupNode';

    ObjectNode.TYPE = "Object";
    ObjectNode.DEFAULT_WIDTH = 150;
    ObjectNode.DEFAULT_HEIGHT = 100;

    ObjectNode.prototype = new AbstractNode();
    ObjectNode.prototype.constructor = ObjectNode;
    /**
     * ObjectNode
     * @class canvas_widget.ObjectNode
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
    function ObjectNode(id,left,top,width,height,zIndex, json){
        var that = this;

        AbstractNode.call(this,id,ObjectNode.TYPE,left,top,width,height,zIndex,json);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(objectNodeHtml)({type: that.getType()}));

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = AbstractNode.prototype.get$node.call(this).append(_$template).addClass("object");

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
            return AbstractNode.prototype.toJSON.call(this);
        };
        var attr = new KeySelectionValueListAttribute("[attributes]","Attributes",this,{"string":"String","boolean":"Boolean","integer":"Integer","file":"File" , "quiz":"Questions"});
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
        
        this.unregisterCallbacks = function(){
            that.getAttribute('[attributes]').unregisterCallbacks();
        }
        
        this.setContextMenuItemCallback(function(){
            var NodeShapeNode = $__canvas_widget_NodeShapeNode,
                BiDirAssociationEdge = $__canvas_widget_BiDirAssociationEdge,
                UniDirAssociationEdge = $__canvas_widget_UniDirAssociationEdge;
            return {
                addShape: {
                    name: "Add Node Shape",
                    callback: function(){
                        var canvas = that.getCanvas(),
                            appearance = that.getAppearance(),
                            nodeId;

                        //noinspection JSAccessibilityCheck
                        canvas.createNode(NodeShapeNode.TYPE,appearance.left + appearance.width + 50,appearance.top,150,100).done(function(nodeId){
                            canvas.createEdge(BiDirAssociationEdge.TYPE,that.getEntityId(),nodeId);
                        });
                    },
                    disabled: function() {
                        var edges = that.getEdges(),
                            edge,
                            edgeId;

                        for(edgeId in edges){
                            if(edges.hasOwnProperty(edgeId)){
                                edge = edges[edgeId];
                                if( (edge instanceof BiDirAssociationEdge &&
                                    (edge.getTarget() === that && edge.getSource() instanceof NodeShapeNode ||
                                    edge.getSource() === that && edge.getTarget() instanceof NodeShapeNode)) ||

                                    (edge instanceof UniDirAssociationEdge && edge.getTarget() instanceof NodeShapeNode) ){

                                    return true;
                                }
                            }
                        }
                        return false;
                    }
                },
                sepConvertTo: "---------",
                convertTo: {
                    name: "Convert to..",
                    items: {
                        abstractClassNode: {
                            name: "..Abstract Class",
                            callback: function(){
                                var canvas = that.getCanvas(),
                                    appearance = that.getAppearance(),
                                    nodeId;

                                //noinspection JSAccessibilityCheck
                                nodeId = canvas.createNode($__canvas_widget_AbstractClassNode.TYPE,appearance.left,appearance.top,appearance.width,appearance.height,that.getZIndex(),that.toJSON());
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
                                nodeId = canvas.createNode($__canvas_widget_RelationshipNode.TYPE,appearance.left,appearance.top,appearance.width,appearance.height,that.getZIndex(),that.toJSON());
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
                                nodeId = canvas.createNode($__canvas_widget_RelationshipGroupNode.TYPE,appearance.left,appearance.top,appearance.width,appearance.height,that.getZIndex(),that.toJSON());
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

    export default ObjectNode;
