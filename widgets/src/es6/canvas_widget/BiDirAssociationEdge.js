import jsPlumb from "jsPlumb/dist/js/jquery.jsPlumb-1.5.5-min.js";
import _ from "lodash-es";
import AbstractEdge from "./AbstractEdge";
import AbstractClassNode from "./AbstractClassNode";
import ObjectNode from "./ObjectNode";
import RelationshipNode from "./RelationshipNode";
import RelationshipGroupNode from "./RelationshipGroupNode";
import EnumNode from "./EnumNode";
import NodeShapeNode from "./NodeShapeNode";
import EdgeShapeNode from "./EdgeShapeNode";
import ViewObjectNode from "./viewpoint/ViewObjectNode";
import ViewRelationshipNode from "./viewpoint/ViewRelationshipNode";
import $__canvas_widget_EntityManager from "./EntityManager";

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
    _.each($__canvas_widget_EntityManager.getEdges(), function (e) {
      e.setZIndex();
    });
  };

  this.get$overlay().find(".type").addClass("segmented");
}

export default BiDirAssociationEdge;
