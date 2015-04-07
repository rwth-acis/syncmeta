define([
		'lodash',
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
		'attribute_widget/view_types/attr_ViewObjectNode',
		'attribute_widget/view_types/attr_ViewRelationshipNode',
		'promise!Metamodel'
	], /** @lends EntityManager */
	function (_, Node, ObjectNode, AbstractClassNode, RelationshipNode, RelationshipGroupNode, EnumNode, NodeShapeNode, EdgeShapeNode, ModelAttributesNode, Edge, GeneralisationEdge, BiDirAssociationEdge, UniDirAssociationEdge, ViewObjectNode, ViewRelationshipNode, metamodel) {

	/**
	 * Different node types
	 * @type {object}
	 */
	var nodeTypes = {};

	if (metamodel && metamodel.hasOwnProperty("nodes")) {
		var nodes = metamodel.nodes,
		node;
		for (var nodeId in nodes) {
			if (nodes.hasOwnProperty(nodeId)) {
				node = nodes[nodeId];
				nodeTypes[node.label] = Node(node.label, node.shape.shape, node.shape.customShape, node.shape.customAnchors, node.shape.color, node.attributes);
			}
		}
	} else {
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

	/**
	 * Different edge types
	 * @type {object}
	 */
	var edgeTypes = {};
	var relations = {};

	if (metamodel && metamodel.hasOwnProperty("edges")) {
		var edges = metamodel.edges,
		edge;
		for (var edgeId in edges) {
			if (edges.hasOwnProperty(edgeId)) {
				edge = edges[edgeId];
				edgeTypes[edge.label] = Edge(edge.label, edge.shape.arrow, edge.shape.shape, edge.shape.color, edge.shape.overlay, edge.shape.overlayPosition, edge.shape.overlayRotate, edge.attributes);
				relations[edge.label] = edge.relations;
			}
		}
	} else {
		edgeTypes[GeneralisationEdge.TYPE] = GeneralisationEdge;
		edgeTypes[BiDirAssociationEdge.TYPE] = BiDirAssociationEdge;
		edgeTypes[UniDirAssociationEdge.TYPE] = UniDirAssociationEdge;

		relations[BiDirAssociationEdge.TYPE] = BiDirAssociationEdge.RELATIONS;
		relations[UniDirAssociationEdge.TYPE] = UniDirAssociationEdge.RELATIONS;
		relations[GeneralisationEdge.TYPE] = GeneralisationEdge.RELATIONS;
	}

	/**
	 * EntityManager
	 * @class attribute_widget.EntityManager
	 * @memberof attribute_widget
	 * @constructor
	 */
	function EntityManager() {
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


		var _edges = {};
		/**
		 * Deleted nodes and edges
		 * @type {{nodes: {}, edges: {}}}
		 */
		var _recycleBin = {
			nodes : {},
			edges : {}
		};
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
			 * @returns {attribute_widget.AbstractNode}
			 */
			//TODO: switch id and type
			createNode : function (type, id, left, top, width, height,json) {
				var node;
				if (_recycleBin.nodes.hasOwnProperty(id)) {
					node = _recycleBin.nodes[id];
					delete _recycleBin.nodes[id];
					_nodes[id] = node;
					return node;
				}
				if (nodeTypes.hasOwnProperty(type)) {
					node = new nodeTypes[type](id, left, top, width, height,json);
					_nodes[id] = node;				
					return node;
				}

				return null;
			},
			/**
			 * Create model Attributes node
			 * @returns {attribute_widget.ModelAttributesNode}
			 */
			createModelAttributesNode : function () {
				if (_modelAttributesNode === null)
					return new ModelAttributesNode("modelAttributes", metamodel.attributes);
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
					_recycleBin.nodes[id] = _nodes[id];
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
				if (_recycleBin.edges.hasOwnProperty(id)) {
					edge = _recycleBin.edges[id];
					delete _recycleBin.edges[id];
					_edges[id] = edge;
					return edge;
				}
				if (edgeTypes.hasOwnProperty(type)) {
					edge = new edgeTypes[type](id, source, target);
					source.addOutgoingEdge(edge);
					target.addIngoingEdge(edge);
					_edges[id] = edge;
					return edge;
				}
				return null;
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
					_recycleBin.edges[id] = _edges[id];
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
				var edge = this.createEdge(type, id, this.findNode(sourceId), this.findNode(targetId));
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
            initNodeTypes: function(viewpointVLS){
                if(!$.isEmptyObject(nodeTypes))
                    nodeTypes = {};

                var nodes = viewpointVLS.nodes,
                    node;

               for (var nodeId in nodes) {
                    if (nodes.hasOwnProperty(nodeId)) {
                        node = nodes[nodeId];
                        nodeTypes[node.label] = Node(node.label, node.shape.shape, node.shape.customShape, node.shape.customAnchors, node.shape.color, node.attributes);
                    }
                }

            },
            initEdgeTypes: function(viewpointVLS){
                if(!$.isEmptyObject(edgeTypes)) {
                    edgeTypes = {};
                    relations ={};
                }
                var edges = viewpointVLS.edges,
                    edge;
                for (var edgeId in edges) {
                    if (edges.hasOwnProperty(edgeId)) {
                        edge = edges[edgeId];
                        edgeTypes[edge.label] = Edge(edge.label, edge.shape.arrow, edge.shape.shape, edge.shape.color, edge.shape.overlay, edge.shape.overlayPosition, edge.shape.overlayRotate, edge.attributes);
                        relations[edge.label] = edge.relations;
                    }
                }
            },
            initModelTypes : function(viewpointVLS){
                this.initNodeTypes(viewpointVLS);
                this.initEdgeTypes(viewpointVLS);
            },
            clearBin :function(){
                _recycleBin = {
                    nodes : {},
                    edges : {}
                };
            },
            addToMap : function(key, value){
                _map[key] = value;
            },
            lookupMap:function(key){
                return _map[key];
            },
            doesMapExists:function(key){
                return _map.hasOwnProperty(key);
            }

		};
	}

	return new EntityManager();

});
