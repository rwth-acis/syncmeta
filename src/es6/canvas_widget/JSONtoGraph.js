import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import { EntityManagerInstance as EntityManager } from "./Manager";
import _ from "lodash-es";

export default function (json, canvas = window.canvas) {
  if (!canvas) return new Error("No canvas object defined!");

  function cleanUpYSpace(entity) {
    var jsonKeys = _.keys(json[entity]);
    const entityMap = y.getMap(entity);
    var yKeys = entityMap.keys();
    var diff = _.difference(yKeys, jsonKeys);

    for (var i = 0; i < diff.length; i++) {
      if (diff[i] !== "modelAttributes") entityMap.delete(diff[i]);
    }
  }

  //cleanUpYSpace('nodes');
  //cleanUpYSpace('edges');

  var deferred = $.Deferred();
  var numberOfNodes = _.keys(json.nodes).length;
  var numberOfEdges = _.keys(json.edges).length;
  var createdNodes = 0;
  var createdEdges = 0;
  var report = {
    widget: "CANVAS",
    createdYText: 0,
    modelAttributes: { attributes: {} },
    nodes: {},
    edges: {},
  };

  if (!_.isEmpty(json.attributes)) {
    var modelAttributesNode = EntityManager.createModelAttributesNodeFromJSON(
      json.attributes
    );
    modelAttributesNode.registerYMap();
    canvas.setModelAttributesNode(modelAttributesNode);
    modelAttributesNode.addToCanvas(canvas);
  }

  function createNode(nodeId, jsonNode) {
    const nodesMap = y.getMap("nodes");
    var map = nodesMap.get(nodeId);

    var node = null;
    if (map) {
      node = EntityManager.createNodeFromJSON(
        jsonNode.type,
        nodeId,
        map.get("left") ? map.get("left") : jsonNode.left,
        map.get("top") ? map.get("top") : jsonNode.top,
        map.get("width") ? map.get("width") : jsonNode.width,
        map.get("height") ? map.get("height") : jsonNode.height,
        map.get("zIndex") ? map.get("zIndex") : jsonNode.zIndex,
        map.get("containment") ? map.get("containment") : jsonNode.containment,
        jsonNode
      );
    } else {
      node = EntityManager.createNodeFromJSON(
        jsonNode.type,
        nodeId,
        jsonNode.left,
        jsonNode.top,
        jsonNode.width,
        jsonNode.height,
        jsonNode.zIndex,
        jsonNode.containment,
        jsonNode
      );
    }

    if (node === undefined) {
      console.error(
        "SYNCMETA: Node undefined. Check if " +
          jsonNode.type +
          "  type is defined in the VLS"
      );
      throw new Error(
        "SYNCMETA: Node undefined. Check if " +
          jsonNode.type +
          "  type is defined in the VLS"
      );
    }

    node.registerYMap();
    node.addToCanvas(canvas);
    node.bindMoveToolEvents();
    node.draw();
  }

  function createNodes(nodes) {
    for (var nodeId in nodes) {
      if (nodes.hasOwnProperty(nodeId)) {
        createNode(nodeId, nodes[nodeId]);
        createdNodes++;
      }
    }
  }

  function createEdges(edges) {
    for (const edgeId in edges) {
      if (edges.hasOwnProperty(edgeId)) {
        //create edge
        var edge = EntityManager.createEdgeFromJSON(
          edges[edgeId].type,
          edgeId,
          edges[edgeId].source,
          edges[edgeId].target,
          edges[edgeId]
        );

        if (edge === undefined) {
          console.error(
            "SYNCMETA: Edge undefined. Check if " +
              edges[edgeId].type +
              "  type is defined in the VLS"
          );
          throw new Error(
            "SYNCMETA: Edge undefined. Check if " +
              edges[edgeId].type +
              "  type is defined in the VLS"
          );
        }

        //register it to Yjs and draw it to the canvas
        edge.registerYMap();
        edge.addToCanvas(canvas);
        edge.connect();
        edge.bindMoveToolEvents();
        createdEdges++;
      }
    }
  }

  if (numberOfNodes > 0) {
    createNodes(json.nodes);
    if (createdNodes === numberOfNodes) {
      if (numberOfEdges > 0) {
        createEdges(json.edges);
        if (createdEdges === numberOfEdges) {
          canvas.resetTool();
          report.createdNodes = createdNodes;
          report.createdEdges = createdEdges;
        }
      } else {
        report.createdNodes = createdNodes;
        report.createdEdges = 0;
      }
    }
  }
  return report;
}
