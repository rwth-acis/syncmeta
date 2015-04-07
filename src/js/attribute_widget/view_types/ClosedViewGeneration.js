define(['lodash', 'Util'],
    function(_, Util){

        /**
         * get the edges between two nodes
         * @param node1 the first node
         * @param node2 the second ndoe
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
            return {
                source: edge.getSource().getEntityId()=== baseId ? viewTypeId: newId,
                target: edge.getTarget().getEntityId() === baseId ? viewTypeId: newId,
                type: edge.getType()
            }
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
            var neighbors = baseNode.getNeighbors();
            //iterate over the neighbors of target of the view type element
            for(var neighborId in neighbors){
                if(neighbors.hasOwnProperty(neighborId)){
                    //the new id for the neighbor
                    var newId = Util.generateRandomId();
                    //either the new id or the id found in the map
                    var refId = null;
                    var neighbor = neighbors[neighborId];
                    //node shapes, edge shapes and enums are connected by a bi-dir-association
                    if(neighbor.getType()=== 'Node Shape' || neighbor.getType()=== 'Edge Shape' || neighbor.getType() === 'Enumeration' ) {
                        //create the neighbor if he is not in the map dictionary
                        if(!EntityManager.doesMapExists(neighborId)) {
                            addToViewpoint.nodes[newId] = neighborId;
                            EntityManager.addToMap(neighborId, newId);
                            refId = newId;
                        }
                        else
                            refId = EntityManager.lookupMap(neighborId);

                        addToViewpoint.edges[Util.generateRandomId()] = {
                            type:'Bi-Dir-Association',
                            source: viewType.getEntityId(),
                            target:refId
                        };
                    }
                    //abstract classes are connected by a generalisation edge to the view type object
                    else if(neighbor.getType() === 'Abstract Class'){
                        if(!EntityManager.doesMapExists(neighborId)) {
                            addToViewpoint.nodes[newId] = neighborId;
                            EntityManager.addToMap(neighborId, newId);
                            refId = newId;
                        }
                        else
                            refId = EntityManager.lookupMap(neighborId);

                        addToViewpoint.edges[Util.generateRandomId()] = {
                            type:'Generalisation',
                            source: viewType.getEntityId(),
                            target:refId
                        };
                    }
                    else if((neighbor.getType() === 'Object' ||
                        neighbor.getType() === 'Relationship') &&
                        EntityManager.doesMapExists(neighborId)){
                        var edge1 =getEdgeBetween(baseNode, neighbor);
                        addToViewpoint.edges[newId] = getEdgeEndpoints(edge1, baseNode.getEntityId(), viewType.getEntityId(), newId);

                    }else if(neighbor.getType() === 'Relation'){
                        var relationNeighbors = neighbor.getNeighbors();
                        for(var key in relationNeighbors){
                            if(relationNeighbors.hasOwnProperty(key) && (relationNeighbors[key].getType() === 'Relationship' || relationNeighbors[key].getType() === 'Object')){
                                var relationshipId = relationNeighbors[key].getEntityId();
                                if(EntityManager.doesMapExists(relationshipId)) {
                                    if (!EntityManager.doesMapExists(neighborId)) {
                                        addToViewpoint.nodes[newId] = neighborId;
                                        EntityManager.addToMap(neighborId, newId);
                                        refId = newId;
                                    }
                                    else
                                        refId = EntityManager.lookupMap(neighborId);

                                    var edge2 = getEdgeBetween(baseNode, neighbor);
                                    addToViewpoint.edges[Util.generateRandomId()] = getEdgeEndpoints(edge2, baseNode.getEntityId(), viewType.getEntityId(), refId);
                                    var edge3 = getEdgeBetween(neighbor, relationNeighbors[key]);
                                    addToViewpoint.edges[Util.generateRandomId()] = getEdgeEndpoints(edge3, relationshipId, EntityManager.lookupMap(relationshipId), refId);
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
