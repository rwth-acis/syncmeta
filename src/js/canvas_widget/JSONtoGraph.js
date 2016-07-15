define(['jquery', 'lodash', 'canvas_widget/EntityManager'], function($, _, EntityManager) {
    return function(json, canvas) {
        if (!canvas)
            return new Error('No canvas object defined!');

        function cleanUpYSpace(entity) {
            var jsonKeys = _.keys(json[entity]);
            var yKeys = y.share[entity].keys();
            var diff = _.difference(yKeys, jsonKeys);

            for (var i = 0; i < diff.length; i++) {
                y.share[entity].delete(diff[i]);
            }
        }

        cleanUpYSpace('nodes');
        cleanUpYSpace('edges');

        var deferred = $.Deferred();
        var numberOfNodes = _.keys(json.nodes).length;
        var numberOfEdges = _.keys(json.edges).length;
        var createdNodes = 0;
        var createdEdges = 0;

        function createYTextAttribute(map, val) {
            //var deferred = $.Deferred();
            var promise = map.get(val.getEntityId());
            if (promise === undefined) {
                map.set(val.getEntityId(), Y.Text).then(function(ytext) {
                    if (!val.hasOwnProperty('registerYType'))
                        val.getValue().registerYType(ytext);
                    else
                        val.registerYType(ytext);
                    //deferred.resolve();
                });
            }
            else {
                map.get(val.getEntityId()).then(function(ytext) {
                    if (!val.hasOwnProperty('registerYType'))
                        val.getValue().registerYType(ytext);
                    else
                        val.registerYType(ytext);

                    //deferred.resolve();

                })
            }
            //return deferred.promise();
        }

        function createModelAttributeCallback(map) {
            var promises = [];
            var modelAttributesNode = EntityManager.createModelAttributesNodeFromJSON(json.attributes);


            var attrs = modelAttributesNode.getAttributes();
            for (var key in attrs) {
                if (attrs.hasOwnProperty(key)) {
                    var val = attrs[key].getValue();
                    if (val.constructor.name === "Value") {
                        promises.push(createYTextAttribute(map, val));
                    }
                }
            }


            if (promises.length > 0) {
                $.when.apply(null, promises).done(function() {
                    modelAttributesNode.registerYMap(map, true);
                    canvas.setModelAttributesNode(modelAttributesNode);
                    modelAttributesNode.addToCanvas(canvas);

                });
            } else {
                modelAttributesNode.registerYMap(map, true);
                canvas.setModelAttributesNode(modelAttributesNode);
                modelAttributesNode.addToCanvas(canvas);

            }

        }

        function createNodeCallback(deferred, map, jsonNode, nodeId) {
            var node = EntityManager.createNodeFromJSON(
                jsonNode.type,
                nodeId,
                map.get('left') ? map.get('left') : jsonNode.left,
                map.get('top') ? map.get('top') : jsonNode.top,
                map.get('width') ? map.get('width') : jsonNode.width,
                map.get('height') ? map.get('height') : jsonNode.height,
                map.get('zIndex') ? map.get('zIndex') : jsonNode.zIndex,
                jsonNode);

            if (node === undefined) {
                console.error('SYNCMETA: Node undefined. Check if ' + jsonNode.type + '  type is defined in the VLS');
                return;
            }

            var promises = [];
            var attrs, attr;
            if (EntityManager.getLayer() === CONFIG.LAYER.META) {
                //promises.push(createYTextAttribute(map,node.getLabel()));
                createYTextAttribute(map, node.getLabel());
                if (jsonNode.type === "Edge Shape") {
                    //promises.push(createYTextAttribute(map,node.getAttribute(nodeId+'[color]')));
                    createYTextAttribute(map, node.getAttribute(nodeId + '[color]'));
                    //promises.push(createYTextAttribute(map,node.getAttribute(nodeId+'[overlay]')));
                    createYTextAttribute(map, node.getAttribute(nodeId + '[overlay]'));

                } else if (jsonNode.type === "Node Shape") {
                    //promises.push(createYTextAttribute(map,node.getAttribute(nodeId  +'[color]')));
                    createYTextAttribute(map, node.getAttribute(nodeId + '[color]'));
                    //promises.push(createYTextAttribute(map,node.getAttribute(nodeId+'[customAnchors]')));
                    createYTextAttribute(map, node.getAttribute(nodeId + '[customAnchors]'));
                    //promises.push(createYTextAttribute(map,node.getAttribute(nodeId+'[customShape]')));
                    //createYTextAttribute(map,node.getAttribute(nodeId+'[customShape]'));
                }
                else if (jsonNode.type === 'Object' || jsonNode.type === 'Relationship' || jsonNode.type === 'Abstract Class') {
                    attrs = node.getAttribute('[attributes]').getAttributes();
                    for (var attrKey in attrs) {
                        if (attrs.hasOwnProperty(attrKey)) {
                            attr = attrs[attrKey];
                            //promises.push(createYTextAttribute(map, attr.getKey()));
                            createYTextAttribute(map, attr.getKey());
                        }
                    }
                }
                else if (jsonNode.type === 'Enumeration') {
                    attrs = node.getAttribute('[attributes]').getAttributes();
                    for (var attrKey2 in attrs) {
                        if (attrs.hasOwnProperty(attrKey2)) {
                            attr = attrs[attrKey2];
                            //promises.push(createYTextAttribute(map, attr.getValue()));
                            createYTextAttribute(map, attr.getValue());
                        }
                    }
                } else if (jsonNode.type === 'ViewObject' || jsonNode.type === 'ViewRelationship') {
                    attrs = node.getAttribute('[attributes]').getAttributes();
                    for (var attrKey3 in attrs) {
                        if (attrs.hasOwnProperty(attrKey3)) {
                            attr = attrs[attrKey3];
                            //promises.push(createYTextAttribute(map, attr.getValue()));
                            createYTextAttribute(map, attr.getKey());
                        }
                    }
                    if (node.getAttribute('[condition]')) {
                        var conditions = node.getAttribute('[condition]').getAttributes();
                        for (var attrKey4 in conditions) {
                            if (conditions.hasOwnProperty(attrKey4)) {
                                attr = conditions[attrKey4];
                                //promises.push(createYTextAttribute(map, attr.getValue()));
                                createYTextAttribute(map, attr.getKey());
                            }
                        }
                    }
                }
            }
            else {
                attrs = node.getAttributes();
                for (var key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        var val = attrs[key].getValue();
                        if (val.constructor.name === "Value") {
                            //promises.push(createYTextAttribute(map,val));
                            createYTextAttribute(map, val);
                        }
                    }
                }

            }

            if (promises.length > 0) {
                $.when.apply(null, promises).done(function() {
                    node.registerYMap(map, true);
                    node.addToCanvas(canvas);
                    node.bindMoveToolEvents();
                    node.draw();

                    deferred.resolve(nodeId);
                });
            } else {
                node.registerYMap(map, true);
                node.addToCanvas(canvas);
                node.bindMoveToolEvents();
                node.draw();
                deferred.resolve(nodeId);
            }
        }
        function createNode(nodeId, jsonNode) {
            var deferred = $.Deferred();
            if (y.share.nodes.opContents.hasOwnProperty(nodeId)) {
                y.share.nodes.get(nodeId).then(function(map) {
                    createNodeCallback(deferred, map, jsonNode, nodeId);
                })
            } else {
                y.share.nodes.set(nodeId, Y.Map).then(function(map) {
                    map.set('left', jsonNode.left);
                    map.set('top', jsonNode.top);
                    map.set('width', jsonNode.width);
                    map.set('height', jsonNode.height);
                    map.set('zIndex', jsonNode.zIndex);
                    createNodeCallback(deferred, map, jsonNode, nodeId);

                })
            }
            return deferred.promise();
        }
        function createNodes(nodes) {
            var deferred = $.Deferred();
            for (var nodeId in nodes) {
                if (nodes.hasOwnProperty(nodeId)) {
                    createNode(nodeId, nodes[nodeId]).done(function() {
                        createdNodes++;
                        deferred.notify(createdNodes);
                    });
                }
            }
            return deferred.promise();
        }

        function registerEdgeCallback(deferred, edge, map) {
            var promises = [];
            //promises.push(createYTextAttribute(map,edge.getLabel()));
            createYTextAttribute(map, edge.getLabel());
            if (EntityManager.getLayer() === CONFIG.LAYER.MODEL) {
                var attrs = edge.getAttributes();
                for (var key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        var val = attrs[key].getValue();
                        if (val.constructor.name === "Value") {
                            //promises.push(createYTextAttribute(map,val));
                            createYTextAttribute(map, val);
                        }
                    }
                }
            }

            if (promises.length > 0) {
                $.when.apply(null, promises).done(function() {
                    edge.registerYMap(map, true);
                    edge.addToCanvas(canvas);
                    edge.connect();
                    edge.bindMoveToolEvents();
                    deferred.resolve();
                    //canvas.resetTool();

                });
            } else {
                edge.registerYMap(map, true);
                edge.addToCanvas(canvas);
                edge.connect();
                edge.bindMoveToolEvents();
                deferred.resolve();
                //canvas.resetTool();
            }
        }
        function registerEdge(edge) {
            var deferred = $.Deferred();
            if (y.share.edges.opContents.hasOwnProperty(edge.getEntityId())) {
                y.share.edges.get(edge.getEntityId()).then(function(map) {
                    registerEdgeCallback(deferred, edge, map);
                })
            } else {
                y.share.edges.set(edge.getEntityId(), Y.Map).then(function(map) {
                    registerEdgeCallback(deferred, edge, map);
                })
            }
            return deferred.promise();

        }
        function registerEdges(edges) {
            var deferred = $.Deferred();
            for (edgeId in edges) {
                if (edges.hasOwnProperty(edgeId)) {
                    //create edge
                    var edge = EntityManager.createEdgeFromJSON(edges[edgeId].type, edgeId, edges[edgeId].source, edges[edgeId].target, edges[edgeId]);

                    if (edge === undefined) {
                        console.error('SYNCMETA: Edge undefined. Check if ' + edges[edgeId].type + '  type is defined in the VLS');
                        continue;
                    }

                    //register it to Yjs and draw it to the canvas
                    registerEdge(edge).done(function() {
                        createdEdges++;
                        deferred.notify(createdEdges);
                    });
                }
            }
            return deferred.promise();
        }

        if (json.attributes && !_.isEmpty(json.attributes)) {
            if (y.share.nodes.opContents.hasOwnProperty('modelAttributes')) {
                y.share.nodes.get('modelAttributes').then(function(map) {
                    createModelAttributeCallback(map);
                });
            } else {
                y.share.nodes.set('modelAttributes', Y.Map).then(function(map) {
                    createModelAttributeCallback(map);
                });

            }
        }

        if (numberOfNodes > 0) {
            createNodes(json.nodes).then(null, null, function(createdNodes) {
                if (createdNodes === numberOfNodes) {
                    if (numberOfEdges > 0) {
                        registerEdges(json.edges).then(null, null, function(createdEdges) {
                            if (createdEdges === numberOfEdges) {
                                canvas.resetTool();
                                deferred.resolve('SYNCMETA:Created nodes:' + createdNodes + 'Created Edges: ' + createdEdges);

                            }
                        });
                    } else
                        deferred.resolve('SYNCMETA:Created nodes:' + createdNodes);
                }
            });
        } else
            deferred.resolve('SYNCMETA: Model is empty');
        return deferred.promise();
    }
});