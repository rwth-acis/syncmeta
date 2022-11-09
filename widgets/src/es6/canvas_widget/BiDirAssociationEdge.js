import "jsplumb/dist/js/jsPlumb-1.7.9.js";
import _ from "lodash-es";
import AbstractEdge from "./AbstractEdge";
import { AbstractClassNode } from "./Manager";
import { RelationshipNode } from "./Manager";
import RelationshipGroupNode from "./RelationshipGroupNode";
import EnumNode from "./EnumNode";
import NodeShapeNode from "./NodeShapeNode";
import { EdgeShapeNode } from "./Manager";
import ViewObjectNode from "./viewpoint/ViewObjectNode";
import ViewRelationshipNode from "./viewpoint/ViewRelationshipNode";
import { EntityManagerInstance, ObjectNode } from "./Manager";

BiDirAssociationEdge.TYPE = "Bi-Dir-Association";
BiDirAssociationEdge.RELATIONS = [
  {
    sourceTypes: [ObjectNode.TYPE],
    targetTypes: [
      EnumNode.TYPE,
      NodeShapeNode.TYPE,
      RelationshipNode.TYPE,
      RelationshipGroupNode.TYPE,
      ViewRelationshipNode.TYPE,
    ],
  },
  {
    sourceTypes: [RelationshipNode.TYPE],
    targetTypes: [
      EnumNode.TYPE,
      EdgeShapeNode.TYPE,
      ObjectNode.TYPE,
      AbstractClassNode.TYPE,
      ViewObjectNode.TYPE,
    ],
  },
  {
    sourceTypes: [RelationshipGroupNode.TYPE],
    targetTypes: [ObjectNode.TYPE, AbstractClassNode.TYPE],
  },
  {
    sourceTypes: [AbstractClassNode.TYPE],
    targetTypes: [
      EnumNode.TYPE,
      RelationshipNode.TYPE,
      RelationshipGroupNode.TYPE,
    ],
  },
  {
    sourceTypes: [EnumNode.TYPE],
    targetTypes: [
      ObjectNode.TYPE,
      RelationshipNode.TYPE,
      AbstractClassNode.TYPE,
    ],
  },
  {
    sourceTypes: [NodeShapeNode.TYPE],
    targetTypes: [ObjectNode.TYPE],
  },
  {
    sourceTypes: [EdgeShapeNode.TYPE],
    targetTypes: [RelationshipNode.TYPE],
  },
  {
    sourceTypes: [ViewObjectNode.TYPE],
    targetTypes: [
      EnumNode.TYPE,
      NodeShapeNode.TYPE,
      RelationshipNode.TYPE,
      RelationshipGroupNode.TYPE,
      ViewRelationshipNode.TYPE,
    ],
  },
  {
    sourceTypes: [ViewRelationshipNode.TYPE],
    targetTypes: [
      EnumNode.TYPE,
      EdgeShapeNode.TYPE,
      ObjectNode.TYPE,
      AbstractClassNode.TYPE,
      ViewObjectNode.TYPE,
    ],
  },
];

BiDirAssociationEdge.prototype = new AbstractEdge();
BiDirAssociationEdge.prototype.constructor = BiDirAssociationEdge;
/**
 * BiDirAssociationEdge
 * @class canvas_widget.BiDirAssociationEdge
 * @extends canvas_widget.AbstractEdge
 * @memberof canvas_widget
 * @constructor
 * @param {string} id Entity identifier of edge
 * @param {canvas_widget.AbstractNode} source Source node
 * @param {canvas_widget.AbstractNode} target Target node
 */
function BiDirAssociationEdge(id, source, target) {
  var that = this;

  AbstractEdge.call(this, id, BiDirAssociationEdge.TYPE, source, target);

  /**
   * Connect source and target node and draw the edge on canvas
   */
  this.connect = function () {
    var source = this.getSource();
    var target = this.getTarget();
    var connectOptions = {
      source: source.get$node(),
      target: target.get$node(),
      paintStyle: {
        strokeStyle: "#aaaaaa",
        lineWidth: 2,
      },
      endpoint: "Blank",
      anchors: [source.getAnchorOptions(), target.getAnchorOptions()],
      connector: ["Straight", { gap: 0 }],
      overlays: [
        [
          "Custom",
          {
            create: function () {
              return that.get$overlay();
            },
            location: 0.5,
            id: "label",
          },
        ],
      ],
      cssClass: this.getEntityId(),
    };

    if (source === target) {
      connectOptions.anchors = ["TopCenter", "LeftMiddle"];
    }

    source.addOutgoingEdge(this);
    target.addIngoingEdge(this);

    this.setJsPlumbConnection(jsPlumb.connect(connectOptions));
    this.repaintOverlays();
    _.each(EntityManagerInstance.getEdges(), function (e) {
      e.setZIndex();
    });
  };

  this.get$overlay().find(".type").addClass("segmented");
}

export default BiDirAssociationEdge;
