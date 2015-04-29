define(['lodash', 'Util'],

    function(_, Util){

        /**
         * get the edges between two nodes
         * @param node1 the first node
         * @param node2 the second node
         * @returns {object} the Edge object
         */
        function getEdgeBetween(node1, node2){
            var edgeKey =  _.intersection(_.keys(node1.getEdges()), _.keys(node2.getEdges()));
           return node1.getEdges()[edgeKey];
        }

        /**
         * return an object that consist of the source, target and type
         * if baseId is the source or the target replace the base id with the view type id else with the new id
         * @param edge the edge of the base model
         * @param baseId the id of the target base element
         * @param viewTypeId the id of the view type element
         * @param newId the new id of the base element in the viewpoint
         * @returns {{source: *, target: *, type: *}}
         */
        function getEdgeEndpoints(edge,baseId, viewTypeId, newId) {
            var sourceId = edge.getSource().getEntityId();
            var targetId = edge.getTarget().getEntityId();
            return {
                origin: edge.getEntityId(),
                source: sourceId=== baseId ? viewTypeId: newId,
                target:  targetId === baseId ? viewTypeId: newId,
                type: edge.getType()
            }
        }

        /**
         * recursively add the generalisation relations to the viewpoint
         * @param addToViewpoint the viewpoint creation map with the nodes and edges for the canvas widget
         * @param viewId the identifier of the view
         * @param baseNode the node to start
         * @returns {*} the viewpoint creation map with the nodes and edges for the canvas widget
         */
        function getGeneralizationHierarchy(addToViewpoint, viewId, baseNode){
            var EntityManager = require('attribute_widget/EntityManager');
            var newEdgeId, newId, refId = null;
            var outEdges =  baseNode.getOutgoingEdges();
            for(var outEdgeKey in outEdges){
                if(outEdges.hasOwnProperty(outEdgeKey) && outEdges[outEdgeKey].getType() === 'Generalisation'){
                    var generalizationEdge = outEdges[outEdgeKey];
                    var superClassNode =generalizationEdge.getTarget();
                    if(superClassNode.getType() === 'Abstract Class') {
                        var superClassId = superClassNode.getEntityId();
                        if (!EntityManager.doesMapExists(viewId, superClassId)) {
                            newId = Util.generateRandomId();
                            addToViewpoint.nodes[newId] = superClassId;
                            EntityManager.addToMap(viewId, superClassId, newId);
                            refId = newId;
                        }
                        else
                            refId = EntityManager.lookupMap(viewId, superClassId);

                        var generalizationEdgeId = generalizationEdge.getEntityId();
                        if (!EntityManager.doesMapExists(viewId, generalizationEdgeId)) {
                            newEdgeId = Util.generateRandomId();
                            EntityManager.addToMap(viewId, generalizationEdgeId, newEdgeId);
                            addToViewpoint.edges[newEdgeId] = {
                                origin: generalizationEdgeId,
                                type: 'Generalisation',
                                source: EntityManager.lookupMap(viewId, baseNode.getEntityId()),
                                target: refId
                            };
                        }
                        addToViewpoint = getGeneralizationHierarchy(addToViewpoint, viewId, superClassNode);
                    }
                }
            }
            return addToViewpoint;
        }

        /**
         * the closed-view-generation algorithm
         * looks for neighbors of a base node and generates a json to add the neighbors to the viewpoint model
         * @param baseNode the base node is the target of the view type node
         * @param viewType the view type node
         * @returns {{nodes: {}, edges: {}}}
         * @constructor
         */
        function CVG(baseNode, viewType){
            var EntityManager = require('attribute_widget/EntityManager');
            var addToViewpoint = { nodes:{}, edges:{}};
            var viewId = viewType.getViewId();
            var neighbors = baseNode.getNeighbors();
            //iterate over the neighbors of target of the view type element
            for(var neighborId in neighbors){
                if(neighbors.hasOwnProperty(neighborId)){
                    //the new id for the neighbor
                    var newId = Util.generateRandomId();
                    //either the new id or the id found in the map
                    var refId = null, newEdgeId = null, originalEdge = null;
                    var neighbor = neighbors[neighborId];
                    //node shapes, edge shapes and enums are connected by a bi-dir-association
                    if(neighbor.getType()=== 'Node Shape' || neighbor.getType()=== 'Edge Shape' || neighbor.getType() === 'Enumeration') {
                        //create the neighbor if he is not in the map dictionary
                        if(!EntityManager.doesMapExists(viewId, neighborId)){
                            addToViewpoint.nodes[newId] = neighborId;
                            EntityManager.addToMap(viewId,neighborId, newId);
                            refId = newId;
                        }
                        else
                            refId = EntityManager.lookupMap(viewId, neighborId);

                        originalEdge = getEdgeBetween(baseNode, neighbor);
                        if(!EntityManager.doesMapExists(viewId,originalEdge.getEntityId())){
                            newEdgeId = Util.generateRandomId();
                            EntityManager.addToMap(viewId, originalEdge.getEntityId(), newEdgeId);
                            addToViewpoint.edges[newEdgeId] = {
                                origin:originalEdge.getEntityId(),
                                type: originalEdge.getType(),
                                source: viewType.getEntityId(),
                                target:refId
                            };
                        }

                    }
                    else if(neighbor.getType() === 'Abstract Class'){
                        //create the neighbor if he is not in the map dictionary
                        if(!EntityManager.doesMapExists(viewId, neighborId)){
                            addToViewpoint.nodes[newId] = neighborId;
                            EntityManager.addToMap(viewId,neighborId, newId);
                            refId = newId;
                        }
                        else
                            refId = EntityManager.lookupMap(viewId, neighborId);

                        originalEdge = getEdgeBetween(baseNode, neighbor);
                        if(!EntityManager.doesMapExists(viewId,originalEdge.getEntityId())){
                            newEdgeId = Util.generateRandomId();
                            EntityManager.addToMap(viewId, originalEdge.getEntityId(), newEdgeId);
                            addToViewpoint.edges[newEdgeId] = {
                                origin:originalEdge.getEntityId(),
                                type: originalEdge.getType(),
                                source: viewType.getEntityId(),
                                target:refId
                            };
                        }
                        addToViewpoint = getGeneralizationHierarchy(addToViewpoint, viewId, neighbor);

                    }
                    else if((neighbor.getType() === 'Object' || neighbor.getType() === 'Relationship') && EntityManager.doesMapExists(viewId,neighborId)){
                        var edge1 =getEdgeBetween(baseNode, neighbor);
                        if(!EntityManager.doesMapExists(viewId,edge1.getEntityId())) {
                            newEdgeId = Util.generateRandomId();
                            addToViewpoint.edges[newEdgeId] = getEdgeEndpoints(edge1, baseNode.getEntityId(), viewType.getEntityId(), EntityManager.lookupMap(viewId, neighborId));
                            EntityManager.addToMap(viewId,edge1.getEntityId(), newEdgeId);
                        }

                    }else if(neighbor.getType() === 'Relation'){
                        var relationNeighbors = neighbor.getNeighbors();
                        for(var key in relationNeighbors){
                            if(relationNeighbors.hasOwnProperty(key) &&
                                ((relationNeighbors[key].getType() === 'Relationship' && baseNode.getType() === 'Object')
                                || (relationNeighbors[key].getType() === 'Object' && baseNode.getType() === 'Relationship'))){
                                var relationshipId = relationNeighbors[key].getEntityId();
                                if(EntityManager.doesMapExists(viewId,relationshipId)) {
                                    if (!EntityManager.doesMapExists(viewId,neighborId)) {
                                        addToViewpoint.nodes[newId] = neighborId;
                                        EntityManager.addToMap(viewId,neighborId, newId);
                                        refId = newId;
                                    }
                                    else
                                        refId = EntityManager.lookupMap(viewId,neighborId);

                                    var edge2 = getEdgeBetween(baseNode, neighbor);
                                    if(!EntityManager.doesMapExists(viewId,edge2.getEntityId())) {
                                        newEdgeId = Util.generateRandomId();
                                        addToViewpoint.edges[newEdgeId] = getEdgeEndpoints(edge2, baseNode.getEntityId(), viewType.getEntityId(), refId);
                                        EntityManager.addToMap(viewId, edge2.getEntityId(), newEdgeId);
                                    }
                                    var edge3 = getEdgeBetween(neighbor, relationNeighbors[key]);
                                    if(!EntityManager.doesMapExists(viewId,edge3.getEntityId())){
                                        newEdgeId = Util.generateRandomId();
                                        addToViewpoint.edges[newEdgeId] = getEdgeEndpoints(edge3, relationshipId, EntityManager.lookupMap(viewId,relationshipId), refId);
                                        EntityManager.addToMap(viewId, edge3.getEntityId(), newEdgeId);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            addToViewpoint.viewTypeId = viewType.getEntityId();
            return addToViewpoint;
        }
        return CVG;
    });
