define(['attribute_widget/EntityManager'], /**@lends ViewGenerator*/ function (EntityManager){

    /**
     * Generates the Views
     * @constructor
     */
    function ViewGenerator(){}

    /**
     * Applies a node type to a node
     * @param {object} nodeType the node type object. Be found in the EntityManager via getNodeType(typeName)
     * @param {canvas_widget.Node} node the node
     */
    function applyNodeTypeToNode(nodeType,node){
        node.applyAttributeRenaming(nodeType.getAttributes());

    }

    /**
     * Applies a node type to a set of nodes
     * @param {object} nodeType the node type object. Be found in the EntityManager via getNodeType(typeName)
     * @param {object} nodes nodes as key value store
     */
    function applyNodeTypeToNodes(nodeType, nodes){
        for(var nodeKey in nodes){
            if(nodes.hasOwnProperty(nodeKey)){
                applyNodeTypeToNode(nodeType, nodes[nodeKey]);
            }
        }
    }

    /**
     * Applies a edge type to a edge
     * @param {object} edgeType the edge type object can be found in the EntityManager via getEdgeType(typeName)
     * @param {canvas_widget.Edge} edge the edge to transform
     */
    function applyEdgeTypeToEdge(edgeType, edge){
        edge.applyAttributeRenaming(edgeType.getAttributes());
    }

    /**
     * Applies a edge type to a set of nodes
     * @param {object} edgeType the edge type object can be found in the EntityManager via getEdgeType(typeName)
     * @param {object} edges the edges as key value store
     */
    function applyEdgeTypeToEdges(edgeType,edges){
        for(var edgeKey in edges){
            if(edges.hasOwnProperty(edgeKey)){
                applyEdgeTypeToEdge(edgeType, edges[edgeKey]);
            }
        }
    }

    /**
     * Transforms a the nodes and edges of a model using a particular VLS to another VLS
     * Currently only works if the vls is the meta-model (the initial VLS) but this should work in all directions as well as with vvs to vvs
     * @param vls the current VLS
     * @param vvs the target VLS the model should be transformed to
     */
    ViewGenerator.generate = function(vls, vvs){
        var _processed = {};

        //transform the view types
        var viewpointNodes = vvs.nodes;
        for(var vpNodeKey in viewpointNodes){
            if(viewpointNodes.hasOwnProperty(vpNodeKey)){
                var nodeViewType =viewpointNodes[vpNodeKey];
                if(nodeViewType.hasOwnProperty('target')) {
                    _processed[nodeViewType.target] = true;
                    var viewNodeTypeObject = EntityManager.getViewNodeType(nodeViewType.label);
                    applyNodeTypeToNodes(viewNodeTypeObject, EntityManager.getNodesByType(viewNodeTypeObject.getTargetNodeType().getType()));
                }
            }
        }

        //transform edges
        var viewpointEdges = vvs.edges;
        for(var vpEdgeKey in viewpointEdges){
            if(viewpointEdges.hasOwnProperty(vpEdgeKey)){
                var edgeViewType =viewpointEdges[vpEdgeKey];
                if(edgeViewType.hasOwnProperty('target')) {
                    _processed[edgeViewType.target] = true;
                    var viewEdgeTypeObject = EntityManager.getViewEdgeType(edgeViewType.label);
                    applyEdgeTypeToEdges(viewEdgeTypeObject, EntityManager.getEdgesByType(viewEdgeTypeObject.getTargetEdgeType().getType()));
                }
            }
        }
    };

    /**
     * resets the view generator
     * @param vls
     */
    ViewGenerator.reset = function(vls){
        var typeName;
        var nodes = vls.nodes;
        for(var nodeKey in nodes){
            if(nodes.hasOwnProperty(nodeKey)){
                typeName = nodes[nodeKey].label;
                applyNodeTypeToNodes(EntityManager.getNodeType(typeName), EntityManager.getNodesByType(typeName));
            }
        }

        var edges = vls.edges;
        for(var edgeKey in edges){
            if(edges.hasOwnProperty(edgeKey)){
                typeName = edges[edgeKey].label;
                applyEdgeTypeToEdges(EntityManager.getEdgeType(typeName), EntityManager.getEdgesByType(typeName));
            }
        }

    };
    return ViewGenerator;
});