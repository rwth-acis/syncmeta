define(['lodash',
		'attribute_widget/Node',
		'attribute_widget/ObjectNode',
		'attribute_widget/AbstractClassNode',
		'attribute_widget/RelationshipNode',
		'attribute_widget/RelationshipGroupNode',
		'attribute_widget/EnumNode',
		'attribute_widget/NodeShapeNode',
		'attribute_widget/EdgeShapeNode',
		'attribute_widget/ModelAttributesNode',
		'attribute_widget/Edge',
		'attribute_widget/GeneralisationEdge',
		'attribute_widget/BiDirAssociationEdge',
		'attribute_widget/UniDirAssociationEdge',
		'attribute_widget/viewpoint/ViewObjectNode',
		'attribute_widget/viewpoint/ViewRelationshipNode',
        'attribute_widget/view/ViewNode',
        'attribute_widget/view/ViewEdge'
], /** @lends EntityManager */
	function (_, Node, ObjectNode, AbstractClassNode, RelationshipNode, RelationshipGroupNode, EnumNode, NodeShapeNode, EdgeShapeNode, ModelAttributesNode, Edge, GeneralisationEdge, BiDirAssociationEdge, UniDirAssociationEdge, ViewObjectNode, ViewRelationshipNode, ViewNode, ViewEdge) {


	/**
	 * EntityManager
	 * @class attribute_widget.EntityManager
	 * @memberof attribute_widget
	 * @constructor
	 */
	function EntityManager() {

        var metamodel = null;

        var _layer = null;

        /**
         * Different node types
         * @type {object}
         */
        var nodeTypes = {};
        /**
         * Different edge types
         * @type {object}
         */
        var edgeTypes = {};
        var relations = {};

        var _initNodeTypes = function(vls) {
            var nodes = vls.nodes,
                node;
            var _nodeTypes = {};
            for (var nodeId in nodes) {
                if (nodes.hasOwnProperty(nodeId)) {
                    node = nodes[nodeId];
                    if (node.hasOwnProperty('targetName') && !$.isEmptyObject(nodeTypes) && nodeTypes.hasOwnProperty(node.targetName)) {
                        _nodeTypes[node.label] = ViewNode(node.label, node.attributes, nodeTypes[node.targetName]);
                        nodeTypes[node.targetName].VIEWTYPE = node.label;
                    }
                    else {
                        _nodeTypes[node.label] = Node(node.label, node.shape.shape, node.shape.customShape, node.shape.customAnchors, node.shape.color, node.attributes);
                    }
                }
            }
            return _nodeTypes;
        };
        var _initEdgeTypes = function(vls){
            var edges = vls.edges,
                edge;
            var _edgeTypes = {}, _relations = {};

            for (var edgeId in edges) {
                if (edges.hasOwnProperty(edgeId)) {
                    edge = edges[edgeId];
                    if(edge.hasOwnProperty('targetName') && !$.isEmptyObject(edgeTypes) && edgeTypes.hasOwnProperty(edge.targetName)){
                        _edgeTypes[edge.label] = ViewEdge(edge.attributes, edgeTypes[edge.targetName]);
                        edgeTypes[edge.targetName].VIEWTYPE = edge.label;
                    }else {
                        _edgeTypes[edge.label] = Edge(edge.label, edge.shape.arrow, edge.shape.shape, edge.shape.color, edge.shape.overlay, edge.shape.overlayPosition, edge.shape.overlayRotate, edge.attributes);
                    }
                    _relations[edge.label] = edge.relations;
                }
            }
            return {
                edgeTypes:_edgeTypes,
                relations:_relations
            }
        };

        /**
		 * Model attributes node
		 * @type {attribute_widget.ModelAttributesNode}
		 */
		var _modelAttributesNode = null;
		/**
		 * Nodes of the graph
		 * @type {{}}
		 */
		var _nodes = {};
		/**
		 * Edges of the graph
		 * @type {{}}
		 */

        var _map ={};

        /**
         * the view id indicates if the EntityManager should use View types for modeling or node types
         * @type {string}
         * @private
         */
        var viewId = null;

        /**
         * contains all view node types of the current view
         * @type {{}}
         */
        var viewNodeTypes = {};

        /**
         * contains all view edge types of the current view
         * @type {{}}
         */
        var viewEdgeTypes = {};

		var _edges = {};
		
		//noinspection JSUnusedGlobalSymbols
		return {
			/**
			 * Create a new node
			 * @memberof attribute_widget.EntityManager#
			 * @param {string} type Type of node
			 * @param {string} id Entity identifier of node
			 * @param {number} left x-coordinate of node position
			 * @param {number} top y-coordinate of node position
			 * @param {number} width Width of node
			 * @param {number} height Height of node
             * @param {object} json  the json representation of the node
			 * @returns {attribute_widget.AbstractNode}
			 */
			//TODO: switch id and type
			createNode : function (type, id, left, top, width, height,json) {
				var node;
				
                if (viewNodeTypes.hasOwnProperty(type) && viewId) {
                    node = viewNodeTypes[type](id, left, top, width, height, json);
                }
                else if(nodeTypes.hasOwnProperty(type)) {
                    node = new nodeTypes[type](id, left, top, width, height, json);
                }
                _nodes[id] = node;
                return node;
			},
			/**
			 * Create model Attributes node
			 * @returns {attribute_widget.ModelAttributesNode}
			 */
			createModelAttributesNode : function () {
				if (_modelAttributesNode === null)
                if(metamodel)
					return new ModelAttributesNode("modelAttributes", metamodel.attributes);
                else
                    return new ModelAttributesNode('modelAttributes', null);
				return null;
			},
			/**
			 * Find node by id
			 * @memberof attribute_widget.EntityManager#
			 * @param {string} id Entity id
			 * @returns {attribute_widget.AbstractNode}
			 */
			findNode : function (id) {
				if (_nodes.hasOwnProperty(id)) {
					return _nodes[id];
				}
				return null;
			},
			/**
			 * Delete node by id
			 * @memberof attribute_widget.EntityManager#
			 * @param {string} id Entity id
			 */
			deleteNode : function (id) {
				if (_nodes.hasOwnProperty(id)) {
					delete _nodes[id];
				}
			},
			/**
			 * Get nodes by type
			 * @memberof attribute_widget.EntityManager#
			 * @param {string|string[]} type Entity type
			 * @returns {object}
			 */
			getNodesByType : function (type) {
				var nodeId,
				node,
				nodesByType = {};

				if (typeof type === 'string') {
					type = [type];
				}

				for (nodeId in _nodes) {
					if (_nodes.hasOwnProperty(nodeId)) {
						node = _nodes[nodeId];
						if (type.indexOf(node.getType()) !== -1) {
							nodesByType[nodeId] = node;
						}
					}
				}
				return nodesByType;
			},
            /**
             * Get edges by type
             * @memberof canvas_widget.EntityManager#
             * @param {string} type Entity type
             * @returns {object}
             */
            getEdgesByType: function(type){
                var edgeId,
                    edge,
                    edgesByType = {};

                for(edgeId in _edges){
                    if(_edges.hasOwnProperty(edgeId)){
                        edge = _edges[edgeId];
                        if(edge.getType() === type){
                            edgesByType[edgeId] = edge;
                        }
                    }
                }
                return edgesByType;
            },
            /**
			 * Create a new edge
			 * @memberof attribute_widget.EntityManager#
			 * @param {string} type Type of edge
			 * @param {string} id Entity identifier of edge
			 * @param {attribute_widget.AbstractNode} source Source node
			 * @param {attribute_widget.AbstractNode} target Target node
			 * @returns {attribute_widget.AbstractEdge}
			 */
			//TODO: switch id and type
			createEdge : function (type, id, source, target) {
				var edge;
                
                if(viewId && viewEdgeTypes.hasOwnProperty(type)){
                    edge = viewEdgeTypes[type](id, source, target);
                }
				else if (edgeTypes.hasOwnProperty(type)) {
                    edge = new edgeTypes[type](id, source, target);
				}
                source.addOutgoingEdge(edge);
                target.addIngoingEdge(edge);
                _edges[id] = edge;

                return edge;
			},
			/**
			 * Find edge by id
			 * @memberof attribute_widget.EntityManager#
			 * @param {string} id Entity id
			 * @returns {*}
			 */
			findEdge : function (id) {
				if (_edges.hasOwnProperty(id)) {
					return _edges[id];
				}
				return null;
			},
			/**
			 * Delete edge by id
			 * @memberof attribute_widget.EntityManager#
			 * @param {string} id Entity id
			 */
			deleteEdge : function (id) {
				if (_edges.hasOwnProperty(id)) {
					delete _edges[id];
				}
			},
			/**
			 * Find node or edge by id
			 * @memberof attribute_widget.EntityManager#
			 * @param {string} id Entity id
			 * @returns {*}
			 */
			find : function (id) {
				return this.findNode(id) || this.findEdge(id);
			},
			/**
			 * Create model attributes node by its JSON representation
			 * @memberof attribute_widget.EntityManager#
			 * @param {object} json JSON representation
			 * @returns {attribute_widget.AbstractNode}
			 */
			createModelAttributesNodeFromJSON : function (json) {
				var node = this.createModelAttributesNode();
				if (node) {
					node.getLabel().getValue().setValue(json.label.value.value);
					for (var attrId in json.attributes) {
						if (json.attributes.hasOwnProperty(attrId)) {
							var attr = node.getAttribute(attrId);
							if (attr) {
								attr.setValueFromJSON(json.attributes[attrId]);
							}
						}
					}
				}
				return node;
			},
			/**
			 * Create a new node by its JSON representation
			 * @memberof attribute_widget.EntityManager#
			 * @param {string} type Type of node
			 * @param {string} id Entity identifier of node
			 * @param {number} left x-coordinate of node position
			 * @param {number} top y-coordinate of node position
			 * @param {number} width Width of node
			 * @param {number} height Height of node
			 * @param {object} json JSON representation
			 * @returns {attribute_widget.AbstractNode}
			 */
			createNodeFromJSON : function (type, id, left, top, width, height, json) {
				var node = this.createNode(type, id, left, top, width, height, json);
				if (node) {
					node.getLabel().getValue().setValue(json.label.value.value);
					for (var attrId in json.attributes) {
						if (json.attributes.hasOwnProperty(attrId)) {
							var attr = node.getAttribute(attrId);
							if (attr) {
								attr.setValueFromJSON(json.attributes[attrId]);
							}
                            else{
                                var newId = attrId.replace(/[^\[\]]*/, id);
                                attr =  node.getAttribute(newId);
                                if(attr)
                                    attr.setValueFromJSON(json.attributes[attrId]);
                                else{
                                    var attributeList = node.getAttributes();
                                    this.setAttributesByName(attributeList, json.attributes[attrId].name, json.attributes[attrId]);
                                }
                            }
						}
					}
				}
				return node;
			},
			/**
			 * Create a new node by its JSON representation
			 * @memberof attribute_widget.EntityManager#
			 * @param {string} type Type of edge
			 * @param {string} id Entity identifier of edge
			 * @param {attribute_widget.AbstractNode} sourceId Source node entity id
			 * @param {attribute_widget.AbstractNode} targetId Target node entity id
			 * @param {object} json JSON representation
			 * @returns {attribute_widget.AbstractEdge}
			 */
			createEdgeFromJSON : function (type, id, sourceId, targetId, json) {
				var edge = this.createEdge(type, id, this.findNode(sourceId), this.findNode(targetId), viewId);
				if (edge) {
					edge.getLabel().getValue().setValue(json.label.value.value);
					for (var attrId in json.attributes) {
						if (json.attributes.hasOwnProperty(attrId)) {
							var attr = edge.getAttribute(attrId);
							if (attr) {
								attr.setValueFromJSON(json.attributes[attrId]);
							}else{
                                var attributeList = edge.getAttributes();
                                this.setAttributesByName(attributeList, json.attributes[attrId].name, json.attributes[attrId]);
                            }
						}
					}
				}
				return edge;
			},
            /**
             * Sets a attribute by its name
             * @param attributeList the attribute list
             * @param name the name of attribute in the attribute list
             * @param value the value
             */
            setAttributesByName : function(attributeList, name, value){
                for(var key in attributeList){
                    if(attributeList.hasOwnProperty(key) && attributeList[key].getName() === name){
                        attributeList[key].setValueFromJSON(value);
                        break;
                    }
                }
            },
			/**
			 * Generate the 'This node can be connected to..' hint for the passed node
			 * @param {attribute_widget.AbstractNode} node
			 */
			generateConnectToText : function (node) {
				function mapTargetNodeItems(e) {
					return '<i>' + e + '</i>';
				}

				var connectionType,
				sourceNodeTypes,
				targetNodeTypes,
				targetNodeType,

				connectionItems,
				targetNodeTypeItems,
				targetNodeItems,

				i,
				numOfRelations,
				j,
				numOfTargetTypes,
				existsLinkableTargetNode,
				targetNodes,
				targetNodeId,
				targetNode;

				connectionItems = [];
				for (connectionType in relations) {
					if (relations.hasOwnProperty(connectionType)) {
						targetNodeTypeItems = [];
						for (i = 0, numOfRelations = relations[connectionType].length; i < numOfRelations; i++) {
							sourceNodeTypes = relations[connectionType][i].sourceTypes;
							targetNodeTypes = relations[connectionType][i].targetTypes;
							if (sourceNodeTypes.indexOf(node.getType()) !== -1) {
								for (j = 0, numOfTargetTypes = targetNodeTypes.length; j < numOfTargetTypes; j++) {
									targetNodeType = targetNodeTypes[j];
									targetNodeItems = [];
									targetNodes = this.getNodesByType(targetNodeType);
									existsLinkableTargetNode = false;
									for (targetNodeId in targetNodes) {
										if (targetNodes.hasOwnProperty(targetNodeId)) {
											targetNode = targetNodes[targetNodeId];
											if (targetNode === node || targetNode.getNeighbors().hasOwnProperty(node.getEntityId()))
												continue;
											targetNodeItems.push(targetNode.getLabel().getValue().getValue() || targetNode.getType());
										}
									}
									targetNodeItems.sort();
									if (_.size(targetNodeItems) > 0) {
										targetNodeTypeItems.push(' to <strong>' + targetNodeType + '</strong> ' + _.map(targetNodeItems, mapTargetNodeItems).join(', '));
									}
								}
							}
						}
						if (_.size(targetNodeTypeItems) > 0) {
							connectionItems.push('..with <strong>' + connectionType + '</strong> ' + targetNodeTypeItems.join(', '));
						}
					}
				}

				if (_.size(connectionItems) > 0) {
					return 'This node can be connected..<br>' + _.map(connectionItems, function (e) {
						return e + '<br>';
					}).join('');
				} else {
					return '';
				}
			},
            /**
             * initializes the node types
             * @param vls the vls
             */
            initNodeTypes: function(vls){
                nodeTypes = _initNodeTypes(vls);
            },
            /**
             * initializes the edge types
             * @param vls the vls
             */
            initEdgeTypes: function(vls){
               var res =  _initEdgeTypes(vls);
                edgeTypes = res.edgeTypes;
                relations = res.relations;

            },
            /**
             * initializes both the node and edge types
             * @param vls the vls
             */
            initModelTypes : function(vls){
                this.initNodeTypes(vls);
                this.initEdgeTypes(vls);
            },
            /**
             * Get the node type by its name
             * @param type the name of the node type
             * @returns {object}
             */
            getNodeType: function(type){
                return nodeTypes.hasOwnProperty(type) ?  nodeTypes[type] : null;
            },
            /**
             * Get the edge type bt its name
             * @param {string} type the name of the edge type
             * @returns {*}
             */
            getEdgeType: function(type){
                return edgeTypes.hasOwnProperty(type) ? edgeTypes[type]: null;
            },
            /**
             * initializes the node types of a view
             * @param vvs
             */
            initViewNodeTypes: function(vvs){
                //delete the old view type references
                for(var nodeTypeName in nodeTypes){
                    if(nodeTypes.hasOwnProperty(nodeTypeName)){
                       delete  nodeTypes[nodeTypeName].VIEWTYPE;
                    }
                }
                //initialize the new
                viewNodeTypes = _initNodeTypes(vvs);

            },
            /**
             * initializes the edge types of a view
             * @param vvs
             */
            initViewEdgeTypes: function(vvs){
                //delete the old view type references
                for(var edgeTypeName in edgeTypes){
                    if(edgeTypes.hasOwnProperty(edgeTypeName)){
                        delete  edgeTypes[edgeTypeName].VIEWTYPE;
                    }
                }
                //initialize the new
                var res = _initEdgeTypes(vvs);
                viewEdgeTypes = res.edgeTypes;
                relations = res.relations;
            },
            /**
             * initializes the node and edge types of view
             * @param vvs
             */
            initViewTypes: function(vvs){
                this.setViewId(vvs.id);
                this.initViewNodeTypes(vvs);
                this.initViewEdgeTypes(vvs);
            },
            /**
             * get a view node type
             * @param {string} type the name of the view type
             * @returns {*}
             */
            getViewNodeType: function(type){
                return viewNodeTypes.hasOwnProperty(type) ? viewNodeTypes[type] : null;
            },
            /**
             * get a view edge type
             * @param {string} type the name of the view edge type
             * @returns {*}
             */
            getViewEdgeType: function(type){
                return viewEdgeTypes.hasOwnProperty(type) ? viewEdgeTypes[type] : null;
            },
            /**
             * set the identifier of the view
             * @param {string} id
             */
            setViewId : function(id){
                viewId = id;
            },
            /**
             * get the identifier of the view
             * @returns {*}
             */
            getViewId : function(){
                return viewId;
            },
            getLayer : function(){
                return _layer;
            },
            init:function(mm){
                metamodel = mm;
                if (metamodel && metamodel.hasOwnProperty("nodes")) {
                    nodeTypes = _initNodeTypes(metamodel);
                    _layer = CONFIG.LAYER.MODEL;
                } else {
                    _layer = CONFIG.LAYER.META;

                    nodeTypes[ObjectNode.TYPE] = ObjectNode;
                    nodeTypes[AbstractClassNode.TYPE] = AbstractClassNode;
                    nodeTypes[RelationshipNode.TYPE] = RelationshipNode;
                    nodeTypes[RelationshipGroupNode.TYPE] = RelationshipGroupNode;
                    nodeTypes[EnumNode.TYPE] = EnumNode;
                    nodeTypes[NodeShapeNode.TYPE] = NodeShapeNode;
                    nodeTypes[EdgeShapeNode.TYPE] = EdgeShapeNode;

                    //add view types
                    nodeTypes[ViewObjectNode.TYPE] = ViewObjectNode;
                    nodeTypes[ViewRelationshipNode.TYPE] = ViewRelationshipNode;
                }

                if (metamodel && metamodel.hasOwnProperty("edges")) {
                    var res = _initEdgeTypes(metamodel);
                    edgeTypes = res.edgeTypes;
                    relations = res.relations;
                } else {
                    edgeTypes[GeneralisationEdge.TYPE] = GeneralisationEdge;
                    edgeTypes[BiDirAssociationEdge.TYPE] = BiDirAssociationEdge;
                    edgeTypes[UniDirAssociationEdge.TYPE] = UniDirAssociationEdge;

                    relations[BiDirAssociationEdge.TYPE] = BiDirAssociationEdge.RELATIONS;
                    relations[UniDirAssociationEdge.TYPE] = UniDirAssociationEdge.RELATIONS;
                    relations[GeneralisationEdge.TYPE] = GeneralisationEdge.RELATIONS;
                }
            }


		};
	}

	return new EntityManager();

});
