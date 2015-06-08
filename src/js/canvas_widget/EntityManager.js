define([
    'lodash',
    'Util',
    'canvas_widget/AbstractEntity',
    'canvas_widget/Node',
    'canvas_widget/ObjectNode',
    'canvas_widget/AbstractClassNode',
    'canvas_widget/RelationshipNode',
    'canvas_widget/RelationshipGroupNode',
    'canvas_widget/EnumNode',
    'canvas_widget/NodeShapeNode',
    'canvas_widget/EdgeShapeNode',
    'canvas_widget/ModelAttributesNode',
    'canvas_widget/Edge',
    'canvas_widget/GeneralisationEdge',
    'canvas_widget/BiDirAssociationEdge',
    'canvas_widget/UniDirAssociationEdge',
    'canvas_widget/guidance_modeling/context_node',
    'canvas_widget/guidance_modeling/object_tool_node',
    'text!templates/canvas_widget/circle_node.html',
    'text!templates/canvas_widget/diamond_node.html',
    'text!templates/canvas_widget/rectangle_node.html',
    'text!templates/canvas_widget/rounded_rectangle_node.html',
    'text!templates/canvas_widget/triangle_node.html',
    'promise!Metamodel',
    'promise!Guidancemodel'
],/** @lends EntityManager */function(_,Util,AbstractEntity,Node,ObjectNode,AbstractClassNode,RelationshipNode,RelationshipGroupNode,EnumNode,NodeShapeNode,EdgeShapeNode,ModelAttributesNode,Edge,GeneralisationEdge,BiDirAssociationEdge,UniDirAssociationEdge,ContextNode,ObjectToolNode,circleNodeHtml,diamondNodeHtml,rectangleNodeHtml,roundedRectangleNodeHtml,triangleNodeHtml,metamodel, guidancemodel) {

    /**
     * Predefined node shapes, first is default
     * @type {{circle: *, diamond: *, rectangle: *, triangle: *}}
     */
    var nodeShapeTypes = {
        "circle": circleNodeHtml,
        "diamond": diamondNodeHtml,
        "rectangle": rectangleNodeHtml,
        "rounded_rectangle": roundedRectangleNodeHtml,
        "triangle": triangleNodeHtml
    };

    /**
     * jQuery object to test for valid color
     * @type {$}
     */
    var $colorTestElement = $('<div></div>');

    /**
     * Different node types
     * @type {object}
     */
    var nodeTypes = {};

    var objectContextTypes = {};
    var relationshipContextTypes = {};
    var objectToolTypes = {};
    var edgesByLabel = {};

    //Create nodes for guidance modeling (based on metamodel)
    if(guidancemodel.isGuidanceEditor()){
        //Create context nodes for objects
        var nodes = guidancemodel.metamodel.nodes;
        for(var nodeId in nodes){
            if(nodes.hasOwnProperty(nodeId)){
                var node = nodes[nodeId];
                var label = node.label + " Context";
                nodeTypes[label] = ContextNode(label);
                nodeTypes[label].TYPE = label;
                nodeTypes[label].DEFAULT_WIDTH = 150;
                nodeTypes[label].DEFAULT_HEIGHT = 100;

                objectContextTypes[label] = nodeTypes[label];
            }
        }
        //Create context nodes for relationships
        var edges = guidancemodel.metamodel.edges;
        for(var edgeId in edges){
            if(edges.hasOwnProperty(edgeId)){
                var edge = edges[edgeId];
                var label = edge.label + " Context";
                nodeTypes[label] = ContextNode(label);
                nodeTypes[label].TYPE = label;
                nodeTypes[label].DEFAULT_WIDTH = 150;
                nodeTypes[label].DEFAULT_HEIGHT = 100;

                relationshipContextTypes[label] = nodeTypes[label];
                edgesByLabel[edge.label] = edge;
            }
        }

        //Create object guidance tool node
        for(var nodeId in nodes){
            if(nodes.hasOwnProperty(nodeId)){
                var node = nodes[nodeId];
                var label = node.label + " Tool";
                nodeTypes[label] = ObjectToolNode(label);
                nodeTypes[label].TYPE = label;
                nodeTypes[label].DEFAULT_WIDTH = 150;
                nodeTypes[label].DEFAULT_HEIGHT = 100;

                objectToolTypes[label] = nodeTypes[label];
            }
        }
    }
    //Create nodes based on metamodel (if it exists)
    else if(metamodel && metamodel.hasOwnProperty("nodes")){
        var nodes = metamodel.nodes,
            node,
            shape,
            color,
            anchors,
            $shape;

        for(var nodeId in nodes){
            if(nodes.hasOwnProperty(nodeId)){
                node = nodes[nodeId];
                if(node.shape.customShape){
                    shape = node.shape.customShape;
                } else {
                    shape = nodeShapeTypes.hasOwnProperty(node.shape.shape) ? nodeShapeTypes[node.shape.shape] : _.keys(nodeShapeTypes)[0];
                }
                if(node.shape.customAnchors){
                    try {
                        if(node.shape.customAnchors){
                            anchors = JSON.parse(node.shape.customAnchors);
                        }
                        if(!node.shape.customAnchors instanceof Array){
                            anchors = [ "Perimeter", { shape:"Rectangle", anchorCount: 10} ];
                        }
                    } catch (e){
                        anchors = [ "Perimeter", { shape:"Rectangle", anchorCount: 10} ];
                    }
                } else {
                    switch(node.shape.shape){
                        case "circle":
                            anchors = [ "Perimeter", { shape:"Circle", anchorCount: 10} ];
                            break;
                        case "diamond":
                            anchors = [ "Perimeter", { shape:"Diamond", anchorCount: 10} ];
                            break;
                        case "rounded_rectangle":
                            anchors = [ "Perimeter", { shape:"Rectangle", anchorCount: 10} ];
                            break;
                        case "triangle":
                            anchors = [ "Perimeter", { shape:"Triangle", anchorCount: 10} ];
                            break;
                        default:
                        case "rectangle":
                            anchors = [ "Perimeter", { shape:"Rectangle", anchorCount: 10} ];
                            break;
                    }
                }
                color = node.shape.color ? $colorTestElement.css('color','#FFFFFF').css('color',node.shape.color).css('color') : '#FFFFFF';
                $shape = $(_.template(shape,{color: color, type: node.label}));

                nodeTypes[node.label] = Node(node.label,$shape,anchors,node.attributes);
                nodeTypes[node.label].TYPE = node.label;
                nodeTypes[node.label].DEFAULT_WIDTH = node.shape.defaultWidth;
                nodeTypes[node.label].DEFAULT_HEIGHT = node.shape.defaultHeight;
            }
        }
    }
    //Create nodes for metamodeling
    else {
        nodeTypes[ObjectNode.TYPE] = ObjectNode;
        nodeTypes[AbstractClassNode.TYPE] = AbstractClassNode;
        nodeTypes[RelationshipNode.TYPE] = RelationshipNode;
        nodeTypes[RelationshipGroupNode.TYPE] = RelationshipGroupNode;
        nodeTypes[EnumNode.TYPE] = EnumNode;
        nodeTypes[NodeShapeNode.TYPE] = NodeShapeNode;
        nodeTypes[EdgeShapeNode.TYPE] = EdgeShapeNode;
    }

    /**
     * Different edge types
     * @type {object}
     */
    var edgeTypes = {};
    var relations = {};

    //Create edge types for guidance modeling
    if(guidancemodel.isGuidanceEditor()){
        //Ceate the uni-directional association
        edgeTypes[UniDirAssociationEdge.TYPE] =  UniDirAssociationEdge;
        var relationsForContextNodes = [];
        //Outgoing for object context nodes
        for(var nodeId in objectContextTypes){
            var node = objectContextTypes[nodeId];
            var relation = {sourceTypes: [node.TYPE], targetTypes: []};
            var index = node.TYPE.indexOf(" Context");
            var subTypeObjectContext = node.TYPE.substring(0, index);

            // Between object context nodes and relationship context nodes
            for(var edgeId in relationshipContextTypes){
                var edgeContext = relationshipContextTypes[edgeId];
                var subTypeRelationshipContext = edgeContext.TYPE.substring(0, edgeContext.TYPE.indexOf(" Context"));
                var edge = edgesByLabel[subTypeRelationshipContext];
                for(var i = 0;  i < edge.relations.length; i++){
                    if($.inArray(subTypeObjectContext, edge.relations[i].sourceTypes) > -1){
                        relation.targetTypes.push(edgeContext.TYPE);
                    }
                }
            }

            for(var objectToolNodeId in objectToolTypes){
                var objectToolNode = objectToolTypes[objectToolNodeId];
                //Between object context nodes and object tool nodes
                if(objectToolNode.TYPE.indexOf(subTypeObjectContext) == 0){
                    relation.targetTypes.push(objectToolNode.TYPE);
                    var objectToolRelation = {sourceTypes: [objectToolNode.TYPE], targetTypes: []};
                    objectToolRelation.targetTypes.push(node.TYPE);
                    relationsForContextNodes.push(objectToolRelation);
                }
            }
            relationsForContextNodes.push(relation);
        }

        //Outgoing for relationship context nodes
        for(var edgeId in relationshipContextTypes){
            var relationshipContext = relationshipContextTypes[edgeId];
            var relation = {sourceTypes: [relationshipContext.TYPE], targetTypes: []};
            var subTypeRelationshipContext = relationshipContext.TYPE.substring(0, relationshipContext.TYPE.indexOf(" Context"));

            //Between relationship context nodes and object context nodes
            for(var nodeId in objectContextTypes){
                var objectContext = objectContextTypes[nodeId];
                var subTypeObjectContext = objectContext.TYPE.substring(0, objectContext.TYPE.indexOf(" Context"));
                var edge = edgesByLabel[subTypeRelationshipContext];
                for(var i = 0;  i < edge.relations.length; i++){
                    if($.inArray(subTypeObjectContext, edge.relations[i].targetTypes) > -1){
                        relation.targetTypes.push(objectContext.TYPE);
                    }
                }
            }
            relationsForContextNodes.push(relation);
        }

        //Outgoing for object tool nodes
        for(var objectToolId in objectToolTypes){
            var objectTool = objectToolTypes[objectToolId];
            var relation = {sourceTypes: [objectTool.TYPE], targetTypes: []};
            var subTypeObjectTool = objectTool.TYPE.substring(0, objectTool.TYPE.indexOf(" Tool"));

            for(var edgeId in guidancemodel.metamodel.edges){
                var edge = guidancemodel.metamodel.edges[edgeId];
                for(var i = 0; i < edge.relations.length; i++){
                    console.log("Check if inArray: " + subTypeObjectTool);
                    console.log(edge.relations[i].sourceTypes);
                    
                    //Between object tools and relationship contexts
                    if(($.inArray(subTypeObjectTool, edge.relations[i].sourceTypes) > -1) ||
                        ($.inArray(subTypeObjectTool, edge.relations[i].targetTypes) > -1)){
                        relation.targetTypes.push(edge.label + " Context");

                        //Between object tools and object contexts
                        for(var objectContextId in objectContextTypes){
                            var objectContext = objectContextTypes[objectContextId];
                            var subTypeObjectContext = objectContext.TYPE.substring(0, objectContext.TYPE.indexOf(" Context"));
                            if(($.inArray(subTypeObjectContext, edge.relations[i].sourceTypes) > -1)||
                               ($.inArray(subTypeObjectContext, edge.relations[i].targetTypes) > -1)){
                                relation.targetTypes.push(objectContext.TYPE);
                            }
                        }
                    }

                }
            }
            relationsForContextNodes.push(relation);
        }

        relations[UniDirAssociationEdge.TYPE] = relationsForContextNodes;
    }
    //Create edge types for modeling based on metamodel
    else if(metamodel && metamodel.hasOwnProperty("edges")){
        var edges = metamodel.edges, edge;
        for(var edgeId in edges){
            if(edges.hasOwnProperty(edgeId)){
                edge = edges[edgeId];
                edgeTypes[edge.label] = Edge(edge.label,edge.shape.arrow,edge.shape.shape,edge.shape.color,edge.shape.overlay,edge.shape.overlayPosition,edge.shape.overlayRotate,edge.attributes);
                relations[edge.label] = edge.relations;
            }
        }
    }
    //Create edge types for metamodeling
    else {
        edgeTypes[GeneralisationEdge.TYPE] =  GeneralisationEdge;
        edgeTypes[BiDirAssociationEdge.TYPE] =  BiDirAssociationEdge;
        edgeTypes[UniDirAssociationEdge.TYPE] =  UniDirAssociationEdge;

        relations[BiDirAssociationEdge.TYPE] = BiDirAssociationEdge.RELATIONS;
        relations[UniDirAssociationEdge.TYPE] = UniDirAssociationEdge.RELATIONS;
        relations[GeneralisationEdge.TYPE] = GeneralisationEdge.RELATIONS;
    }

    /**
     * EntityManager
     * @class canvas_widget.EntityManager
     * @memberof canvas_widget
     * @constructor
     */
    function EntityManager(){
        /**
         * Model attributes node
         * @type {canvas_widget.ModelAttributesNode}
         * @private
         */
        var _modelAttributesNode = null;
        /**
         * Nodes of the graph
         * @type {{}}
         * @private
         */
        var _nodes = {};
        /**
         * Edges of the graph
         * @type {{}}
         * @private
         */
        var _edges = {};
        /**
         * Deleted nodes and edges
         * @type {{nodes: {}, edges: {}}}
         * @private
         */
        var _recycleBin = {
            nodes:{},
            edges:{}
        };
        //noinspection JSUnusedGlobalSymbols
        return {
            /**
             * Create a new node
             * @memberof canvas_widget.EntityManager#
             * @param {string} type Type of node
             * @param {string} id Entity identifier of node
             * @param {number} left x-coordinate of node position
             * @param {number} top y-coordinate of node position
             * @param {number} width Width of node
             * @param {number} height Height of node
             * @param {number} zIndex Position of node on z-axis
             * @returns {canvas_widget.AbstractNode}
             */
            //TODO: switch id and type
            createNode: function(type,id,left,top,width,height,zIndex){
                var node;
                AbstractEntity.maxZIndex = Math.max(AbstractEntity.maxZIndex,zIndex);
                AbstractEntity.minZIndex = Math.min(AbstractEntity.minZIndex,zIndex);
                if(_recycleBin.nodes.hasOwnProperty(id)){
                    node = _recycleBin.nodes[id];
                    delete _recycleBin.nodes[id];
                    _nodes[id] = node;
                    return node;
                }
                if(nodeTypes.hasOwnProperty(type)){
                    node = new nodeTypes[type](id,left,top,width,height,zIndex);
                    _nodes[id] = node;
                    return node;
                }
                return null;
            },
            /**
             * Create model Attributes node
             * @returns {canvas_widget.ModelAttributesNode}
             */
            createModelAttributesNode: function(){
                if(_modelAttributesNode === null) {
                    _modelAttributesNode = new ModelAttributesNode("modelAttributes",metamodel.attributes);
                    return _modelAttributesNode;
                }
                return null;
            },
            /**
             * Find node by id
             * @memberof canvas_widget.EntityManager#
             * @param {string} id Entity id
             * @returns {canvas_widget.AbstractNode}
             */
            findNode: function(id){
                if(_nodes.hasOwnProperty(id)){
                    return _nodes[id];
                }
                return null;
            },
            /**
             * Delete node by id
             * @memberof canvas_widget.EntityManager#
             * @param {string} id Entity id
             */
            deleteNode: function(id){
                if(_nodes.hasOwnProperty(id)){
                    _recycleBin.nodes[id] = _nodes[id];
                    delete _nodes[id];
                }
            },
            /**
             * Get all nodes
             * @memberof canvas_widget.EntityManager#
             * @returns {object}
             */
            getNodes: function(){
                return _nodes;
            },
            /**
             * Get nodes by type
             * @memberof canvas_widget.EntityManager#
             * @param {string|string[]} type Entity type
             * @returns {object}
             */
            getNodesByType: function(type){
                var nodeId,
                    node,
                    nodesByType = {};

                if(typeof type === 'string'){
                    type = [type];
                }

                for(nodeId in _nodes){
                    if(_nodes.hasOwnProperty(nodeId)){
                        node = _nodes[nodeId];
                        if(type.indexOf(node.getType()) !== -1){
                            nodesByType[nodeId] = node;
                        }
                    }
                }
                return nodesByType;
            },
            /**
             * Create a new edge
             * @memberof canvas_widget.EntityManager#
             * @param {string} type Type of edge
             * @param {string} id Entity identifier of edge
             * @param {canvas_widget.AbstractNode} source Source node
             * @param {canvas_widget.AbstractNode} target Target node
             * @returns {canvas_widget.AbstractEdge}
             */
            //TODO: switch id and type
            createEdge: function(type,id,source,target){
                var edge;
                //noinspection JSAccessibilityCheck
                if(_recycleBin.edges.hasOwnProperty(id)){
                    //noinspection JSAccessibilityCheck
                    edge = _recycleBin.edges[id];
                    //noinspection JSAccessibilityCheck
                    delete _recycleBin.edges[id];
                    _edges[id] = edge;
                    return edge;
                }
                if(edgeTypes.hasOwnProperty(type)){
                    edge = new edgeTypes[type](id,source,target);
                    source.addOutgoingEdge(edge);
                    target.addIngoingEdge(edge);
                    _edges[id] = edge;
                    return edge;
                }
                return null;
            },
            /**
             * Find edge by id
             * @memberof canvas_widget.EntityManager#
             * @param {string} id Entity id
             * @returns {*}
             */
            findEdge: function(id){
                if(_edges.hasOwnProperty(id)){
                    return _edges[id];
                }
                return null;
            },
            /**
             * Delete edge by id
             * @memberof canvas_widget.EntityManager#
             * @param {string} id Entity id
             */
            deleteEdge: function(id){
                if(_edges.hasOwnProperty(id)){
                    //noinspection JSAccessibilityCheck
                    _recycleBin.edges[id] = _edges[id];
                    delete _edges[id];
                }
            },
            /**
             * Get all edges
             * @memberof canvas_widget.EntityManager#
             * @returns {object}
             */
            getEdges: function(){
                return _edges;
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
             * Get JSON representation of whole graph
             * @memberof canvas_widget.EntityManager#
             * @returns {object}
             */
            graphToJSON: function(){
                var attributesJSON;
                var nodesJSON = {};
                var edgesJSON = {};
                attributesJSON = _modelAttributesNode ? _modelAttributesNode.toJSON() : {};
                _.forEach(_nodes,function(val,key){
                    nodesJSON[key] = val.toJSON();
                });
                _.forEach(_edges,function(val,key){
                    edgesJSON[key] = val.toJSON();
                });
                return {
                    attributes: attributesJSON,
                    nodes: nodesJSON,
                    edges: edgesJSON
                };
            },
            /**
             * Create model attributes node by its JSON representation
             * @memberof canvas_widget.EntityManager#
             * @param {object} json JSON representation
             * @returns {canvas_widget.AbstractNode}
             */
            createModelAttributesNodeFromJSON: function(json){
                var node = this.createModelAttributesNode();
                if(node){
                    node.getLabel().getValue().setValue(json.label.value.value);
                    for(var attrId in json.attributes){
                        if(json.attributes.hasOwnProperty(attrId)){
                            var attr = node.getAttribute(attrId);
                            if(attr){
                                attr.setValueFromJSON(json.attributes[attrId]);
                            }
                        }
                    }
                }
                return node;
            },
            /**
             * Create a new node by its JSON representation
             * @memberof canvas_widget.EntityManager#
             * @param {string} type Type of node
             * @param {string} id Entity identifier of node
             * @param {number} left x-coordinate of node position
             * @param {number} top y-coordinate of node position
             * @param {number} width Width of node
             * @param {number} height Height of node
             * @param {object} json JSON representation
             * @param {number} zIndex Position of node on z-axis
             * @returns {canvas_widget.AbstractNode}
             */
            createNodeFromJSON: function(type,id,left,top,width,height,zIndex,json){
                var node = this.createNode(type,id,left,top,width,height,zIndex);
                if(node){
                    node.getLabel().getValue().setValue(json.label.value.value);
                    for(var attrId in json.attributes){
                        if(json.attributes.hasOwnProperty(attrId)){
                            var attr = node.getAttribute(attrId);
                            if(attr){
                                attr.setValueFromJSON(json.attributes[attrId]);
                            }
                        }
                    }
                }
                return node;
            },
            /**
             * Create a new node by its JSON representation
             * @memberof canvas_widget.EntityManager#
             * @param {string} type Type of edge
             * @param {string} id Entity identifier of edge
             * @param {canvas_widget.AbstractNode} source Source node entity id
             * @param {canvas_widget.AbstractNode} target Target node entity id
             * @param {object} json JSON representation
             * @returns {canvas_widget.AbstractEdge}
             */
            createEdgeFromJSON: function(type,id,source,target,json){
                var edge = this.createEdge(type,id,this.findNode(source),this.findNode(target));
                if(edge){
                    edge.getLabel().getValue().setValue(json.label.value.value);
                    for(var attrId in json.attributes){
                        if(json.attributes.hasOwnProperty(attrId)){
                            var attr = edge.getAttribute(attrId);
                            if(attr){
                                attr.setValueFromJSON(json.attributes[attrId]);
                            }
                        }
                    }
                }
                return edge;
            },
            /**
             * Generate the 'Add node..' context menu options
             * @param canvas Canvas to add node to
             * @param left Position of node on x-axis
             * @param top Position of node on <-axis
             * @returns {object} Menu items
             */
            generateAddNodeMenu: function(canvas,left,top){
                function makeAddNodeCallback(nodeType,width,height){
                    return function(){
                        canvas.createNode(nodeType,left,top,width,height);
                    };
                }

                var items = {},
                    nodeType;

                for(nodeType in nodeTypes){
                    if(nodeTypes.hasOwnProperty(nodeType)){
                        items[nodeType] = {
                            name: '..' + nodeType,
                            callback: makeAddNodeCallback(nodeType,nodeTypes[nodeType].DEFAULT_WIDTH,nodeTypes[nodeType].DEFAULT_HEIGHT)
                        };
                    }
                }
                return items;
            },
            /**
             * Generate the 'Connect to..' context menu options for the passed node
             * @param {canvas_widget.AbstractNode} node
             */
            generateConnectToMenu: function(node){

                function makeTargetNodeCallback(connectionType,targetNodeId){
                    return function(/*key, opt*/){
                        node.getCanvas().createEdge(connectionType,node.getEntityId(),targetNodeId);
                    };
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
                    targetNode,

                    targetAppearance,
                    sourceAppearance = node.getAppearance();

                connectionItems = {};
                for(connectionType in relations){
                    if(relations.hasOwnProperty(connectionType)){
                        targetNodeTypeItems = {};
                        for(i = 0, numOfRelations = relations[connectionType].length; i < numOfRelations; i++){
                            sourceNodeTypes = relations[connectionType][i].sourceTypes;
                            targetNodeTypes = relations[connectionType][i].targetTypes;
                            if(sourceNodeTypes.indexOf(node.getType()) !== -1){
                                for(j = 0, numOfTargetTypes = targetNodeTypes.length; j < numOfTargetTypes; j++){
                                    targetNodeType = targetNodeTypes[j];
                                    targetNodeItems = {};
                                    targetNodes = this.getNodesByType(targetNodeType);
                                    existsLinkableTargetNode = false;
                                    for(targetNodeId in targetNodes){
                                        if(targetNodes.hasOwnProperty(targetNodeId)){
                                            targetNode = targetNodes[targetNodeId];
                                            if(targetNode === node) continue;
                                            targetAppearance = targetNode.getAppearance();
                                            if(!targetNode.getNeighbors().hasOwnProperty(node.getEntityId())){
                                                targetNodeItems[connectionType+targetNodeType+i+targetNodeId] = {
                                                    name: '..' + (targetNode.getLabel().getValue().getValue() || targetNode.getType()),
                                                    callback: makeTargetNodeCallback(connectionType,targetNodeId),
                                                    distanceSquare: Math.pow(targetAppearance.left-sourceAppearance.left,2) + Math.pow(targetAppearance.top-sourceAppearance.top,2),
                                                    targetNodeId: connectionType+targetNodeType+i+targetNodeId
                                                };
                                            }
                                        }
                                    }
                                    if(_.size(targetNodeItems) > 0){
                                        var targetNodeItemsTmp = _.sortBy(targetNodeItems,'distanceSquare');
                                        targetNodeItems = {};
                                        for(var k = 0, numOfItems = targetNodeItemsTmp.length; k < numOfItems; k++){
                                            targetNodeItems[k+targetNodeItemsTmp[k].targetNodeId] = targetNodeItemsTmp[k];
                                        }
                                        targetNodeTypeItems[connectionType+targetNodeType+i] = {
                                            name: '..to ' + targetNodeType + "..",
                                            items: targetNodeItems
                                        };
                                    }
                                }
                            }
                        }
                        if(_.size(targetNodeTypeItems) > 0){
                            connectionItems[connectionType] = {
                                name: '..with ' + connectionType + '..',
                                items: targetNodeTypeItems
                            };
                        }
                    }
                }

                return {
                    name: 'Connect..',
                    items: connectionItems,
                    disabled: (function(connectionItems){
                        return _.size(connectionItems) === 0;
                    })(connectionItems)
                };
            },
            /**
             * Generate the JSON Representation of the meta-model for a new editr instance based on the current graph
             * @returns {{nodes: {}, edges: {}}} JSON representation of meta model
             */
            generateMetaModel: function(){

                /**
                 * Determine the type of the concrete classes (ObjectNodes) of the class diagram contained in the sub graph rooted by the passed node
                 * @param node Node to start with
                 * @param [visitedNodes] List of node that already have been visited
                 * @returns {object}
                 */
                function getConcreteObjectNodeTypes(node,visitedNodes){
                    var edgeId,
                        edge,
                        ingoingEdges,
                        source,
                        type,
                        classTypes = [];

                    if(!visitedNodes) visitedNodes = [];

                    if(visitedNodes.indexOf(node) !== -1) return [];

                    visitedNodes.push(node);

                    type = node.getLabel().getValue().getValue();
                    if(node instanceof ObjectNode && classTypes.indexOf(type) === -1){
                        classTypes.push(type);
                    }

                    ingoingEdges = node.getIngoingEdges();
                    for(edgeId in ingoingEdges){
                        if(ingoingEdges.hasOwnProperty(edgeId)){
                            edge = ingoingEdges[edgeId];
                            source = edge.getSource();
                            if(edge instanceof GeneralisationEdge && source instanceof ObjectNode ||
                                edge instanceof GeneralisationEdge && source instanceof AbstractClassNode){
                                classTypes = classTypes.concat(getConcreteObjectNodeTypes(source,visitedNodes));
                            }
                        }
                    }
                    return classTypes;
                }

                /**
                 * Determine the attributes of the passed node by traversing the underlying class diagram
                 * @param node Node to start with
                 * @param [visitedNodes] List of node that already have been visited
                 * @returns {object}
                 */
                function getNodeAttributes(node,visitedNodes){
                    var nodeAttributes, attributeId, attribute;
                    var edgeId, edge, outgoingEdges;
                    var source, target;
                    var neighbor, options;
                    var attributes = {};
                    var obj = {};

                    if(!visitedNodes) visitedNodes = [];

                    if(visitedNodes.indexOf(node) !== -1) return {};

                    visitedNodes.push(node);

                    //Traverse outgoing edges to check for inheritance and linked enums
                    outgoingEdges = node.getOutgoingEdges();
                    for(edgeId in outgoingEdges){
                        if(outgoingEdges.hasOwnProperty(edgeId)){
                            edge = outgoingEdges[edgeId];
                            source = edge.getSource();
                            target = edge.getTarget();

                            //Does the node inherit attributes from a parent node?
                            if( (edge instanceof GeneralisationEdge && target instanceof AbstractClassNode) ||
                                (edge instanceof GeneralisationEdge && node instanceof ObjectNode && target instanceof ObjectNode) ||
                                (edge instanceof GeneralisationEdge && node instanceof RelationshipNode && target instanceof RelationshipNode) ||
                                (edge instanceof GeneralisationEdge && node instanceof EnumNode && target instanceof EnumNode)){
                                Util.merge(attributes,getNodeAttributes(target,visitedNodes));

                                //Is there an enum linked to the node
                            } else if( (edge instanceof BiDirAssociationEdge &&
                                (target === node && (neighbor = source) instanceof EnumNode ||
                                    source === node && (neighbor = target) instanceof EnumNode)) ||

                                (edge instanceof UniDirAssociationEdge && (neighbor = target) instanceof EnumNode) ){

                                options = {};
                                nodeAttributes = {};
                                Util.merge(nodeAttributes,getNodeAttributes(neighbor,[]));
                                for(attributeId in nodeAttributes){
                                    if(nodeAttributes.hasOwnProperty(attributeId)){
                                        attribute = nodeAttributes[attributeId];
                                        options[attribute.value] = attribute.value;
                                    }
                                }
                                obj = {};
                                obj[neighbor.getEntityId()] = {
                                    key: edge.getLabel().getValue().getValue(),
                                    value: neighbor.getLabel().getValue().getValue(),
                                    options: options
                                };
                                Util.merge(attributes,obj);
                            }
                        }
                    }
                    //Compute node attributes
                    nodeAttributes = node.getAttribute("[attributes]").getAttributes();
                    for(attributeId in nodeAttributes){
                        if(nodeAttributes.hasOwnProperty(attributeId)){
                            attribute = nodeAttributes[attributeId];
                            if(node instanceof RelationshipNode){
                                obj = {};
                                obj[attributeId] = {
                                    key: attribute.getKey().getValue(),
                                    value: attribute.getValue().getValue(),
                                    position: attribute.getValue2().getValue()
                                };
                                Util.merge(attributes,obj);
                            } else if (node instanceof EnumNode){
                                obj = {};
                                obj[attributeId] = {
                                    value: attribute.getValue().getValue()
                                };
                                Util.merge(attributes,obj);
                            } else {
                                obj = {};
                                obj[attributeId] = {
                                    key: attribute.getKey().getValue(),
                                    value: attribute.getValue().getValue()
                                };
                                Util.merge(attributes,obj);
                            }

                        }
                    }
                    return attributes;
                }

                var metamodel = {
                    attributes: {},
                    nodes: {},
                    edges: {}
                };

                var nodeId, node;
                var attributes;
                var edge, edgeId, edges;
                var source, target;
                var neighbor;
                var groupSource, groupTarget;
                var groupNeighbor;
                var shape;
                var sourceTypes, targetTypes, concreteTypes;
                var groupSourceTypes, groupTargetTypes, groupConcreteTypes;
                var relations;
                var groupEdge,groupEdgeId,groupEdges;

                for(nodeId in _nodes){
                    if(_nodes.hasOwnProperty(nodeId)){
                        node = _nodes[nodeId];
                        if(node instanceof ObjectNode){
                            if(node.getLabel().getValue().getValue() === "Model Attributes"){
                                attributes = getNodeAttributes(node);
                                metamodel.attributes = attributes;
                            } else {
                                attributes = getNodeAttributes(node);
                                edges = node.getEdges();
                                shape = null;
                                for(edgeId in edges){
                                    if(edges.hasOwnProperty(edgeId)){
                                        edge = edges[edgeId];
                                        source = edge.getSource();
                                        target = edge.getTarget();
                                        if( (edge instanceof BiDirAssociationEdge &&
                                            (target === node && (neighbor = source) instanceof NodeShapeNode ||
                                                source === node && (neighbor = target) instanceof NodeShapeNode)) ||

                                            (edge instanceof UniDirAssociationEdge && (neighbor = target) instanceof NodeShapeNode) ){

                                            shape = {
                                                shape: neighbor.getAttribute(neighbor.getEntityId()+"[shape]").getValue().getValue(),
                                                color: neighbor.getAttribute(neighbor.getEntityId()+"[color]").getValue().getValue(),
                                                defaultWidth: parseInt(neighbor.getAttribute(neighbor.getEntityId()+"[defaultWidth]").getValue().getValue()),
                                                defaultHeight: parseInt(neighbor.getAttribute(neighbor.getEntityId()+"[defaultHeight]").getValue().getValue()),
                                                customShape: neighbor.getAttribute(neighbor.getEntityId()+"[customShape]").getValue().getValue(),
                                                customAnchors: neighbor.getAttribute(neighbor.getEntityId()+"[customAnchors]").getValue().getValue()
                                            };
                                        }
                                    }
                                }
                                metamodel.nodes[nodeId] = {
                                    label: node.getLabel().getValue().getValue(),
                                    attributes: attributes,
                                    shape: shape || {shape: "rectangle", color: "white", customShape: "", customAnchors: "", defaultWidth: 0, defaultHeight: 0}
                                };
                            }
                        } else if(node instanceof RelationshipNode){
                            attributes = getNodeAttributes(node);
                            edges = node.getEdges();
                            sourceTypes = [];
                            targetTypes = [];
                            relations = [];
                            shape = null;
                            for(edgeId in edges){
                                if(edges.hasOwnProperty(edgeId)){
                                    edge = edges[edgeId];
                                    source = edge.getSource();
                                    target = edge.getTarget();
                                    if( (edge instanceof BiDirAssociationEdge &&
                                        (target === node && (neighbor = source) instanceof ObjectNode ||
                                            source === node && (neighbor = target) instanceof ObjectNode))){

                                        concreteTypes = getConcreteObjectNodeTypes(neighbor);
                                        sourceTypes = sourceTypes.concat(concreteTypes);
                                        targetTypes = targetTypes.concat(concreteTypes);

                                    } else if(edge instanceof UniDirAssociationEdge && source === node && target instanceof ObjectNode){

                                        targetTypes = targetTypes.concat(getConcreteObjectNodeTypes(target));

                                    } else if(edge instanceof UniDirAssociationEdge && target === node && source instanceof ObjectNode){

                                        sourceTypes = sourceTypes.concat(getConcreteObjectNodeTypes(source));

                                    } else if( (edge instanceof BiDirAssociationEdge &&
                                        (target === node && (neighbor = source) instanceof AbstractClassNode ||
                                            source === node && (neighbor = target) instanceof AbstractClassNode))){

                                        concreteTypes = getConcreteObjectNodeTypes(neighbor);
                                        sourceTypes = sourceTypes.concat(concreteTypes);
                                        targetTypes = targetTypes.concat(concreteTypes);

                                    } else if(edge instanceof UniDirAssociationEdge && source === node && target instanceof AbstractClassNode){

                                        targetTypes = targetTypes.concat(getConcreteObjectNodeTypes(target));

                                    } else if(edge instanceof UniDirAssociationEdge && target === node && source instanceof AbstractClassNode){

                                        sourceTypes = sourceTypes.concat(getConcreteObjectNodeTypes(source));

                                    } else if( (edge instanceof BiDirAssociationEdge &&
                                        (target === node && (neighbor = source) instanceof EdgeShapeNode ||
                                            source === node && (neighbor = target) instanceof EdgeShapeNode)) ||

                                        (edge instanceof UniDirAssociationEdge && source === node && (neighbor = target) instanceof EdgeShapeNode) ){

                                        shape = {
                                            arrow: neighbor.getAttribute(neighbor.getEntityId()+"[arrow]").getValue().getValue(),
                                            shape: neighbor.getAttribute(neighbor.getEntityId()+"[shape]").getValue().getValue(),
                                            color: neighbor.getAttribute(neighbor.getEntityId()+"[color]").getValue().getValue(),
                                            overlay: neighbor.getAttribute(neighbor.getEntityId()+"[overlay]").getValue().getValue(),
                                            overlayPosition: neighbor.getAttribute(neighbor.getEntityId()+"[overlayPosition]").getValue().getValue(),
                                            overlayRotate: neighbor.getAttribute(neighbor.getEntityId()+"[overlayRotate]").getValue().getValue()
                                        };
                                    } else if( (edge instanceof GeneralisationEdge && target === node && (neighbor = source) instanceof RelationshipGroupNode) ){

                                        groupEdges = neighbor.getEdges();
                                        groupSourceTypes = [];
                                        groupTargetTypes = [];
                                        for(groupEdgeId in groupEdges){
                                            if(groupEdges.hasOwnProperty(groupEdgeId)){
                                                groupEdge = groupEdges[groupEdgeId];
                                                groupSource = groupEdge.getSource();
                                                groupTarget = groupEdge.getTarget();
                                                if( (groupEdge instanceof BiDirAssociationEdge &&
                                                    (groupTarget === neighbor && (groupNeighbor = groupSource) instanceof ObjectNode ||
                                                        groupSource === neighbor && (groupNeighbor = groupTarget) instanceof ObjectNode))){

                                                    groupConcreteTypes = getConcreteObjectNodeTypes(groupNeighbor);
                                                    groupSourceTypes = groupSourceTypes.concat(groupConcreteTypes);
                                                    groupTargetTypes = groupTargetTypes.concat(groupConcreteTypes);

                                                } else if(groupEdge instanceof UniDirAssociationEdge && groupSource === neighbor && groupTarget instanceof ObjectNode){

                                                    groupTargetTypes = groupTargetTypes.concat(getConcreteObjectNodeTypes(groupTarget));

                                                } else if(groupEdge instanceof UniDirAssociationEdge && groupTarget === neighbor && groupSource instanceof ObjectNode){

                                                    groupSourceTypes = groupSourceTypes.concat(getConcreteObjectNodeTypes(groupSource));

                                                } else if( (groupEdge instanceof BiDirAssociationEdge &&
                                                    (groupTarget === neighbor && (groupNeighbor = groupSource) instanceof AbstractClassNode ||
                                                        groupSource === neighbor && (groupNeighbor = groupTarget) instanceof AbstractClassNode))){

                                                    groupConcreteTypes = getConcreteObjectNodeTypes(groupNeighbor);
                                                    groupSourceTypes = groupSourceTypes.concat(groupConcreteTypes);
                                                    groupTargetTypes = groupTargetTypes.concat(groupConcreteTypes);

                                                } else if(groupEdge instanceof UniDirAssociationEdge && groupSource === neighbor && groupTarget instanceof AbstractClassNode){

                                                    groupTargetTypes = groupTargetTypes.concat(getConcreteObjectNodeTypes(groupTarget));

                                                } else if(groupEdge instanceof UniDirAssociationEdge && groupTarget === neighbor && groupSource instanceof AbstractClassNode){

                                                    groupSourceTypes = groupSourceTypes.concat(getConcreteObjectNodeTypes(groupSource));

                                                }
                                            }
                                        }

                                        if(groupSourceTypes.length > 0 && groupTargetTypes.length > 0){
                                            relations.push({
                                                sourceTypes: groupSourceTypes,
                                                targetTypes: groupTargetTypes
                                            });
                                        }

                                    }
                                }
                            }

                            if(sourceTypes.length > 0 && targetTypes.length > 0){
                                relations.push({
                                    sourceTypes: sourceTypes,
                                    targetTypes: targetTypes
                                });
                            }

                            metamodel.edges[nodeId] = {
                                label: node.getLabel().getValue().getValue(),
                                shape: shape || {arrow: "bidirassociation", shape: "straight", color: "black", overlay: "", overlayPosition: "top", overlayRotate: true},
                                relations: relations,
                                attributes: attributes
                            };
                        }
                    }
                }
                return metamodel;
            },
            /**
             * Store current graph representation in the ROLE space
             * @returns {Deferred}
             */
            storeData: function(){
                var resourceSpace = new openapp.oo.Resource(openapp.param.space());

                var data = this.graphToJSON();

                var resourcesToSave = [];
                var promises = [];

                //In the guidance model editor update the guidance model
                if(guidancemodel.isGuidanceEditor()){
                    guidancemodel.guidancemodel = data;
                    resourcesToSave.push({'typeName': CONFIG.NS.MY.GUIDANCEMODEL, 'representation': guidancemodel});
                }
                //In the metamodel editor update the metamodel needed for the guidance editor
                else if(!metamodel.hasOwnProperty('nodes')){
                    guidancemodel.metamodel = this.generateMetaModel();
                    resourcesToSave.push({'typeName': CONFIG.NS.MY.GUIDANCEMODEL, 'representation': guidancemodel});
                    resourcesToSave.push({'typeName': CONFIG.NS.MY.MODEL, 'representation': data})
                }
                //In the model editor just update the model
                else{
                    resourcesToSave.push({'typeName': CONFIG.NS.MY.MODEL, 'representation': data})
                }

                var recreateResource = function(type, representation){
                    var deferred = $.Deferred();
                    var innerDeferred = $.Deferred();
                    //noinspection JSUnusedGlobalSymbols
                    resourceSpace.getSubResources({
                        relation: openapp.ns.role + "data",
                        type: type,
                        onEach: function(doc) {
                            doc.del();
                        },
                        onAll: function(){
                            innerDeferred.resolve();
                        }
                    });
                    innerDeferred.then(function(){
                        resourceSpace.create({
                            relation: openapp.ns.role + "data",
                            type: type,
                            representation: representation,
                            callback: function(){
                                deferred.resolve();
                            }
                        });
                    });
                    return deferred.promise();  
                };

                for(var i=0; i < resourcesToSave.length; i++){
                    var item = resourcesToSave[i];
                    promises.push(recreateResource(item.typeName, item.representation));
                }
                
                return $.when.apply($, promises);
            },
            getRelations: function(){
                return relations;
            }
        };
    }

    return new EntityManager();

});