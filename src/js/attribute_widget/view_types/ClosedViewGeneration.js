define(['lodash', 'Util'],
    function(_, Util){

        function getEdgeBetween(node1, node2){
            var edgeKey =  _.intersection(_.keys(node1.getEdges()), _.keys(node2.getEdges()));
           return node1.getEdges()[edgeKey];
        }

        function CVG(baseNode, viewtype){
            var EntityManager = require('attribute_widget/EntityManager');
            var addToViewpoint = { nodes:{}, edges:{}};
            var neighbors = baseNode.getNeighbors();
            for(var neighborId in neighbors){
                if(neighbors.hasOwnProperty(neighborId)){
                    var newId = Util.generateRandomId();
                    var neighbor = neighbors[neighborId];
                    if((neighbor.getType()=== 'Node Shape' ||
                        neighbor.getType()=== 'Edge Shape' ||
                        neighbor.getType() === 'Enumeration' ||
                        neighbor.getType() === 'Abstract Class') &&
                        !EntityManager.doesMapExists(neighborId)){
                        addToViewpoint.nodes[newId] = neighborId;
                        EntityManager.addToMap(neighborId, newId)
                    }
                    else if((neighbor.getType() === 'Object' ||
                        neighbor.getType() === 'Relationship') &&
                        EntityManager.doesMapExists(neighborId)){
                       var edge = getEdgeBetween(baseNode, neighbor);
                       addToViewpoint.edges[newId] = {
                           source:viewtype.getEntityId(),
                           target:neighborId,
                           type:edge.getType()
                       }
                    }else if(neighbor.getType() === 'Relation'){
                        var relationNeighbors = neighbor.getNeighbors();
                        for(var key in relationNeighbors){
                            if(relationNeighbors.hasOwnProperty(key) && relationNeighbors[key].getType() === 'Relationship'){
                                var relationshipId = relationNeighbors[key].getEntityId();
                                if(EntityManager.doesMapExists(relationshipId)){
                                    addToViewpoint.nodes[newId] = neighborId;
                                    var edge = getEdgeBetween(baseNode, neighbor);
                                    addToViewpoint.edges[Util.generateRandomId()] = {
                                        source:viewtype.getEntityId(),
                                        target:neighborId,
                                        type: edge.getType()

                                    }
                                }

                            }
                        }
                    }
                }
            }
            return addToViewpoint;
        }
        return CVG;
    });
