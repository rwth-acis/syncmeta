import dagre from 'dagre';
import EntityManager from "./EntityManager";
    
    function DagreLayout() {
        return {
            apply: function () {
                var node, edge, e, appearance, graph, relX, relY, x, y;
                var g = new dagre.graphlib.Graph();
                g.setGraph({});
                g.setDefaultEdgeLabel(function () { return {}; });
                var nodes = EntityManager.getNodes();

                for (var nodeId in nodes) {
                    if (nodes.hasOwnProperty(nodeId)) {
                        node = nodes[nodeId];
                        appearance = node.getAppearance();
                        g.setNode(nodeId, { width: appearance.width, height: appearance.height });
                    }
                }
                var edges = EntityManager.getEdges();
                for (var edgeId in edges) {
                    if (edges.hasOwnProperty(edgeId)) {
                        edge = edges[edgeId];
                        g.setEdge(edge.getSource().getEntityId(), edge.getTarget().getEntityId());
                    }
                }
                dagre.layout(g, { rankdir: "BT", align: "UL", ranker: "tight-tree", marginx:9000, marginy:9000 });
                
                relX = 4500 - g.graph().width/2;
                relY = 4500 - g.graph().height/2; 
                g.nodes().forEach(function (v) {
                    e = EntityManager.findNode(v);
                    if (e) {
                        appearance = e.getAppearance();
                        node = g.node(v);
                        x = relX + node.x;
                        y = relY + node.y;
                        if(appearance.top !== x || appearance.top !== y)  
                            e.moveAbs(x, y);
                    }
                });
            }
        }
    }
    export default new DagreLayout();
