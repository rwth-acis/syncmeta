import { EntityManagerInstance as EntityManager } from "../Manager";
import "jsplumb/dist/js/jsPlumb-2.0.0.js";

/**
 * Generates the Views
 * @constructor
 */
function ViewGenerator() {}

/**
 * Applies a node type to a node
 * @param {object} nodeType the node type object. Be found in the EntityManager via getNodeType(typeName)
 * @param {canvas_widget.Node} node the node
 */
function applyNodeTypeToNode(nodeType, node) {
  if (checkConditions(nodeType, node)) {
    node.set$shape(nodeType.get$shape());
    node.setAnchorOptions(nodeType.getAnchors());
    node.setCurrentViewType(nodeType.TYPE);
    node.show();
  } else {
    node.setCurrentViewType(null);
    node.hide();
  }
}

/**
 * check the condition for node
 * @param type
 * @param entity
 * @returns {boolean}
 */
function checkConditions(type, entity) {
  if (type.name === "Edge" || type.name === "Node") {
    return true;
  }

  var cond,
    conj = type.getConditionConj(),
    conditions = type.getConditions();

  for (var cKey in conditions) {
    if (conditions.hasOwnProperty(cKey)) {
      cond = conditions[cKey];
      var attr = entity.getAttribute(cond.property);
      if (attr) {
        var res = resolveCondition(
          attr.getValue().getValue(),
          cond.operator,
          cond.value
        );
        if (conj === "AND" && !res) {
          return false;
        } else if (conj === "OR" && res) {
          return true;
        }
      }
    }
  }
  if (conj === "AND") {
    return true;
  } else if (conj === "OR") {
    return false;
  }
}

/**
 * resolves a condition
 * @param attrValue the attribute value from the instance of a view type
 * @param {string} operator the operator defined in the view type definition
 * @param {string} value the value defined in the view type definition
 * @returns {boolean} true if the condition is true else false
 */
function resolveCondition(attrValue, operator, value) {
  var val = null;
  try {
    if (typeof val === "boolean") val = value;
    else val = parseInt(value);
    if (isNaN(val)) val = value;
  } catch (e) {
    val = value;
  }
  switch (operator) {
    case "greater":
      return attrValue > val;
    case "smaller":
      return attrValue < val;
    case "equal":
      return attrValue === val;
    case "greater_eq":
      return attrValue >= val;
    case "smaller_eq":
      return attrValue <= val;
    case "nequal":
      return attrValue != val;
  }
}

/**
 * Applies a node type to a set of nodes
 * @param {object} nodeType the node type object. Be found in the EntityManager via getNodeType(typeName)
 * @param {object} nodes nodes as key value store
 */
function applyNodeTypeToNodes(nodeType, nodes) {
  for (var nodeKey in nodes) {
    if (nodes.hasOwnProperty(nodeKey)) {
      applyNodeTypeToNode(nodeType, nodes[nodeKey]);
    }
  }
}

/**
 * Applies a edge type to a edge
 * @param {object} edgeType the edge type object can be found in the EntityManager via getEdgeType(typeName)
 * @param {canvas_widget.Edge} edge the edge to transform
 */
function applyEdgeTypeToEdge(edgeType, edge) {
  if (checkConditions(edgeType, edge)) {
    edge.restyle(
      edgeType.getArrowType(),
      edgeType.getColor(),
      edgeType.getShapeType(),
      null,
      edgeType.getOverlay(),
      edgeType.getOverlayPosition(),
      edgeType.getOverlayRotate(),
      edgeType.getAttributes()
    );
    edge.setCurrentViewType(edgeType.TYPE);
  } else {
    edge.hide();
  }
}

/**
 * Applies a edge type to a set of nodes
 * @param {object} edgeType the edge type object can be found in the EntityManager via getEdgeType(typeName)
 * @param {object} edges the edges as key value store
 */
