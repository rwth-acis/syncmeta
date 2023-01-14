import "https://unpkg.com/jquery@3.6.0/dist/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js";
import _ from "lodash-es";
// import "bootstrap";
import { EntityManagerInstance as EntityManager } from "../Manager";

class GhostEdge {
  constructor(canvas, edgeFunction, source, target) {
    var _jsPlumbConnection = null;
    var _label = edgeFunction.getType();
    var _canvas = canvas;
    var that = this;

    source.addGhostEdge(this);
    target.addGhostEdge(this);

    this.getLabel = function () {
      return _label;
    };

    this.connect = function (button) {
      if (_jsPlumbConnection) return;
      var overlays = edgeFunction.getArrowOverlays();
      overlays.push([
        "Custom",
        {
          create: function (component) {
            return $("<div></div>").append(button);
          },
          location: 0.5,
          id: "customOverlay",
          cssClass: "ghost-edge-overlay",
        },
      ]);
      var connectOptions = {
        source: source.get$node(),
        target: target.get$node(),
        paintStyle: {
          fill: edgeFunction.getColor(),
          outlineWidth: 2,
          dashstyle: "",
        },
        endpoint: "Dot",
        anchors: [source.getAnchorOptions(), target.getAnchorOptions()],
        connector: edgeFunction.getShape(),
        overlays: overlays,
        cssClass: "ghost-edge",
      };

      if (source === target) {
        connectOptions.anchors = ["TopCenter", "LeftMiddle"];
      }

      _jsPlumbConnection = window.JsPlumbInstance.connect(connectOptions);
      _.each(EntityManager.getEdges(), function (e) {
        e.setZIndex();
      });
    };

    this.remove = function () {
      if (_jsPlumbConnection)
        window.JsPlumbInstance.destroyConnector(_jsPlumbConnection);
      _jsPlumbConnection = null;
    };

    this.getEdgeFunction = function () {
      return edgeFunction;
    };

    this.getSource = function () {
      return source;
    };

    this.getTarget = function () {
      return target;
    };
  }
}

export default GhostEdge;
