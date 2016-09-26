define([
    'require',
    'jqueryui',
    'jsplumb',
    'lodash',
    'canvas_widget/AbstractNode',
    'canvas_widget/SingleSelectionAttribute',
    'canvas_widget/KeySelectionValueSelectionValueListAttribute',
    'text!templates/canvas_widget/relationship_node.html'
],/** @lends RelationshipNode */function(require,$,jsPlumb,_,AbstractNode,SingleSelectionAttribute,KeySelectionValueSelectionValueListAttribute,relationshipNodeHtml) {

    RelationshipNode.TYPE = "Relationship";
    RelationshipNode.DEFAULT_WIDTH = 150;
    RelationshipNode.DEFAULT_HEIGHT = 100;

    RelationshipNode.prototype = new AbstractNode();
    RelationshipNode.prototype.constructor = RelationshipNode;
    /**
     * RelationshipNode
     * @class canvas_widget.RelationshipNode
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
    function RelationshipNode(id,left,top,width,height,zIndex){
        var that = this;

        AbstractNode.call(this,id,RelationshipNode.TYPE,left,top,width,height,zIndex);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(relationshipNodeHtml,{type: that.getType()}));

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var $node = AbstractNode.prototype.get$node.call(this).append(_$template).addClass("relation");

        /**
         * jQuery object of DOM node representing the attributes
         * @type {jQuery}
         * @private
         */
        var _$attributeNode = $node.find(".attributes");

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

        var attr=new KeySelectionValueSelectionValueListAttribute("[attributes]","Attributes",this,{"string":"String","boolean":"Boolean","integer":"Integer","file":"File"},{"hidden":"Hide","top":"Top","center":"Center","bottom":"Bottom"});
        this.addAttribute(attr);

        this.registerYMap = function(map, disableYText){
            AbstractNode.prototype.registerYMap.call(this,map);
            if(!disableYText)
                registerYTextAttributes(map);
            attr.registerYMap(map,disableYText);


        };

        function registerYTextAttributes(map){
            map.get(that.getLabel().getValue().getEntityId()).then(function(ytext){
                that.getLabel().getValue().registerYType(ytext);
            });
        }

        $node.find(".label").append(this.getLabel().get$node());

        for(var attributeKey in _attributes){
            if(_attributes.hasOwnProperty(attributeKey)){
                _$attributeNode.append(_attributes[attributeKey].get$node());
            }
        }

        this.setContextMenuItemCallback(function(){
            var EdgeShapeNode = require('canvas_widget/EdgeShapeNode'),
                BiDirAssociationEdge = require('canvas_widget/BiDirAssociationEdge'),
                UniDirAssociationEdge = require('canvas_widget/UniDirAssociationEdge');
            return {
                addShape: {
                    name: "Add Edge Shape",
                    callback: function(){
                        var canvas = that.getCanvas(),
                            appearance = that.getAppearance(),
                            nodeId;

                        //noinspection JSAccessibilityCheck
                        canvas.createNode(EdgeShapeNode.TYPE,appearance.left + appearance.width + 50,appearance.top,150,100).done(function(nodeId){
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
                                    (edge.getTarget() === that && edge.getSource() instanceof EdgeShapeNode ||
                                    edge.getSource() === that && edge.getTarget() instanceof EdgeShapeNode)) ||

                                    (edge instanceof UniDirAssociationEdge && edge.getTarget() instanceof EdgeShapeNode) ){

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
                        abstractNode: {
                            name: "..Abstract Class Node",
                            callback: function(){
                                var canvas = that.getCanvas(),
                                    appearance = that.getAppearance(),
                                    nodeId;

                                //noinspection JSAccessibilityCheck
                                nodeId = canvas.createNode(require('canvas_widget/AbstractClassNode').TYPE,appearance.left,appearance.top,appearance.width,appearance.height,that.getZIndex(),that.toJSON());
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
                        objectNode: {
                            name: "..Object Node",
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

    return RelationshipNode;

});