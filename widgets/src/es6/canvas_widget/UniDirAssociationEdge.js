import require from 'require';
import $ from "jquery-ui";
import jsPlumb from 'jsplumb';
import _ from 'lodash';
import AbstractEdge from 'canvas_widget/AbstractEdge';
import AbstractClassNode from 'canvas_widget/AbstractClassNode';
import ObjectNode from 'canvas_widget/ObjectNode';
import RelationshipNode from 'canvas_widget/RelationshipNode';
import RelationshipGroupNode from 'canvas_widget/RelationshipGroupNode';
import EnumNode from 'canvas_widget/EnumNode';
import NodeShapeNode from 'canvas_widget/NodeShapeNode';
import EdgeShapeNode from 'canvas_widget/EdgeShapeNode';
import ViewObjectNode from 'canvas_widget/viewpoint/ViewObjectNode';
import ViewRelationshipNode from 'canvas_widget/viewpoint/ViewRelationshipNode';
import $__canvas_widget_EntityManager from 'canvas_widget/EntityManager';

    UniDirAssociationEdge.TYPE = "Uni-Dir-Association";
    UniDirAssociationEdge.RELATIONS = [
        {
            sourceTypes: [ObjectNode.TYPE],
            targetTypes: [EnumNode.TYPE,NodeShapeNode.TYPE,RelationshipNode.TYPE,RelationshipGroupNode.TYPE,ViewRelationshipNode.TYPE]
        },
        {
            sourceTypes: [RelationshipNode.TYPE],
            targetTypes: [EnumNode.TYPE,EdgeShapeNode.TYPE,ObjectNode.TYPE,AbstractClassNode.TYPE,ViewObjectNode.TYPE]
        },
        {
            sourceTypes: [RelationshipGroupNode.TYPE],
            targetTypes: [ObjectNode.TYPE,AbstractClassNode.TYPE]
        },
        {
            sourceTypes: [AbstractClassNode.TYPE],
            targetTypes: [EnumNode.TYPE,RelationshipNode.TYPE,RelationshipGroupNode.TYPE]
        },
        {
            sourceTypes: [ViewObjectNode.TYPE],
            targetTypes: [EnumNode.TYPE,NodeShapeNode.TYPE,RelationshipNode.TYPE,RelationshipGroupNode.TYPE,ViewRelationshipNode.TYPE]
        },
        {
            sourceTypes: [ViewRelationshipNode.TYPE],
            targetTypes: [EnumNode.TYPE,EdgeShapeNode.TYPE,ObjectNode.TYPE,AbstractClassNode.TYPE,ViewObjectNode.TYPE]
        }
    ];

    UniDirAssociationEdge.prototype = new AbstractEdge();
    UniDirAssociationEdge.prototype.constructor = UniDirAssociationEdge;
    /**
     * UniDirAssociationEdge
     * @class canvas_widget.UniDirAssociationEdge
     * @extends canvas_widget.AbstractEdge
     * @memberof canvas_widget
     * @constructor
     * @param {string} id Entity identifier of edge
     * @param {canvas_widget.AbstractNode} source Source node
     * @param {canvas_widget.AbstractNode} target Target node
     */
    function UniDirAssociationEdge(id,source,target){
        var that = this;

        AbstractEdge.call(this,id,UniDirAssociationEdge.TYPE,source,target);

        /**
         * Connect source and target node and draw the edge on canvas
         */
        this.connect = function(){
            var source = this.getSource();
            var target = this.getTarget();
            var connectOptions = {
                source: source.get$node(),
                target: target.get$node(),
                paintStyle:{
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
                        foldback:0.5,
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
                connectOptions.anchors = ["TopCenter","LeftMiddle"];
            }

            source.addOutgoingEdge(this);
            target.addIngoingEdge(this);

            this.setJsPlumbConnection(jsPlumb.connect(connectOptions));
            this.repaintOverlays();
            _.each($__canvas_widget_EntityManager.getEdges(),function(e){e.setZIndex();});
        };

        this.get$overlay().find('.type').addClass('segmented');

        /*this.setContextMenuItems({
            sep0: "---------",
            convertToBiDirAssociationEdge: {
                name: "Convert to Bi-Dir. Assoc. Edge",
                callback: function(){
                    var canvas = that.getCanvas();

                    //noinspection JSAccessibilityCheck
                    canvas.createEdge(require('canvas_widget/BiDirAssociationEdge').TYPE,that.getSource().getEntityId(),that.getTarget().getEntityId(),that.toJSON());

                    that.triggerDeletion();

                }
            }
        });*/
    }

    export default UniDirAssociationEdge;