function applyEdgeTypeToEdges(edgeType, edges) {
  for (var edgeKey in edges) {
    if (edges.hasOwnProperty(edgeKey)) {
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
ViewGenerator.generate = function (vls, vvs) {
  var _processed = {};

  //transform the view types
  var viewpointNodes = vvs.nodes;
  for (var vpNodeKey in viewpointNodes) {
    if (viewpointNodes.hasOwnProperty(vpNodeKey)) {
      var nodeViewType = viewpointNodes[vpNodeKey];
      if (nodeViewType.hasOwnProperty("target")) {
        _processed[nodeViewType.target] = true;
        var viewNodeTypeObject = EntityManager.getViewNodeType(
          nodeViewType.label
        );
        applyNodeTypeToNodes(
          viewNodeTypeObject,
          EntityManager.getNodesByType(
            viewNodeTypeObject.getTargetNodeType().TYPE
          )
        );
      }
    }
  }

  //Hide the other types
  var nodeTypes = vls.nodes;
  for (var nodeTypeKey in nodeTypes) {
    if (
      nodeTypes.hasOwnProperty(nodeTypeKey) &&
      !_processed.hasOwnProperty(nodeTypeKey)
    ) {
      var nodes = EntityManager.getNodesByType(nodeTypes[nodeTypeKey].label);
      for (var nodeKey in nodes) {
        if (nodes.hasOwnProperty(nodeKey)) {
          nodes[nodeKey].hide();
        }
      }
    }
  }

  //transform edges
  var viewpointEdges = vvs.edges;
  for (var vpEdgeKey in viewpointEdges) {
    if (viewpointEdges.hasOwnProperty(vpEdgeKey)) {
      var edgeViewType = viewpointEdges[vpEdgeKey];
      if (edgeViewType.hasOwnProperty("target")) {
        _processed[edgeViewType.target] = true;
        var viewEdgeTypeObject = EntityManager.getViewEdgeType(
          edgeViewType.label
        );
        applyEdgeTypeToEdges(
          viewEdgeTypeObject,
          EntityManager.getEdgesByType(
            viewEdgeTypeObject.getTargetEdgeType().TYPE
          )
        );
      }
    }
  }

  //Hide the other types
  var edgeTypes = vls.edges;
  for (var edgeTypeKey in edgeTypes) {
    if (
      edgeTypes.hasOwnProperty(edgeTypeKey) &&
      !_processed.hasOwnProperty(edgeTypeKey)
    ) {
      var edges = EntityManager.getEdgesByType(edgeTypes[edgeTypeKey].label);
      for (var edgeKey in edges) {
        if (edges.hasOwnProperty(edgeKey)) {
          edges[edgeKey].hide();
        }
      }
    }
  }

  //Repaint all jsPlumb connections
  jsPlumb.repaintEverything();
  _.each(EntityManager.getEdges(), function (e) {
    e.setZIndex();
  });
};

/**
 * resets the view generator
 * @param vls
 */
ViewGenerator.reset = function (vls) {
  var typeName;
  var nodes = vls.nodes;
  for (var nodeKey in nodes) {
    if (nodes.hasOwnProperty(nodeKey)) {
      typeName = nodes[nodeKey].label;
      applyNodeTypeToNodes(
        EntityManager.getNodeType(typeName),
        EntityManager.getNodesByType(typeName)
      );
    }
  }

  var edges = vls.edges;
  for (var edgeKey in edges) {
    if (edges.hasOwnProperty(edgeKey)) {
      typeName = edges[edgeKey].label;
      applyEdgeTypeToEdges(
        EntityManager.getEdgeType(typeName),
        EntityManager.getEdgesByType(typeName)
      );
    }
  }

  //Repaint all jsPlumb connections
  jsPlumb.repaintEverything();
  _.each(EntityManager.getEdges(), function (e) {
    e.setZIndex();
  });
};

export default ViewGenerator;
