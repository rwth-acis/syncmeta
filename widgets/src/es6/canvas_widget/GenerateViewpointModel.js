import Util from "../Util";
import { AbstractClassNode } from "./Manager";
import { RelationshipNode } from "./Manager";
import { RelationshipGroupNode } from "./Manager";
import { EnumNode } from "./Manager";
import { NodeShapeNode } from "./Manager";
import { EdgeShapeNode } from "./Manager";
import { GeneralisationEdge } from "./Manager";
import { BiDirAssociationEdge } from "./Manager";
import { UniDirAssociationEdge } from "./Manager";
import ViewObjectNode from "./viewpoint/ViewObjectNode";
import ViewRelationshipNode from "./viewpoint/ViewRelationshipNode";
import { EntityManagerInstance as EntityManager } from "./Manager";
import { ObjectNode } from "./Manager";
function GenerateViewpointModel(viewpointModel) {
  EntityManager.init();

  for (var node_key in viewpointModel.nodes) {
    if (viewpointModel.nodes.hasOwnProperty(node_key)) {
      var vpNode = viewpointModel.nodes[node_key];
      EntityManager.createNodeFromJSON(
        vpNode.type,
        node_key,
        vpNode.left,
        vpNode.top,
        vpNode.widget,
        vpNode.height,
        vpNode.zIndex,
        vpNode.containment,
        vpNode
      );
    }
  }

  for (var edge_key in viewpointModel.edges) {
    if (viewpointModel.edges.hasOwnProperty(edge_key)) {
      var vpEdge = viewpointModel.edges[edge_key];
      EntityManager.createEdgeFromJSON(
        vpEdge.type,
        edge_key,
        vpEdge.source,
        vpEdge.target,
        vpEdge
      );
    }
  }

  /**
   * Determine the type of the concrete classes (ObjectNodes) of the class diagram contained in the sub graph rooted by the passed node
   * @param node Node to start with
   * @param [visitedNodes] List of node that already have been visited
   * @returns {object}
   */
  function getConcreteObjectNodeTypes(node, visitedNodes) {
    var edgeId,
      edge,
      ingoingEdges,
      source,
      type,
      classTypes = [];

    if (!visitedNodes) visitedNodes = [];

    if (visitedNodes.indexOf(node) !== -1) return [];

    visitedNodes.push(node);

    type = node.getLabel().getValue().getValue();
    if (
      (node instanceof ObjectNode || node instanceof ViewObjectNode) &&
      classTypes.indexOf(type) === -1
    ) {
      classTypes.push(type);
    }

    ingoingEdges = node.getIngoingEdges();
    for (edgeId in ingoingEdges) {
      if (ingoingEdges.hasOwnProperty(edgeId)) {
        edge = ingoingEdges[edgeId];
        source = edge.getSource();
        if (
          (edge instanceof GeneralisationEdge &&
            source instanceof ObjectNode) ||
          (edge instanceof GeneralisationEdge &&
            source instanceof AbstractClassNode) ||
          (edge instanceof GeneralisationEdge &&
            source instanceof ViewObjectNode)
        ) {
          classTypes = classTypes.concat(
            getConcreteObjectNodeTypes(source, visitedNodes)
          );
        }
      }
    }
    return classTypes;
  }

  /**
   * Determine the attributes of the passed node by traversing the underlying class diagram
   * @param node Node to start with
   * @param [visitedNodes] List of node that already have been visited
   * @returns {object}
   */
  function getNodeAttributes(node, visitedNodes) {
    var nodeAttributes, attributeId, attribute;
    var edgeId, edge, outgoingEdges;
    var source, target;
    var neighbor, options;
    var attributes = {};
    var obj = {};

    if (!visitedNodes) visitedNodes = [];

    if (visitedNodes.indexOf(node) !== -1) return {};

    visitedNodes.push(node);

    //Traverse outgoing edges to check for inheritance and linked enums
    outgoingEdges = node.getOutgoingEdges();
    for (edgeId in outgoingEdges) {
      if (outgoingEdges.hasOwnProperty(edgeId)) {
        edge = outgoingEdges[edgeId];
        source = edge.getSource();
        target = edge.getTarget();

        //Does the node inherit attributes from a parent node?
        if (
          (edge instanceof GeneralisationEdge &&
            target instanceof AbstractClassNode) ||
          (edge instanceof GeneralisationEdge &&
            node instanceof ObjectNode &&
            target instanceof ObjectNode) ||
          (edge instanceof GeneralisationEdge &&
            node instanceof RelationshipNode &&
            target instanceof RelationshipNode) ||
          (edge instanceof GeneralisationEdge &&
            node instanceof EnumNode &&
            target instanceof EnumNode)
        ) {
          Util.merge(attributes, getNodeAttributes(target, visitedNodes));

          //Is there an enum linked to the node
        } else if (
          (edge instanceof BiDirAssociationEdge &&
            ((target === node && (neighbor = source) instanceof EnumNode) ||
              (source === node && (neighbor = target) instanceof EnumNode))) ||
          (edge instanceof UniDirAssociationEdge &&
            (neighbor = target) instanceof EnumNode)
        ) {
          options = {};
          nodeAttributes = {};
          Util.merge(nodeAttributes, getNodeAttributes(neighbor, []));
          for (attributeId in nodeAttributes) {
            if (nodeAttributes.hasOwnProperty(attributeId)) {
              attribute = nodeAttributes[attributeId];
              options[attribute.value] = attribute.value;
            }
          }
          obj = {};
          obj[neighbor.getEntityId()] = {
            key: edge.getLabel().getValue().getValue(),
            value: neighbor.getLabel().getValue().getValue(),
            options: options,
          };
          Util.merge(attributes, obj);
        }
      }
    }
    //Compute node attributes
    nodeAttributes = node.getAttribute("[attributes]").getAttributes();
    for (attributeId in nodeAttributes) {
      if (nodeAttributes.hasOwnProperty(attributeId)) {
        attribute = nodeAttributes[attributeId];
        if (node instanceof RelationshipNode) {
          obj = {};
          obj[attributeId] = {
            key: attribute.getKey().getValue(),
            value: attribute.getValue().getValue(),
            position: attribute.getValue2().getValue(),
          };
          Util.merge(attributes, obj);
        } else if (node instanceof ViewRelationshipNode) {
          obj = {};
          obj[attributeId] = {
            key: attribute.getKey().getValue(),
            ref: attribute.getRef().getValue(),
            position: attribute.getVis().getValue(),
          };
          Util.merge(attributes, obj);
        } else if (node instanceof EnumNode) {
          obj = {};
          obj[attributeId] = {
            value: attribute.getValue().getValue(),
          };
          Util.merge(attributes, obj);
        } else if (node instanceof ViewObjectNode) {
          obj = {};
          obj[attributeId] = {
            key: attribute.getKey().getValue(),
            ref: attribute.getRef().getValue(),
            visibility: attribute.getVis().getValue(),
          };
          Util.merge(attributes, obj);
        } else {
          obj = {};
          obj[attributeId] = {
            key: attribute.getKey().getValue(),
            value: attribute.getValue().getValue(),
          };
          Util.merge(attributes, obj);
        }
      }
    }
    return attributes;
  }

  function getViewTypeAttributes(node) {
    var target, targetName;
    var conjunction;
    var conditions = {};
    var nodeid = node.getEntityId();
    if (viewpointModel.nodes.hasOwnProperty(nodeid)) {
      if (
        viewpointModel.nodes[nodeid].attributes.hasOwnProperty(
          nodeid + "[target]"
        )
      ) {
        var attr = viewpointModel.nodes[nodeid].attributes[nodeid + "[target]"];
        target = attr.value.value;
        targetName = attr.hasOwnProperty("option") ? attr.option : null;
      }
      if (
        viewpointModel.nodes[nodeid].attributes.hasOwnProperty("[condition]")
      ) {
        var conditionsList =
          viewpointModel.nodes[nodeid].attributes["[condition]"].list;
        for (var condId in conditionsList) {
          if (conditionsList.hasOwnProperty(condId)) {
            conditions[condId] = {
              property: conditionsList[condId].property.value,
              operator: conditionsList[condId].operator.value,
              value: conditionsList[condId].val.value,
              //conjunction: conditionsList[condId].operator2.value
            };
          }
        }
      }
      if (
        viewpointModel.nodes[nodeid].attributes.hasOwnProperty(
          nodeid + "[conjunction]"
        )
      ) {
        conjunction =
          viewpointModel.nodes[nodeid].attributes[nodeid + "[conjunction]"]
            .value.value;
      }
    }
    return {
      target: target,
      targetName: targetName,
      conditions: conditions,
      conjunction: conjunction,
    };
  }

  var metamodel = {
    attributes: {},
    nodes: {},
    edges: {},
  };

  var nodeId, node;
  var attributes;
  var edge, edgeId, edges;
  var source, target;
  var neighbor;
  var groupSource, groupTarget;
  var groupNeighbor;
  var shape;
  var sourceTypes, targetTypes, concreteTypes;
  var groupSourceTypes, groupTargetTypes, groupConcreteTypes;
  var relations;
  var groupEdge, groupEdgeId, groupEdges;
  var viewtypeAttrs;

  var _nodes = EntityManager.getNodes();
  for (nodeId in _nodes) {
    if (_nodes.hasOwnProperty(nodeId)) {
      node = _nodes[nodeId];
      if (node instanceof ObjectNode || node instanceof ViewObjectNode) {
        if (node.getLabel().getValue().getValue() === "Model Attributes") {
          attributes = getNodeAttributes(node);
          metamodel.attributes = attributes;
        } else {
          attributes = getNodeAttributes(node);
          edges = node.getEdges();
          shape = null;
          for (edgeId in edges) {
            if (edges.hasOwnProperty(edgeId)) {
              edge = edges[edgeId];
              source = edge.getSource();
              target = edge.getTarget();
              if (
                (edge instanceof BiDirAssociationEdge &&
                  ((target === node &&
                    (neighbor = source) instanceof NodeShapeNode) ||
                    (source === node &&
                      (neighbor = target) instanceof NodeShapeNode))) ||
                (edge instanceof UniDirAssociationEdge &&
                  (neighbor = target) instanceof NodeShapeNode)
              ) {
                shape = {
                  shape: neighbor
                    .getAttribute(neighbor.getEntityId() + "[shape]")
                    .getValue()
                    .getValue(),
                  color: neighbor
                    .getAttribute(neighbor.getEntityId() + "[color]")
                    .getValue()
                    .getValue(),
                  defaultWidth: parseInt(
                    neighbor
                      .getAttribute(neighbor.getEntityId() + "[defaultWidth]")
                      .getValue()
                      .getValue()
                  ),
                  defaultHeight: parseInt(
                    neighbor
                      .getAttribute(neighbor.getEntityId() + "[defaultHeight]")
                      .getValue()
                      .getValue()
                  ),
                  containment: neighbor
                    .getAttribute(neighbor.getEntityId() + "[containment]")
                    .getValue()
                    .getValue(),
                  customShape: neighbor
                    .getAttribute(neighbor.getEntityId() + "[customShape]")
                    .getValue()
                    .getValue(),
                  customAnchors: neighbor
                    .getAttribute(neighbor.getEntityId() + "[customAnchors]")
                    .getValue()
                    .getValue(),
                };
              }
            }
          }

          metamodel.nodes[nodeId] = {
            label: node.getLabel().getValue().getValue(),
            attributes: attributes,
            shape: shape || {
              shape: "rectangle",
              color: "white",
              containment: false,
              customShape: "",
              customAnchors: "",
              defaultWidth: 0,
              defaultHeight: 0,
            },
          };
          if (node instanceof ViewObjectNode) {
            viewtypeAttrs = getViewTypeAttributes(node);
            Util.merge(metamodel.nodes[nodeId], viewtypeAttrs);
          }
        }
      } else if (
        node instanceof RelationshipNode ||
        node instanceof ViewRelationshipNode
      ) {
        attributes = getNodeAttributes(node);
        edges = node.getEdges();
        sourceTypes = [];
        targetTypes = [];
        relations = [];
        shape = null;
        for (edgeId in edges) {
          if (edges.hasOwnProperty(edgeId)) {
            edge = edges[edgeId];
            source = edge.getSource();
            target = edge.getTarget();
            if (
              edge instanceof BiDirAssociationEdge &&
              ((target === node && (neighbor = source) instanceof ObjectNode) ||
                (target === node &&
                  (neighbor = source) instanceof ViewObjectNode) ||
                (source === node &&
                  (neighbor = target) instanceof ObjectNode) ||
                (source === node &&
                  (neighbor = target) instanceof ViewObjectNode))
            ) {
              concreteTypes = getConcreteObjectNodeTypes(neighbor);
              sourceTypes = sourceTypes.concat(concreteTypes);
              targetTypes = targetTypes.concat(concreteTypes);
            } else if (
              edge instanceof UniDirAssociationEdge &&
              source === node &&
              (target instanceof ObjectNode || target instanceof ViewObjectNode)
            ) {
              targetTypes = targetTypes.concat(
                getConcreteObjectNodeTypes(target)
              );
            } else if (
              edge instanceof UniDirAssociationEdge &&
              target === node &&
              (source instanceof ObjectNode || source instanceof ViewObjectNode)
            ) {
              sourceTypes = sourceTypes.concat(
                getConcreteObjectNodeTypes(source)
              );
            } else if (
              edge instanceof BiDirAssociationEdge &&
              ((target === node &&
                (neighbor = source) instanceof AbstractClassNode) ||
                (source === node &&
                  (neighbor = target) instanceof AbstractClassNode))
            ) {
              concreteTypes = getConcreteObjectNodeTypes(neighbor);
              sourceTypes = sourceTypes.concat(concreteTypes);
              targetTypes = targetTypes.concat(concreteTypes);
            } else if (
              edge instanceof UniDirAssociationEdge &&
              source === node &&
              target instanceof AbstractClassNode
            ) {
              targetTypes = targetTypes.concat(
                getConcreteObjectNodeTypes(target)
              );
            } else if (
              edge instanceof UniDirAssociationEdge &&
              target === node &&
              source instanceof AbstractClassNode
            ) {
              sourceTypes = sourceTypes.concat(
                getConcreteObjectNodeTypes(source)
              );
            } else if (
              (edge instanceof BiDirAssociationEdge &&
                ((target === node &&
                  (neighbor = source) instanceof EdgeShapeNode) ||
                  (source === node &&
                    (neighbor = target) instanceof EdgeShapeNode))) ||
              (edge instanceof UniDirAssociationEdge &&
                source === node &&
                (neighbor = target) instanceof EdgeShapeNode)
            ) {
              shape = {
                arrow: neighbor
                  .getAttribute(neighbor.getEntityId() + "[arrow]")
                  .getValue()
                  .getValue(),
                shape: neighbor
                  .getAttribute(neighbor.getEntityId() + "[shape]")
                  .getValue()
                  .getValue(),
                color: neighbor
                  .getAttribute(neighbor.getEntityId() + "[color]")
                  .getValue()
                  .getValue(),
                overlay: neighbor
                  .getAttribute(neighbor.getEntityId() + "[overlay]")
                  .getValue()
                  .getValue(),
                overlayPosition: neighbor
                  .getAttribute(neighbor.getEntityId() + "[overlayPosition]")
                  .getValue()
                  .getValue(),
                overlayRotate: neighbor
                  .getAttribute(neighbor.getEntityId() + "[overlayRotate]")
                  .getValue()
                  .getValue(),
              };
            } else if (
              edge instanceof GeneralisationEdge &&
              target === node &&
              (neighbor = source) instanceof RelationshipGroupNode
            ) {
              groupEdges = neighbor.getEdges();
              groupSourceTypes = [];
              groupTargetTypes = [];
              for (groupEdgeId in groupEdges) {
                if (groupEdges.hasOwnProperty(groupEdgeId)) {
                  groupEdge = groupEdges[groupEdgeId];
                  groupSource = groupEdge.getSource();
                  groupTarget = groupEdge.getTarget();
                  if (
                    groupEdge instanceof BiDirAssociationEdge &&
                    ((groupTarget === neighbor &&
                      (groupNeighbor = groupSource) instanceof ObjectNode) ||
                      (groupSource === neighbor &&
                        (groupNeighbor = groupTarget) instanceof ObjectNode) ||
                      (groupTarget === neighbor &&
                        (groupNeighbor = groupSource) instanceof
                          ViewObjectNode) ||
                      (groupSource === neighbor &&
                        (groupNeighbor = groupTarget) instanceof
                          ViewObjectNode))
                  ) {
                    groupConcreteTypes =
                      getConcreteObjectNodeTypes(groupNeighbor);
                    groupSourceTypes =
                      groupSourceTypes.concat(groupConcreteTypes);
                    groupTargetTypes =
                      groupTargetTypes.concat(groupConcreteTypes);
                  } else if (
                    groupEdge instanceof UniDirAssociationEdge &&
                    groupSource === neighbor &&
                    (groupTarget instanceof ObjectNode ||
                      groupTarget instanceof ViewObjectNode)
                  ) {
                    groupTargetTypes = groupTargetTypes.concat(
                      getConcreteObjectNodeTypes(groupTarget)
                    );
                  } else if (
                    groupEdge instanceof UniDirAssociationEdge &&
                    groupTarget === neighbor &&
                    (groupSource instanceof ObjectNode ||
                      groupSource instanceof ViewObjectNode)
                  ) {
                    groupSourceTypes = groupSourceTypes.concat(
                      getConcreteObjectNodeTypes(groupSource)
                    );
                  } else if (
                    groupEdge instanceof BiDirAssociationEdge &&
                    ((groupTarget === neighbor &&
                      (groupNeighbor = groupSource) instanceof
                        AbstractClassNode) ||
                      (groupSource === neighbor &&
                        (groupNeighbor = groupTarget) instanceof
                          AbstractClassNode))
                  ) {
                    groupConcreteTypes =
                      getConcreteObjectNodeTypes(groupNeighbor);
                    groupSourceTypes =
                      groupSourceTypes.concat(groupConcreteTypes);
                    groupTargetTypes =
                      groupTargetTypes.concat(groupConcreteTypes);
                  } else if (
                    groupEdge instanceof UniDirAssociationEdge &&
                    groupSource === neighbor &&
                    groupTarget instanceof AbstractClassNode
                  ) {
                    groupTargetTypes = groupTargetTypes.concat(
                      getConcreteObjectNodeTypes(groupTarget)
                    );
                  } else if (
                    groupEdge instanceof UniDirAssociationEdge &&
                    groupTarget === neighbor &&
                    groupSource instanceof AbstractClassNode
                  ) {
                    groupSourceTypes = groupSourceTypes.concat(
                      getConcreteObjectNodeTypes(groupSource)
                    );
                  }
                }
              }

              if (groupSourceTypes.length > 0 && groupTargetTypes.length > 0) {
                relations.push({
                  sourceTypes: groupSourceTypes,
                  targetTypes: groupTargetTypes,
                });
              }
            }
          }
        }

        if (sourceTypes.length > 0 && targetTypes.length > 0) {
          relations.push({
            sourceTypes: sourceTypes,
            targetTypes: targetTypes,
          });
        }

        metamodel.edges[nodeId] = {
          label: node.getLabel().getValue().getValue(),
          shape: shape || {
            arrow: "bidirassociation",
            shape: "straight",
            color: "black",
            overlay: "",
            overlayPosition: "top",
            overlayRotate: true,
          },
          relations: relations,
          attributes: attributes,
        };
        if (node instanceof ViewRelationshipNode) {
          viewtypeAttrs = getViewTypeAttributes(node);
          Util.merge(metamodel.edges[nodeId], viewtypeAttrs);
        }
      }
    }
  }
  metamodel["id"] = viewpointModel.id;
  EntityManager.reset();
  return metamodel;
}
export default GenerateViewpointModel;
