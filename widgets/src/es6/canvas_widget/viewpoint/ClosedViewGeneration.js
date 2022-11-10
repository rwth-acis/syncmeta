import _ from "lodash";
import "https://cdnjs.cloudflare.com/ajax/libs/graphlib/2.1.8/graphlib.min.js";
import EntityManager from "canvas_widget/EntityManager";
/**
 * The closed-view-generation(CVG) algorithm
 * Searches for neighbors of a referenced object/relationship node and adds the neighbors to the viewpoint model
 * @param viewType the view type node
 * @constructor
 */
function CVG(viewType) {
  //the metamodel as json from the y-space
  const dataMap = y.getMap("data");
  var metamodel = dataMap.get("model");
  //initilaize the current metamodel using the graphlib.Graph
  var metaGraph = new graphlib.Graph();
  _.forEach(metamodel.nodes, function (value, index) {
    metaGraph.setNode(index, value);
  });
  _.forEach(metamodel.edges, function (value, index) {
    value.id = index;
    metaGraph.setEdge(value.source, value.target, value);
  });

  var originId = viewType
    .getAttribute(viewType.getEntityId() + "[target]")
    .getValue()
    .getValue();
  var neighborsOfOrigin = metaGraph.neighbors(originId);
  var canvas = viewType.getCanvas();
  var viewpointName = $("#lblCurrentView").text().replace("View:", "");

  _.forEach(neighborsOfOrigin, function (neighborId) {
    var node = metaGraph.node(neighborId);
    var newNodeId;
    //if neighbor is shape or relation just add it and the corresponding assocation
    if (
      node.type === "Node Shape" ||
      node.type === "Edge Shape" ||
      node.type === "Relation"
    ) {
      newNodeId = viewpointName + "_" + neighborId;
      if (!EntityManager.findNode(newNodeId))
        canvas.createNode(
          node.type,
          node.left,
          node.top,
          node.width,
          node.height,
          node.zIndex,
          node.containment,
          node,
          newNodeId
        );
    } else if (
      viewType.getType() === "ViewObject" &&
      node.type === "Relationship"
    ) {
      var viewtypes = EntityManager.getNodesByType("ViewRelationship");
      for (var key in viewtypes) {
        if (viewtypes.hasOwnProperty(key)) {
          var viewType2 = viewtypes[key];
          if (
            viewType2
              .getAttribute(viewType2.getEntityId() + "[target]")
              .getValue()
              .getValue() === neighborId
          )
            newNodeId = viewType2.getEntityId();
        }
      }
    } else if (
      viewType.getType() === "ViewRelationship" &&
      node.type === "Object"
    ) {
      var viewtypes = EntityManager.getNodesByType("ViewObject");
      for (var key in viewtypes) {
        if (viewtypes.hasOwnProperty(key)) {
          var viewType2 = viewtypes[key];
          if (
            viewType2
              .getAttribute(viewType2.getEntityId() + "[target]")
              .getValue()
              .getValue() === neighborId
          )
            newNodeId = viewType2.getEntityId();
        }
      }
    }
    if (newNodeId) {
      var edge = metaGraph.edge(originId, neighborId);
      if (!edge) {
        //try the other direction
        edge = metaGraph.edge(neighborId, originId);
        canvas.createEdge(
          edge.type,
          newNodeId,
          viewType.getEntityId(),
          edge,
          viewpointName + "_" + edge.id,
          viewpointName
        );
      } else {
        canvas.createEdge(
          edge.type,
          viewType.getEntityId(),
          newNodeId,
          edge,
          viewpointName + "_" + edge.id,
          viewpointName
        );
      }
    }
  });
}
export default CVG;
