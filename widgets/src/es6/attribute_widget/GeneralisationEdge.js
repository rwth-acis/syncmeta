import _ from "lodash-es";
import { AbstractEdge } from "./EntityManager";
import { AbstractClassNode } from "./EntityManager";
import ObjectNode from "./ObjectNode";
import RelationshipNode from "./RelationshipNode";
import RelationshipGroupNode from "./RelationshipGroupNode";
import EnumNode from "./EnumNode";

GeneralisationEdge.TYPE = "Generalisation";
GeneralisationEdge.RELATIONS = [
  {
    sourceTypes: [ObjectNode.TYPE],
    targetTypes: [ObjectNode.TYPE, AbstractClassNode.TYPE],
  },
  {
    sourceTypes: [RelationshipNode.TYPE],
    targetTypes: [RelationshipNode.TYPE, AbstractClassNode.TYPE],
  },
  {
    sourceTypes: [RelationshipGroupNode.TYPE],
    targetTypes: [RelationshipNode.TYPE],
  },
  {
    sourceTypes: [AbstractClassNode.TYPE],
    targetTypes: [AbstractClassNode.TYPE],
  },
  {
    sourceTypes: [EnumNode.TYPE],
    targetTypes: [EnumNode.TYPE],
  },
];

GeneralisationEdge.prototype = new AbstractEdge();
GeneralisationEdge.prototype.constructor = GeneralisationEdge;
/**
 * GeneralisationEdge
 * @class attribute_widget.GeneralisationEdge
 * @memberof attribute_widget
 * @extends attribute_widget.AbstractEdge
 * @param {string} id Entity identifier of edge
 * @param {attribute_widget.AbstractNode} source Source node
 * @param {attribute_widget.AbstractNode} target Target node
 * @constructor
 */
function GeneralisationEdge(id, source, target) {
  AbstractEdge.call(this, GeneralisationEdge.TYPE, id, source, target);
}

export default GeneralisationEdge;
