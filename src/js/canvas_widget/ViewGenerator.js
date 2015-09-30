define(['canvas_widget/EntityManager'], /**@lends ViewGenerator*/ function (EntityManager){
    /**
     * Transforms a the nodes and edges of a model using a particular VLS to another VLS
     * Currently only works if the fromVLS is the meta-model (the initial VLS) but this should work in all directions as well as with vvs to vvs
     * @param fromVLS the current VLS
     * @param toVLS the target VLS the model should be transformed to
     * @constructor
     */
    function ViewGenerator(fromVLS, toVLS){

        var viewpointNodes = toVLS.nodes;
        var _processed = {};

        //transform the view types
        for(var vpNodeKey in viewpointNodes){
            if(viewpointNodes.hasOwnProperty(vpNodeKey)){
                var nodeViewType =viewpointNodes[vpNodeKey];
                if(nodeViewType.hasOwnProperty('target')) {
                    _processed[nodeViewType.target] = true;
                    applyViewTypeToNodes(nodeViewType.label);
                } else{
                    //Todo new Object classes
                }
            }
        }

        //Hide the other types
        var nodeTypes = fromVLS.nodes;
        for(var nodeTypeKey in nodeTypes){
            if(nodeTypes.hasOwnProperty(nodeTypeKey)&& !_processed.hasOwnProperty(nodeTypeKey)){
                var nodes = EntityManager.getNodesByType(nodeTypes[nodeTypeKey].label);
                for(var nodeKey in nodes){
                    if(nodes.hasOwnProperty(nodeKey)){
                        nodes[nodeKey].hide();
                    }
                }
            }
        }

        var viewpointEdges = toVLS.edges;
        //transform edges
        for(var vpEdgeKey in viewpointEdges){
            if(viewpointEdges.hasOwnProperty(vpEdgeKey)){
                var edgeViewType =viewpointEdges[vpEdgeKey];
                if(edgeViewType.hasOwnProperty('target')) {
                    _processed[edgeViewType.target] = true;
                    applyViewTypeToEdges(edgeViewType.label);
                } else{
                    //Todo new Object classes
                }
            }
        }


        function applyViewTypeToNodes(viewTypeLabel){
            var originType = EntityManager.lookupViewTypeMapping(toVLS.id, viewTypeLabel);
            var nodeTypeObject = EntityManager.getNodeType(viewTypeLabel);
            var nodes = EntityManager.getNodesByType(originType);
            for(var nodeKey in nodes){
                if(nodes.hasOwnProperty(nodeKey)){
                    var node = nodes[nodeKey];
                    node.set$shape(nodeTypeObject.$SHAPE);
                    node.setAnchorOptions(nodeTypeObject.Anchors);
                    node.show();
                }
            }
        }

        function applyViewTypeToEdges(viewTypeLabel){
            var originType = EntityManager.lookupViewTypeMapping(toVLS.id, viewTypeLabel);
            var edgeTypeObject = EntityManager.getEdgeType(viewTypeLabel);
            var edges = EntityManager.getEdgesByType(originType);
            for(var edgeKey in edges){
                if(edges.hasOwnProperty(edgeKey)){
                    edges[edgeKey].restyle(edgeTypeObject.ArrowShape, edgeTypeObject.Color, edgeTypeObject.ShapeType, edgeTypeObject.Overlay, edgeTypeObject.OverlayPosition, edgeTypeObject.OverlayRotate, edgeTypeObject.Attributes);
                }
            }
        }

    }
    return ViewGenerator;
});