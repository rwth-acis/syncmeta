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
    'canvas_widget/viewpoint/ViewObjectNode',
    'canvas_widget/viewpoint/ViewRelationshipNode',
    'canvas_widget/view/ViewNode',
    'canvas_widget/view/ViewEdge',
    'text!templates/canvas_widget/circle_node.html',
    'text!templates/canvas_widget/diamond_node.html',
    'text!templates/canvas_widget/rectangle_node.html',
    'text!templates/canvas_widget/rounded_rectangle_node.html',
    'text!templates/canvas_widget/triangle_node.html',
    'text!templates/guidance_modeling/set_property_node.html',
    'text!templates/guidance_modeling/activity_final_node.html',
    'text!templates/canvas_widget/start_activity_node.html',
    'text!templates/canvas_widget/action_node.html',
    'text!templates/guidance_modeling/entity_node.html',
    'text!templates/guidance_modeling/call_activity_node.html',
    'graphlib'
], /** @lends EntityManager */
function (_, Util, AbstractEntity, Node, ObjectNode, AbstractClassNode, RelationshipNode, RelationshipGroupNode, EnumNode, NodeShapeNode, EdgeShapeNode, ModelAttributesNode, Edge, GeneralisationEdge, BiDirAssociationEdge, UniDirAssociationEdge, ViewObjectNode, ViewRelationshipNode, ViewNode, ViewEdge, circleNodeHtml, diamondNodeHtml, rectangleNodeHtml, roundedRectangleNodeHtml, triangleNodeHtml, setPropertyNodeHtml,activityFinalNodeHtml,startActivityNodeHtml,actionNodeHtml,entityNodeHtml,callActivityNodeHtml, graphlib) {

    /**
     * Predefined node shapes, first is default
     * @type {{circle: *, diamond: *, rectangle: *, triangle: *}}
     */
    var nodeShapeTypes = {
        "circle" : circleNodeHtml,
        "diamond" : diamondNodeHtml,
        "rectangle" : rectangleNodeHtml,
        "rounded_rectangle" : roundedRectangleNodeHtml,
        "triangle" : triangleNodeHtml
    };

    /**
     * jQuery object to test for valid color
     * @type {$}
     */
    var $colorTestElement = $('<div></div>');

    /** Determines the current layer of syncmeta.
     *  can be CONFIG.LAYER.MODEL or CONFIG.LAYER.META*/
    var _layer = null;

    /**
     * Different node types
     * @type {object}
     */
    var nodeTypes = {};

    var _initNodeTypes = function(vls) {
        var _nodeTypes = {};

        var nodes = vls.nodes, node, shape, anchors;

        // Start creating nodes based on metamodel
        for (var nodeId in nodes) {
            if (nodes.hasOwnProperty(nodeId)) {

                node = nodes[nodeId];
                if (node.shape.customShape) {
                    shape = node.shape.customShape;
                } else {
                    shape = nodeShapeTypes.hasOwnProperty(node.shape.shape) ? nodeShapeTypes[node.shape.shape] : _.keys(nodeShapeTypes)[0];
                }
                if (node.shape.customAnchors) {
                    try {
                        if (node.shape.customAnchors) {
                            anchors = JSON.parse(node.shape.customAnchors);
                        }
                        if (!node.shape.customAnchors instanceof Array) {
                            anchors = ["Perimeter", {
                                shape: "Rectangle",
                                anchorCount: 10
                            }
                            ];
                        }
                    } catch (e) {
                        anchors = ["Perimeter", {
                            shape: "Rectangle",
                            anchorCount: 10
                        }
                        ];
                    }
                } else {
                    switch (node.shape.shape) {
                        case "circle":
                            anchors = ["Perimeter", {
                                shape: "Circle",
                                anchorCount: 10
                            }
                            ];
                            break;
                        case "diamond":
                            anchors = ["Perimeter", {
                                shape: "Diamond",
                                anchorCount: 10
                            }
                            ];
                            break;
                        case "rounded_rectangle":
                            anchors = ["Perimeter", {
                                shape: "Rectangle",
                                anchorCount: 10
                            }
                            ];
                            break;
                        case "triangle":
                            anchors = ["Perimeter", {
                                shape: "Triangle",
                                anchorCount: 10
                            }
                            ];
                            break;
                        default:
                        case "rectangle":
                            anchors = ["Perimeter", {
                                shape: "Rectangle",
                                anchorCount: 10
                            }
                            ];
                            break;
                    }
                }
                var color = node.shape.color ? $colorTestElement.css('color', '#FFFFFF').css('color', node.shape.color).css('color') : '#FFFFFF';
                var $shape = $(_.template(shape, {color: color, type: node.label}));

                if (node.hasOwnProperty('targetName') && !$.isEmptyObject(nodeTypes) && nodeTypes.hasOwnProperty(node.targetName)) {
                    _nodeTypes[node.label] = ViewNode(node.label, $shape, anchors, node.attributes, nodeTypes[node.targetName], node.conditions, node.conjunction);
                    nodeTypes[node.targetName].VIEWTYPE = node.label;
                }
                else {
                    _nodeTypes[node.label] = Node(node.label, $shape, anchors, node.attributes);
                }
                _nodeTypes[node.label].TYPE = node.label;
                _nodeTypes[node.label].DEFAULT_WIDTH = node.shape.defaultWidth;
                _nodeTypes[node.label].DEFAULT_HEIGHT = node.shape.defaultHeight;
                _nodeTypes[node.label].SHAPE = $shape;
                /*
                 nodeTypes[node.label] = Node(node.label, $shape, anchors, node.attributes, node.jsplumb);
                 nodeTypes[node.label].TYPE = node.label;
                 nodeTypes[node.label].SHAPE = $shape;
                 nodeTypes[node.label].DEFAULT_WIDTH = node.shape.defaultWidth;
                 nodeTypes[node.label].DEFAULT_HEIGHT = node.shape.defaultHeight;*/
            }


        }
        return _nodeTypes;
    };

    /**
     * Guidance modeling specific objects
     * Unused
     */

    var objectContextTypes = {};
    var relationshipContextTypes = {};
    var objectToolTypes = {};
    var edgesByLabel = {};
    var objectToolNodeTypes = {};


    var _initEdgeTypes = function(vls){
        var _edgeTypes = {};
        var _relations = {};
        var edges = vls.edges,
            edge;
        for (var edgeId in edges) {
            if (edges.hasOwnProperty(edgeId)) {
                edge = edges[edgeId];

                if(edge.hasOwnProperty('targetName') && !$.isEmptyObject(edgeTypes) && edgeTypes.hasOwnProperty(edge.targetName)){
                    _edgeTypes[edge.label] = ViewEdge(edge.label, edge.shape.arrow, edge.shape.shape, edge.shape.color,edge.shape.dashstyle, edge.shape.overlay, edge.shape.overlayPosition, edge.shape.overlayRotate, edge.attributes, edgeTypes[edge.targetName], edge.conditions, edge.conjunction);
                    edgeTypes[edge.targetName].VIEWTYPE = edge.label;
                }else{
                    _edgeTypes[edge.label] = Edge(edge.label, edge.shape.arrow, edge.shape.shape, edge.shape.color,edge.shape.dashstyle, edge.shape.overlay, edge.shape.overlayPosition, edge.shape.overlayRotate, edge.attributes);
                }

                _edgeTypes[edge.label].TYPE = edge.label;
                _relations[edge.label] = edge.relations;
            }
        }
        return {
            edgeTypes: _edgeTypes,
            relations: _relations
        }
    };


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

    /**
     * Different edge types
     * @type {object}
     */
    var edgeTypes = {};
    var relations = {};
    /*
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
     }*/

    /**
     * EntityManager
     * @class canvas_widget.EntityManager
     * @memberof canvas_widget
     * @constructor
     */
    function EntityManager() {
        /**
         * the view id indicates if the EntityManager should use View types for modeling or node types
         * @type {string}
         * @private
         */
        var _viewId = undefined;

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

        var metamodel =null;

        var guidancemodel = null;

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
             * @param {object} json the json representation
             * @returns {canvas_widget.AbstractNode}
             */
            //TODO: Id is checked in canvas.createNode? Why not here???
            createNode : function (type, id, left, top, width, height, zIndex,json) {
                var node;
                AbstractEntity.maxZIndex = Math.max(AbstractEntity.maxZIndex, zIndex);
                AbstractEntity.minZIndex = Math.min(AbstractEntity.minZIndex, zIndex);
             
                if(_viewId && viewNodeTypes.hasOwnProperty(type)){
                    node = viewNodeTypes[type](id, left, top, width, height, zIndex, json);
                }
                else if(nodeTypes.hasOwnProperty(type)) {
                    node = new nodeTypes[type](id, left, top, width, height, zIndex, json);
                }
                _nodes[id] = node;
                return node;
            },
            /**
             * Create model Attributes node
             * @returns {canvas_widget.ModelAttributesNode}
             */
            createModelAttributesNode : function () {
                if (_modelAttributesNode === null) {
                    if(metamodel)
                        _modelAttributesNode = new ModelAttributesNode("modelAttributes", metamodel.attributes);
                    else
                        _modelAttributesNode = new ModelAttributesNode("modelAttributes", null);
                    return _modelAttributesNode;
                }
                return _modelAttributesNode;
            },
            /**
             * Find node by id
             * @memberof canvas_widget.EntityManager#
             * @param {string} id Entity id
             * @returns {canvas_widget.AbstractNode}
             */
            findNode : function (id) {
                if (_nodes.hasOwnProperty(id)) {
                    return _nodes[id];
                }
                return null;
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
             * Delete node by id
             * @memberof canvas_widget.EntityManager#
             * @param {string} id Entity id
             */
            deleteNode: function(id){
                if(_nodes.hasOwnProperty(id)){
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

                if (typeof type === 'string') {
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
                
                if(_viewId && viewEdgeTypes.hasOwnProperty(type)){
                    edge = viewEdgeTypes[type](id,source,target);
                }
                else if(edgeTypes.hasOwnProperty(type)) {
                    edge = new edgeTypes[type](id, source, target);
                }
                else {
                    return undefined;
                }
                source.addOutgoingEdge(edge);
                target.addIngoingEdge(edge);
                _edges[id] = edge;
                return edge;

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
                var node = this.createNode(type,id,left,top,width,height,zIndex,json);
                if(node){
                    node.getLabel().getValue().setValue(json.label.value.value);
                    for(var attrId in json.attributes){
                        if(json.attributes.hasOwnProperty(attrId)){
                            var attr = node.getAttribute(attrId);
                            if(attr){
                                attr.setValueFromJSON(json.attributes[attrId]);
                            }else{
                                var newId = attrId.replace(/[^\[\]]*/, id);
                                attr =  node.getAttribute(newId);
                                if(attr){
                                    attr.setValueFromJSON(json.attributes[attrId]);
                                }

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
                    nodeType,
                    _nodeTypes;

                if(_viewId &&  _layer === CONFIG.LAYER.MODEL){
                    _nodeTypes = viewNodeTypes;
                }
                else{
                    _nodeTypes = nodeTypes;
                }

                for(nodeType in _nodeTypes){
                    if(_nodeTypes.hasOwnProperty(nodeType)){
                        if(_layer === CONFIG.LAYER.META && !_viewId && (nodeType === 'ViewObject' || nodeType ==='ViewRelationship'))
                            continue;
                        if(_layer === CONFIG.LAYER.META &&_viewId && (nodeType ==='Object' || nodeType ==='Relationship' || nodeType === 'Enumeration' || nodeType === 'Abstract Class'))
                            continue;

                        items[nodeType] = {
                            name: '..' + nodeType,
                            callback: makeAddNodeCallback(nodeType,_nodeTypes[nodeType].DEFAULT_WIDTH,_nodeTypes[nodeType].DEFAULT_HEIGHT)
                        };
                    }
                }
                return items;
            },
            /**
             * generates the context menu for the show and hide opeations on node types
             * @returns {object}
             */
            generateVisibilityNodeMenu:function(visibilty){
                var _applyVisibilityCallback = function(nodeType, vis){
                    return function() {
                        if (vis !== 'show' && vis !== 'hide') return;

                        var nodes;
                        if (_viewId && _layer === CONFIG.LAYER.MODEL) {
                            nodes = that.getNodesByViewType(nodeType);
                        } else {
                            nodes = that.getNodesByType(nodeType);
                        }
                        for (var nKey in nodes) {
                            if (nodes.hasOwnProperty(nKey)) {
                                nodes[nKey][vis]();
                            }
                        }
                        if(vis === 'hide') {
                            this.data('show' + nodeType + 'Disabled', true);
                        }
                        else {
                            this.data('show' + nodeType + 'Disabled', false);
                        }

                        return false;
                    }
                };

                var that = this;
                var items = {},
                    nodeType,
                    _nodeTypes;

                if(_viewId &&  _layer === CONFIG.LAYER.MODEL){
                    _nodeTypes = viewNodeTypes;
                }
                else{
                    _nodeTypes = nodeTypes;
                }

                for(nodeType in _nodeTypes){
                    if(_nodeTypes.hasOwnProperty(nodeType)){
                        if(_layer === CONFIG.LAYER.META && !_viewId && (nodeType === 'ViewObject' || nodeType ==='ViewRelationship'))
                            continue;
                        if(_layer === CONFIG.LAYER.META &&_viewId && (nodeType ==='Object' || nodeType ==='Relationship' || nodeType === 'Enumeration' || nodeType === 'Abstract Class'))
                            continue;

                        items[visibilty+nodeType] = {
                            name: '..' + nodeType,
                            callback: _applyVisibilityCallback(nodeType,visibilty),
                            disabled:(function(nodeType){
                                return function() {
                                    if(visibilty==='hide')
                                        return this.data(visibilty + nodeType + 'Disabled');
                                    else
                                        return !this.data(visibilty + nodeType + 'Disabled');
                                }
                            }(nodeType))
                        };
                    }
                }
                return items;
            },
            /**
             * generates a the context menu for the show and hide operations on edge types
             * @returns {object}
             */
            generateVisibilityEdgeMenu:function(visibility){
                function _applyVisibilityCallback(edgeType, vis) {
                    return function () {
                        if (vis !== 'show' && vis !== 'hide') return;
                        var edges;
                        if (_viewId && _layer === CONFIG.LAYER.MODEL) {
                            edges = that.getEdgesByViewType(edgeType);
                        } else {
                            edges = that.getEdgesByType(edgeType);
                        }
                        for (var eKey in edges) {
                            if (edges.hasOwnProperty(eKey)) {
                                edges[eKey][vis]();
                            }
                        }
                        if(vis === 'hide') {
                            this.data('show' + edgeType + 'Disabled', true);
                        }
                        else {
                            this.data('show' + edgeType + 'Disabled', false);
                        }
                    }
                }
                var that = this;
                var items = {},
                    edgeType,
                    _edgeTypes;

                if(_viewId &&  _layer === CONFIG.LAYER.MODEL){
                    _edgeTypes= viewEdgeTypes;
                }
                else{
                    _edgeTypes = edgeTypes;
                }

                for(edgeType in _edgeTypes){
                    if(_edgeTypes.hasOwnProperty(edgeType)){
                        items[visibility+edgeType] = {
                            name: '..' + edgeType,
                            callback: _applyVisibilityCallback(edgeType,visibility),
                            disabled:(function(edgeType){
                                return function() {
                                    if(visibility==='hide')
                                        return this.data(visibility + edgeType + 'Disabled');
                                    else
                                        return !this.data(visibility + edgeType + 'Disabled');
                                }
                            }(edgeType))
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
                            if(sourceNodeTypes.indexOf(node.getType()) !== -1 || (_layer === CONFIG.LAYER.MODEL && _viewId && sourceNodeTypes.indexOf(node.getCurrentViewType()) !== -1)){
                                for(j = 0, numOfTargetTypes = targetNodeTypes.length;j < numOfTargetTypes; j++){
                                    targetNodeType = targetNodeTypes[j];
                                    targetNodeItems = {};
                                    if(_viewId && _layer ===CONFIG.LAYER.MODEL){
                                        targetNodes = this.getNodesByViewType(targetNodeType);
                                    }else {
                                        targetNodes = this.getNodesByType(targetNodeType);
                                    }
                                    existsLinkableTargetNode = false;
                                    for(targetNodeId in targetNodes){
                                        if(targetNodes.hasOwnProperty(targetNodeId)){
                                            targetNode = targetNodes[targetNodeId];
                                            if(targetNode === node) continue;
                                            if(_layer === CONFIG.LAYER.MODEL && _viewId && targetNode.getCurrentViewType() === null) continue;
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
            generateGuidanceMetamodel: function(){
                var metamodel = this.generateMetaModel();
                var actionNodes = [];
                var actionNodeLabels = [];
                var createEntityNodeLabels = [];
                //Create guidance metamodel
                var guidanceMetamodel = {
                    attributes: {},
                    nodes: {},
                    edges: {}
                };

                //Create initial node
                var initialNode = {
                    label: guidancemodel.INITIAL_NODE_LABEL,
                    shape: {
                        shape: "",
                        color: "",
                        defaultWidth: 200,
                        defaultHeight: 60,
                        customShape: startActivityNodeHtml,
                        customAnchors: ""
                    },
                    attributes: {
                    }
                };

                //Add a label attribute to the initial node
                initialNode.attributes[Util.generateRandomId()] = {
                    key: "label",
                    value: "string"
                };

                guidanceMetamodel.nodes[Util.generateRandomId()] = initialNode;

                //Create final node
                var finalNode = {
                    label: guidancemodel.ACTIVITY_FINAL_NODE_LABEL,
                    shape: {
                        shape: "circle",
                        color: "",
                        defaultWidth: 50,
                        defaultHeight: 50,
                        customShape: activityFinalNodeHtml,
                        customAnchors: [ "Perimeter", { shape:"Circle", anchorCount: 60} ]
                    },
                    attributes: {
                    }
                };

                guidanceMetamodel.nodes[Util.generateRandomId()] = finalNode;

                //Create merge node
                var mergeNode = {
                    label: guidancemodel.MERGE_NODE_LABEL,
                    shape: {
                        shape: "diamond",
                        color: "yellow",
                        defaultWidth: 0,
                        defaultHeight: 0,
                        customShape: "",
                        customAnchors: ""
                    },
                    attributes: {
                    }
                };

                guidanceMetamodel.nodes[Util.generateRandomId()] = mergeNode;

                //Create 'call activity node'
                var callActivityNode = {
                    label: guidancemodel.CALL_ACTIVITY_NODE_LABEL,
                    shape: {
                        shape: "rounded_rectangle",
                        color: "",
                        defaultWidth: 100,
                        defaultHeight: 50,
                        customShape: callActivityNodeHtml,
                        customAnchors: ""
                    },
                    attributes: {
                    }
                };

                actionNodeLabels.push(guidancemodel.CALL_ACTIVITY_NODE_LABEL);

                //Add a label attribute to the call activity node
                callActivityNode.attributes[Util.generateRandomId()] = {
                    key: "label",
                    value: "string"
                };

                guidanceMetamodel.nodes[Util.generateRandomId()] = callActivityNode;

                //Create concurrency node
                var concurrencyNode = {
                    label: guidancemodel.CONCURRENCY_NODE_LABEL,
                    shape: {
                        shape: "rectangle",
                        color: "black",
                        defaultWidth: 10,
                        defaultHeight: 200,
                        customShape: "",
                        customAnchors: ""
                    },
                    attributes: {
                    }
                };

                guidanceMetamodel.nodes[Util.generateRandomId()] = concurrencyNode;

                //Create 'create object nodes'
                var createObjectNodeLabels = [];
                var createObjectNodes = {};
                var entityNodes = {};

                var flowEdgeRelations = [];
                var dataFlowEdgeRelations = [];

                var nodes = metamodel.nodes;
                for(var nodeId in nodes){
                    if(nodes.hasOwnProperty(nodeId)){
                        var node = nodes[nodeId];

                        var createObjectNodeToEntityNodeRelation = {sourceTypes: [], targetTypes: []};
                        //Generate the 'create object node'
                        var label = guidancemodel.getCreateObjectNodeLabelForType(node.label);
                        createObjectNodeToEntityNodeRelation.sourceTypes.push(label);
                        actionNodeLabels.push(label);
                        createEntityNodeLabels.push(label);
                        createObjectNodeLabels.push(label);
                        var id = Util.generateRandomId();
                        guidanceMetamodel.nodes[id] = {
                            label: label,
                            attributes: {},
                            shape: {
                                shape: "rounded_rectangle",
                                color: "",
                                defaultWidth: 100,
                                defaultHeight: 50,
                                customShape: _.template(actionNodeHtml, {label: node.label, icon: "plus"}),
                                customAnchors: ""
                            }
                        };

                        createObjectNodes[id] = guidanceMetamodel.nodes[id];

                        //Generate the 'entity node'
                        var entitylabel = guidancemodel.getEntityNodeLabelForType(node.label);
                        createObjectNodeToEntityNodeRelation.targetTypes.push(label);
                        id = Util.generateRandomId();
                        guidanceMetamodel.nodes[id] = {
                            label: entitylabel,
                            attributes: {},
                            shape: {
                                shape: "rectangle",
                                color: "",
                                defaultWidth: 100,
                                defaultHeight: 50,
                                customShape: _.template(entityNodeHtml, {icon: "square", label: node.label}),
                                customAnchors: ""
                            }
                        };

                        //Generate the 'set property node'
                        setPropertyLabel = guidancemodel.getSetPropertyNodeLabelForType(node.label);
                        actionNodeLabels.push(setPropertyLabel);
                        id = Util.generateRandomId();
                        guidanceMetamodel.nodes[id] = {
                            label: setPropertyLabel,
                            attributes: {},
                            shape: {
                                shape: "",
                                defaultWidth: 130,
                                defaultHeight: 50,
                                customShape: _.template(setPropertyNodeHtml, {}),
                                customAnchors: ""
                            }
                        };

                        var options = {};
                        for(var attributeId in node.attributes){
                            var attribute = node.attributes[attributeId];
                            options[attribute.key] = attribute.key;
                        }

                        guidanceMetamodel.nodes[id].attributes[Util.generateRandomId()] = {
                            key: "Property",
                            value: "Value",
                            options: options
                        };

                        entityNodes[id] = guidanceMetamodel.nodes[id];

                        //Define the 'create object node' to 'entity node' relation
                        dataFlowEdgeRelations.push({
                            sourceTypes: [label],
                            targetTypes: [entitylabel]
                        });

                        //Define the 'entity node' to 'set property node' relation
                        dataFlowEdgeRelations.push({
                            sourceTypes: [entitylabel],
                            targetTypes: [setPropertyLabel]
                        });

                        //Define the 'entity node' to 'create relationship node' relation
                        for(var edgeId in metamodel.edges){
                            var edge = metamodel.edges[edgeId];
                            for(var relationId in edge.relations){
                                var relation = edge.relations[relationId];
                                if((relation.sourceTypes.indexOf(node.label) > -1) ||
                                    (relation.targetTypes.indexOf(node.label) > -1)){
                                    dataFlowEdgeRelations.push({
                                        sourceTypes: [entitylabel],
                                        targetTypes: guidancemodel.getCreateRelationshipNodeLabelForType(edge.label)
                                    });
                                    break;
                                }
                            }
                        }
                    }
                }

                //Create 'create relationship nodes'
                var createRelationshipNodes = {};
                var edgesByLabel = {};

                var edges = metamodel.edges;
                for(var edgeId in edges){
                    if(edges.hasOwnProperty(edgeId)){
                        var edge = edges[edgeId];
                        //Generate 'create relationship node'
                        var label = guidancemodel.getCreateRelationshipNodeLabelForType(edge.label);
                        actionNodeLabels.push(label);
                        createEntityNodeLabels.push(label);
                        edgesByLabel[edge.label] = edge;

                        var id = Util.generateRandomId();
                        guidanceMetamodel.nodes[id] = {
                            label: label,
                            attributes: {},
                            shape: {
                                shape: "rounded_rectangle",
                                color: "",
                                defaultWidth: 100,
                                defaultHeight: 50,
                                customShape: _.template(actionNodeHtml, {label: edge.label, icon: "plus"}),
                                customAnchors: ""
                            }
                        };

                        createRelationshipNodes[id] = guidanceMetamodel.nodes[id];

                        //Generate 'entity node'
                        var entitylabel = guidancemodel.getEntityNodeLabelForType(edge.label);

                        var id = Util.generateRandomId();
                        guidanceMetamodel.nodes[id] = {
                            label: entitylabel,
                            attributes: {},
                            shape: {
                                shape: "rectangle",
                                color: "blue",
                                defaultWidth: 100,
                                defaultHeight: 50,
                                customShape: _.template(entityNodeHtml, {icon: "exchange", label: edge.label}),
                                customAnchors: ""
                            }
                        };

                        entityNodes[id] = guidanceMetamodel.nodes[id];

                        //Generate the 'set property node'
                        if(Object.keys(edge.attributes).length > 0){
                            var setPropertyLabel = guidancemodel.getSetPropertyNodeLabelForType(edge.label);
                            actionNodeLabels.push(setPropertyLabel);
                            id = Util.generateRandomId();
                            guidanceMetamodel.nodes[id] = {
                                label: setPropertyLabel,
                                attributes: {},
                                shape: {
                                    shape: "",
                                    defaultWidth: 0,
                                    defaultHeight: 0,
                                    customShape: _.template(setPropertyNodeHtml, {type: setPropertyLabel, color: "white"}),
                                    customAnchors: ""
                                }
                            };

                            var options = {};
                            for(var attributeId in edge.attributes){
                                var attribute = edge.attributes[attributeId];
                                options[attribute.key] = attribute.key;
                            }

                            guidanceMetamodel.nodes[id].attributes[Util.generateRandomId()] = {
                                key: "Property",
                                value: "Value",
                                options: options
                            };
                        }

                        //Define the 'create relationship node' to 'entity node' relation
                        dataFlowEdgeRelations.push({
                            sourceTypes: [label],
                            targetTypes: [entitylabel]
                        });

                        //Define the 'entity node' to 'set property node' relation
                        dataFlowEdgeRelations.push({
                            sourceTypes: [entitylabel],
                            targetTypes: [setPropertyLabel]
                        });

                    }
                }

                //Create the flow edge

                //Relations between all action nodes
                flowEdgeRelations = flowEdgeRelations.concat({
                    sourceTypes: actionNodeLabels,
                    targetTypes: actionNodeLabels.concat([guidancemodel.MERGE_NODE_LABEL, guidancemodel.ACTIVITY_FINAL_NODE_LABEL, guidancemodel.CONCURRENCY_NODE_LABEL])
                });

                //Relations for the initial node
                flowEdgeRelations = flowEdgeRelations.concat({
                    sourceTypes: [guidancemodel.INITIAL_NODE_LABEL],
                    targetTypes: [guidancemodel.CALL_ACTIVITY_NODE_LABEL, guidancemodel.MERGE_NODE_LABEL, guidancemodel.CONCURRENCY_NODE_LABEL].concat(createEntityNodeLabels)
                });

                //Relations for the merge node
                flowEdgeRelations = flowEdgeRelations.concat({
                    sourceTypes: [guidancemodel.MERGE_NODE_LABEL],
                    targetTypes: [guidancemodel.ACTIVITY_FINAL_NODE_LABEL, guidancemodel.MERGE_NODE_LABEL, guidancemodel.CONCURRENCY_NODE_LABEL].concat(actionNodeLabels)
                });

                //Relations for the concurrency node
                flowEdgeRelations = flowEdgeRelations.concat({
                    sourceTypes: [guidancemodel.CONCURRENCY_NODE_LABEL],
                    targetTypes: [guidancemodel.ACTIVITY_FINAL_NODE_LABEL, guidancemodel.CONCURRENCY_NODE_LABEL, guidancemodel.MERGE_NODE_LABEL].concat(actionNodeLabels)
                });

                //Create the action flow edge
                guidanceMetamodel.edges[Util.generateRandomId()] = {
                    label: "Action flow edge",
                    shape: {
                        arrow: "unidirassociation",
                        shape: "curved",
                        color: "black",
                        overlay: "",
                        overlayPosition: "top",
                        overlayRotate: true
                    },
                    relations: flowEdgeRelations
                };

                //Create the data flow edge
                var dataFlowEdge = {
                    label: "Data flow edge",
                    shape: {
                        arrow: "unidirassociation",
                        shape: "curved",
                        color: "blue",
                        overlay: "",
                        overlayPosition: "top",
                        overlayRotate: true
                    },
                    attributes: {},
                    relations: dataFlowEdgeRelations
                };

                dataFlowEdge.attributes[Util.generateRandomId()] = {
                    key: "Destination",
                    value: "Value",
                    options: {
                        "Source": "Source",
                        "Target": "Target"
                    }
                };
                guidanceMetamodel.edges[Util.generateRandomId()] = dataFlowEdge;

                //Create the association edge
                guidanceMetamodel.edges[Util.generateRandomId()] = {
                    label: "Association edge",
                    shape: {
                        arrow: "unidirassociation",
                        shape: "curved",
                        color: "",
                        dashstyle: "4 2",
                        overlay: "",
                        overlayPosition: "hidden",
                        overlayRotate: true
                    },
                    relations: [{sourceTypes: [guidancemodel.CALL_ACTIVITY_NODE_LABEL], targetTypes: [guidancemodel.INITIAL_NODE_LABEL]}]
                };

                return guidanceMetamodel;
            },
            generateLogicalGuidanceRepresentation: function(m){
                var graph = new graphlib.Graph();
                var model;
                if(m)
                    model = m;
                else 
                var model = y.share.data.get('guidancemodel');
                if(!model) 
                    return null;
                var nodes = model.nodes;
                var edges = model.edges;
                //Returns successor node which belong to the action flow (everything except entity nodes)
                var getFlowSuccessors = function(nodeId){
                    var targets = [];
                    var labels = [];
                    for(var edgeId in edges){
                        var edge = edges[edgeId];
                        if(edge.source == nodeId){
                            //var targetType = nodes[edge.target].type
                            if(edge.type == "Action flow edge"){
                                targets.push(edge.target);
                                labels.push(edge.label.value.value);
                            }
                        }
                    }
                    return {
                        targets: targets,
                        labels: labels
                    };
                };

                var getEntitySuccessor = function(nodeId){
                    var targets = [];
                    for(var edgeId in edges){
                        var edge = edges[edgeId];
                        if(edge.source == nodeId){
                            var targetType = nodes[edge.target].type
                            if(targetType = guidancemodel.isEntityNodeLabel(targetType))
                                return edge.target;
                        }
                    }
                    return "";
                };

                var getEntityPredecessorsForCreateRelationshipAction = function(nodeId){
                    var entities = {
                        "Source": "",
                        "Target": ""
                    };
                    for(var edgeId in edges){
                        var edge = edges[edgeId];
                        if(edge.target == nodeId){
                            var sourceType = nodes[edge.source].type
                            if(sourceType = guidancemodel.isEntityNodeLabel(sourceType)){
                                var destination = getAttributeValue(edge, "Destination");
                                entities[destination] = edge.source;
                            }
                        }
                    }
                    return entities;
                };

                var getEntityPredecessorForSetPropertyAction = function(nodeId){
                    for(var edgeId in edges){
                        var edge = edges[edgeId];
                        if(edge.target == nodeId){
                            var sourceType = nodes[edge.source].type
                            if(sourceType = guidancemodel.isEntityNodeLabel(sourceType)){
                                return edge.source;
                            }
                        }
                    }
                    return "";
                };

                var getInitialNodeForCallActivityAction = function(nodeId){
                    for(var edgeId in edges){
                        var edge = edges[edgeId];
                        if(edge.source == nodeId && edge.type == "Association edge"){
                            return edge.target;
                        }
                    }
                    return "";
                };

                var getAttributeValue = function(node, attributeName){
                    for(var attributeId in node.attributes){
                        var attribute = node.attributes[attributeId];
                        if(attribute.name == attributeName)
                            return attribute.value.value;
                    }
                    return "";
                };

                for(var nodeId in nodes){
                    var node = nodes[nodeId];
                    var type = node.type;
                    var subType = "";

                    if(type == guidancemodel.INITIAL_NODE_LABEL){
                        var successors = getFlowSuccessors(nodeId);
                        graph.setNode(nodeId, {
                            "type": "INITIAL_NODE",
                            "name": getAttributeValue(node, "label")
                        });
                        for(var i = 0; i < successors.targets.length; i++){
                            graph.setEdge(nodeId, successors.targets[i], successors.labels[i]);
                        }

                    }
                    else if(type == guidancemodel.MERGE_NODE_LABEL){
                        var successors = getFlowSuccessors(nodeId);
                        graph.setNode(nodeId, {
                            "type": "MERGE_NODE"
                        });
                        for(var i = 0; i < successors.targets.length; i++){
                            graph.setEdge(nodeId, successors.targets[i], successors.labels[i]);
                        }
                    }
                    else if(type == guidancemodel.CONCURRENCY_NODE_LABEL){
                        var successors = getFlowSuccessors(nodeId);
                        graph.setNode(nodeId, {
                            "type": "CONCURRENCY_NODE"
                        });
                        for(var i = 0; i < successors.targets.length; i++){
                            graph.setEdge(nodeId, successors.targets[i], successors.labels[i]);
                        }
                    }
                    else if(type == guidancemodel.ACTIVITY_FINAL_NODE_LABEL){
                        graph.setNode(nodeId, {
                            "type": "ACTIVITY_FINAL_NODE"
                        });
                    }
                    else if (subType = guidancemodel.isCreateObjectNodeLabel(type)){
                        var successors = getFlowSuccessors(nodeId);
                        graph.setNode(nodeId, {
                            "type": "CREATE_OBJECT_ACTION",
                            "objectType": subType,
                            "createdObjectId": getEntitySuccessor(nodeId)
                        });
                        for(var i = 0; i < successors.targets.length; i++){
                            graph.setEdge(nodeId, successors.targets[i], successors.labels[i]);
                        }
                    }
                    else if (subType = guidancemodel.isCreateRelationshipNodeLabel(type)){
                        var entities = getEntityPredecessorsForCreateRelationshipAction(nodeId);
                        var successors = getFlowSuccessors(nodeId);
                        graph.setNode(nodeId, {
                            "type": "CREATE_RELATIONSHIP_ACTION",
                            "relationshipType": subType,
                            "createdRelationshipId": getEntitySuccessor(nodeId),
                            "sourceObjectId": entities["Source"],
                            "targetObjectId": entities["Target"]
                        });
                        for(var i = 0; i < successors.targets.length; i++){
                            graph.setEdge(nodeId, successors.targets[i], successors.labels[i]);
                        }
                    }
                    else if (subType = guidancemodel.isSetPropertyNodeLabel(type)){
                        var successors = getFlowSuccessors(nodeId);
                        graph.setNode(nodeId, {
                            "type": "SET_PROPERTY_ACTION",
                            "entityType": subType,
                            "propertyName": getAttributeValue(node, "Property"),
                            "sourceObjectId": getEntityPredecessorForSetPropertyAction(nodeId)
                        });
                        for(var i = 0; i < successors.targets.length; i++){
                            graph.setEdge(nodeId, successors.targets[i], successors.labels[i]);
                        }
                    }
                    else if (type == guidancemodel.CALL_ACTIVITY_NODE_LABEL){
                        var successors = getFlowSuccessors(nodeId);
                        graph.setNode(nodeId, {
                            "type": "CALL_ACTIVITY_ACTION",
                            "initialNodeId": getInitialNodeForCallActivityAction(nodeId)
                        });
                        for(var i = 0; i < successors.targets.length; i++){
                            graph.setEdge(nodeId, successors.targets[i], successors.labels[i]);
                        }
                    }
                }
                return graphlib.json.write(graph);
            },
            generateGuidanceRules: function(){
                var guidanceRules = {objectToolRules: []};
                var nodes = guidancemodel.guidancemodel.nodes;
                var edges = guidancemodel.guidancemodel.edges;
                for(var nodeId in nodes){
                    var node = nodes[nodeId];
                    var type = node.type;

                    if(guidancemodel.isObjectToolType(type)){
                        var srcObjectType = guidancemodel.getObjectTypeForObjectToolType(type);
                        var destObjectType = null;
                        var relationshipType = null;
                        var relevantEdges = [];
                        var label = "";
                        //Get the label attribute
                        for(var attributeId in node.attributes){
                            if(node.attributes[attributeId].name == "label")
                                label = node.attributes[attributeId].value.value;
                        }
                        var edgeId;
                        for(edgeId in edges){
                            if(edges[edgeId].source == nodeId)
                                relevantEdges.push(edges[edgeId]);
                        }
                        for(var i = 0; i < relevantEdges.length; i++){
                            var edge = relevantEdges[i];
                            var target = nodes[edge.target];
                            if(guidancemodel.isObjectContextType(target.type)){
                                destObjectType = guidancemodel.getObjectTypeForObjectContextType(target.type);
                            }
                            else if(guidancemodel.isRelationshipContextType(target.type)){
                                relationshipType = guidancemodel.getRelationshipTypeForRelationshipContextType(target.type);
                            }
                        }
                        if(destObjectType !== null && relationshipType !== null){
                            var objectToolRule = {
                                srcObjectType: srcObjectType,
                                destObjectType: destObjectType,
                                relationshipType: relationshipType,
                                label: label
                            };
                            guidanceRules.objectToolRules.push(objectToolRule);
                        }
                    }
                }
                return guidanceRules;
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
                    var edgeId, edge, edges;
                    var source, target;
                    var neighbor, options;
                    var attributes = {};
                    var obj = {};

                    if(!visitedNodes) visitedNodes = [];

                    if(visitedNodes.indexOf(node) !== -1) return {};

                    visitedNodes.push(node);

                    //Traverse edges to check for inheritance and linked enums
                    edges = node.getOutgoingEdges();
                    for(edgeId in edges){
                        if(edges.hasOwnProperty(edgeId)){
                            edge = edges[edgeId];
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
                    resourcesToSave.push({'typeName': CONFIG.NS.MY.GUIDANCEMODEL, 'representation': data});
                }
                //In the metamodel editor create the guidance metamodel needed for the guidance editor
                else if(!metamodel.hasOwnProperty('nodes')){
                    resourcesToSave.push({'typeName': CONFIG.NS.MY.METAMODELPREVIEW, 'representation': this.generateMetaModel()});
                    resourcesToSave.push({'typeName': CONFIG.NS.MY.GUIDANCEMETAMODEL, 'representation': this.generateGuidanceMetamodel()});
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
            storeDataYjs: function(){
                var data = this.graphToJSON();
                if(guidancemodel.isGuidanceEditor()){
                    y.share.data.set('guidancemodel',data);

                }else if(!metamodel){
                    y.share.data.set('metamodelpreview', this.generateMetaModel());
                    y.share.data.set('guidancemetamodel', this.generateGuidanceMetamodel());
                    y.share.data.set('model', data);
                }
                else{
                    y.share.data.set('model', data);
                }
            },
            /**
             * Delete the Model Attribute Node
             */
            deleteModelAttribute : function(){
                _modelAttributesNode = null;
            },
            /**
             * resets the EntityManager
             */
            reset : function(){
                _nodes ={};
                _edges = {};
                this.deleteModelAttribute();
            },
            /**
             * initializes the node types
             * @param vls the vvs
             */
            initNodeTypes: function(vls){
                nodeTypes = _initNodeTypes(vls);
            },
            /**
             * initializes the view edge types
             * @param vls the vvs
             */
            initEdgeTypes: function(vls){
                var res = _initEdgeTypes(vls);
                edgeTypes = res.edgeTypes;
                relations = res.relations;
            },
            /**
             * initializes both the node types- and the edge types Object
             * @param vls the vvs
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
             * @param {string} viewId
             */
            setViewId:function(viewId){
                _viewId =viewId;
            },
            /**
             * get the identifier of the view
             * @returns {*}
             */
            getViewId: function(){
                return _viewId;
            },
            /**
             * get nodes by view type
             * @param {string} type the name of the view type
             * @returns {object} a map of objects with key as identifier and value as Node
             */
            getNodesByViewType : function(type){
                if(viewNodeTypes.hasOwnProperty(type)){
                    return this.getNodesByType(viewNodeTypes[type].getTargetNodeType().TYPE);
                }
                return null;
            },
            /**
             * get edges by view type
             * @param {string}type the view type
             * @returns {*}
             */
            getEdgesByViewType:function(type){
                if(viewEdgeTypes.hasOwnProperty(type)){
                    return this.getEdgesByType(viewEdgeTypes[type].getTargetEdgeType().TYPE);
                }
                return null;
            },
            /**
             * Get the current layer you are operating on
             * @returns {string} CONFIG.LAYER.META or CONFIG.LAYER.MODEL
             */
            getLayer: function() {
                return _layer;
            },
            /**
             * Get the relations between nodes and edges types
             * @returns {{}}
             */
            getRelations: function(){
                return relations;
            },
            setGuidance: function(guidance){
                guidancemodel = guidance;
            },
            init:function(mm, gm){
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
