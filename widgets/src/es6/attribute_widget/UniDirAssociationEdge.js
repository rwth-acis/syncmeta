import _ from "lodash-es";
import AbstractEdge from "./AbstractEdge";
import { AbstractClassNode } from "./EntityManager";
import ObjectNode from "./ObjectNode";
import RelationshipNode from "./RelationshipNode";
import RelationshipGroupNode from "./RelationshipGroupNode";
import EnumNode from "./EnumNode";
import NodeShapeNode from "./NodeShapeNode";
import EdgeShapeNode from "./EdgeShapeNode";
import ViewObjectNode from "./viewpoint/ViewObjectNode";
import ViewRelationshipNode from "./viewpoint/ViewRelationshipNode";

UniDirAssociationEdge.TYPE = "Uni-Dir-Association";
UniDirAssociationEdge.RELATIONS = [
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

UniDirAssociationEdge.prototype = new AbstractEdge();
UniDirAssociationEdge.prototype.constructor = UniDirAssociationEdge;
/**
 * UniDirAssociationEdge
 * @class attribute_widget.UniDirAssociationEdge
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractEdge
 * @constructor
 * @param {string} id
 * @param {attribute_widget.AbstractNode} source
 * @param {attribute_widget.AbstractNode} target
 */
function UniDirAssociationEdge(id, source, target) {
  AbstractEdge.call(this, UniDirAssociationEdge.TYPE, id, source, target);
}

export default UniDirAssociationEdge;
