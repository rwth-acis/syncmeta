define([
    'require',
    'jqueryui',
    'jsplumb',
    'lodash',
    'canvas_widget/AbstractEdge',
    'canvas_widget/AbstractClassNode',
    'canvas_widget/ObjectNode',
    'canvas_widget/RelationshipNode',
    'canvas_widget/RelationshipGroupNode',
    'canvas_widget/EnumNode',
    'canvas_widget/viewpoint/ViewObjectNode',
    'canvas_widget/viewpoint/ViewRelationshipNode'
],/** @lends GeneralisationEdge */function(require,$,jsPlumb,_,AbstractEdge,AbstractClassNode,ObjectNode,RelationshipNode,RelationshipGroupNode,EnumNode,ViewObjectNode, ViewRelationshipNode) {

    GeneralisationEdge.TYPE = "Generalisation";
    GeneralisationEdge.RELATIONS = [
        {
            sourceTypes: [ObjectNode.TYPE],
            targetTypes: [ObjectNode.TYPE,AbstractClassNode.TYPE]
        },
        {
            sourceTypes: [RelationshipNode.TYPE],
            targetTypes: [RelationshipNode.TYPE,AbstractClassNode.TYPE]
        },
        {
            sourceTypes: [RelationshipGroupNode.TYPE],
            targetTypes: [RelationshipNode.TYPE, ViewRelationshipNode.TYPE]
        },
        {
            sourceTypes: [AbstractClassNode.TYPE],
            targetTypes: [AbstractClassNode.TYPE]
        },
        {
            sourceTypes: [EnumNode.TYPE],
            targetTypes: [EnumNode.TYPE]
        }
    ];

    GeneralisationEdge.prototype = new AbstractEdge();
    GeneralisationEdge.prototype.constructor = GeneralisationEdge;
    /**
     * GeneralisationEdge
     * @class GeneralisationEdge
     * @extends AbstractEdge
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity identifier of edge
     * @param {canvas_widget.AbstractNode} source Source node
     * @param {canvas_widget.AbstractNode} target Target node
     */
    function GeneralisationEdge(id,source,target){
        var that = this;

        AbstractEdge.call(this,id,GeneralisationEdge.TYPE,source,target);

        /**
         * Connect source and target node and draw the edge on canvas
         */
        this.connect = function(){
            var source = this.getSource();
            var target = this.getTarget();
            var connectOptions = {
                source: source.get$node(),
                target: target.get$node(),
                paintStyle: {
                    strokeStyle: "#aaaaaa",
                    lineWidth: 2
                },
                endpoint: "Blank",
                anchors: [source.getAnchorOptions(), target.getAnchorOptions()],
                connector: ["Straight", {gap: 0}],
                overlays:[
                    ["Arrow", {
                        width:20,
                        length:30,
                        location:1,
                        foldback: 1,
                        paintStyle: {
                            fillStyle: "#ffffff",
                            outlineWidth: 2,
                            outlineColor: "#aaaaaa"
                        }
                    } ],
                    ["Custom", {
                        create:function() {
                            return that.get$overlay();
                        },
                        location:0.5,
                        id:"label"
                    }]
                ],
                cssClass: this.getEntityId()
            };

            if(source === target){
                connectOptions.anchor = ["TopCenter","LeftMiddle"];
            }

            source.addOutgoingEdge(this);
            target.addIngoingEdge(this);

            this.setJsPlumbConnection(jsPlumb.connect(connectOptions));
            this.repaintOverlays();
            _.each(require('canvas_widget/EntityManager').getEdges(),function(e){e.setZIndex();});
        };

        this.get$overlay().find('.type').addClass('segmented');

    }

    return GeneralisationEdge;

});