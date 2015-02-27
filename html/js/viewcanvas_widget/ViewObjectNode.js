define([
    'require',
    'jqueryui',
    'jsplumb',
    'lodash',
    'canvas_widget/AbstractNode',
	'canvas_widget/SingleSelectionAttribute',
    'canvas_widget/KeySelectionValueSelectionValueListAttribute',
	'viewcanvas_widget/ConditionListAttribute',
	'viewcanvas_widget/ViewTypesUtil',
    'text!templates/viewcanvas_widget/viewobject_node.html'
],/** @lends ViewObjectNode */function(require,$,jsPlumb,_,AbstractNode,SingleSelectionAttribute,KeySelectionValueSelectionValueListAttribute,ConditionListAttribute,ViewTypesUtil,viewobjectNodeHtml) {

    ViewObjectNode.TYPE = "ViewObject";
    ViewObjectNode.DEFAULT_WIDTH = 150;
    ViewObjectNode.DEFAULT_HEIGHT = 100;

    ViewObjectNode.prototype = new AbstractNode();
    ViewObjectNode.prototype.constructor = ViewObjectNode;
    /**
     * ViewObjectNode
     * @class canvas_widget.ViewObjectNode
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
    function ViewObjectNode(id,left,top,width,height,zIndex){
        var that = this;

        AbstractNode.call(this,id,ViewObjectNode.TYPE,left,top,width,height,zIndex);

        /**
         * jQuery object of node template
         * @type {jQuery}
         * @private
         */
        var _$template = $(_.template(viewobjectNodeHtml,{type: that.getType()}));

        /**
         * jQuery object of DOM node representing the node
         * @type {jQuery}
         * @private
         */
        var _$node = AbstractNode.prototype.get$node.call(this).append(_$template).addClass("viewobject");

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
		ViewTypesUtil.GetCurrentBaseModel().then(function(model){
			var selectionValues = ViewTypesUtil.GetAllNodesOfBaseModelAsSelectionList2(model.nodes);
			var attribute = new SingleSelectionAttribute("[target]", "Target", that, selectionValues);
			that.addAttribute(attribute);
			that.get$node().find('.attributes').prepend(attribute.get$node());
		});
		        
		var attributeList = new KeySelectionValueSelectionValueListAttribute("[attributes]","Attributes",this,{"string":"String","boolean":"Boolean","integer":"Integer","file":"File"},{"show":"Visible","hide":"Hidden"});
		this.addAttribute(attributeList);
		       
		var attributeOfClass = {"testattr1":"attr1", "testattr2":"attr2"};
		var operators = {"greater":">", "smaller":"<", "equal":"==","greater_eq":">=","smaller_eq":"<=","nequal":"!="};
		var operators2 = {"AND":"&&", "OR":"||"};
		this.addAttribute(new ConditionListAttribute("[condition]", "Conditions", this, attributeOfClass, operators, operators2));
        
		
        _$node.find(".label").append(this.getLabel().get$node());

        for(var attributeKey in _attributes){
            if(_attributes.hasOwnProperty(attributeKey)){
                _$attributeNode.append(_attributes[attributeKey].get$node());
            }
        }

        this.setContextMenuItemCallback(function(){
            var NodeShapeNode = require('canvas_widget/NodeShapeNode'),
                BiDirAssociationEdge = require('canvas_widget/BiDirAssociationEdge'),
                UniDirAssociationEdge = require('canvas_widget/UniDirAssociationEdge');
            return {
                addShape: {
                    name: "Add Node Shape",
                        callback: function(){
                        var canvas = that.getCanvas(),
                            appearance = that.getAppearance(),
                            nodeId;

                        //noinspection JSAccessibilityCheck
                        nodeId = canvas.createNode(NodeShapeNode.TYPE,appearance.left + appearance.width + 50,appearance.top,150,100);
                        canvas.createEdge(BiDirAssociationEdge.TYPE,that.getEntityId(),nodeId);
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

    return ViewObjectNode;

});