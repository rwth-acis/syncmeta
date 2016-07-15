define([
    'jqueryui',
    'jsplumb',
    'canvas_widget/AbstractCanvasTool',
    'canvas_widget/EntityManager'
],/** @lends MoveTool */function($, jsPlumb, AbstractCanvasTool, EntityManager) {

    MoveTool.TYPE = "MoveTool";

    MoveTool.prototype = new AbstractCanvasTool();
    MoveTool.prototype.constructor = MoveTool;
    /**
     * MoveTool
     * @class canvas_widget.MoveTool
     * @extends canvas_widget.AbstractCanvasTool
     * @memberof canvas_widget
     * @constructor
     */
    function MoveTool() {

        AbstractCanvasTool.call(this, MoveTool.TYPE, "tool-move", "Move Nodes and Edges");

        /**
         * Mount the tool on canvas
         */
        this.mount = function() {
            var that = this;

            AbstractCanvasTool.prototype.mount.call(this);
            //WTF??? 
            //Bind Node and Edge Events
            /*var nodes = EntityManager.getNodes();
            var nodeId, node;
            for(nodeId in nodes){
                if(nodes.hasOwnProperty(nodeId)){
                    node = nodes[nodeId];
                    node.bindMoveToolEvents();
                }
            }

            var edges = EntityManager.getEdges();
            var edgeId, edge;
            for(edgeId in edges){
                if(edges.hasOwnProperty(edgeId)){
                    edge = edges[edgeId];
                    edge.bindMoveToolEvents();
                }
            }*/

            this.getCanvas().bindMoveToolEvents();

        };

        /**
         * Unmount the tool from canvas
         */
        this.unmount = function() {

            AbstractCanvasTool.prototype.unmount.call(this);
            //WTF?? 
            /*var nodes = EntityManager.getNodes();
            var nodeId, node;
            for(nodeId in nodes){
                if(nodes.hasOwnProperty(nodeId)){
                    node = nodes[nodeId];
                    node.unbindMoveToolEvents();
                }
            }

            var edges = EntityManager.getEdges();
            var edgeId, edge;
            for(edgeId in edges){
                if(edges.hasOwnProperty(edgeId)){
                    edge = edges[edgeId];
                    edge.unbindMoveToolEvents();
                }
            }*/

            this.getCanvas().unbindMoveToolEvents();

        };

    }

    return MoveTool;

});