import { CONFIG } from "../config";
import IWCW from "../lib/IWCWrapper";
import ShowGuidanceBoxOperation from "../operations/non_ot/ShowGuidanceBoxOperation";
import graphlib from "graphlib/dist/graphlib.core.min.js";;
import "../lib/Class";

var GuidanceStrategy = Class.extend({
  init: function (logicalGuidanceRepresentation, space) {
    if (logicalGuidanceRepresentation)
      this.logicalGuidanceRepresentation = graphlib.json.read(
        logicalGuidanceRepresentation
      );
    this.space = space;
    this.iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.GUIDANCE);
  },
  showGuidanceBox: function (label, guidance, entityId) {
    var operation = new ShowGuidanceBoxOperation(label, guidance, entityId);
    this.iwc.sendLocalNonOTOperation(
      CONFIG.WIDGET.NAME.MAIN,
      operation.toNonOTOperation()
    );
  },
  sendGuidanceStrategyOperation: function (data) {
    //This function is set by the guidance widget
  },
  onValueChange: function (id, value, type, position) {
    //Override in child class to react to value change events
  },
  onEntitySelect: function (entityId, entityType) {
    //Override in child class to react to entity selection events
  },
  onNodeMove: function (id, offsetX, offsetY) {
    //Override in child class to react to node move events
  },
  onNodeMoveZ: function (id, offsetX, offsetY) {
    //Override in child class to react to node move z events
  },
  onNodeResize: function (id, offsetX, offsetY) {
    //Override in child class to react to node resize events
  },
  onNodeAdd: function (id, type) {
    //Override in child class to react to node add events
  },
  onEdgeAdd: function (id, type) {
    //Override in child class to react to edge add events
  },
  onNodeDelete: function (id, type) {
    //Override in child class to react to node delete events
  },
  onEdgeDelete: function (id, type) {
    //Override in child class to react to edge delete events
  },
  onGuidanceOperation: function (data) {
    //Override in chlid class to react to messages from guidance strategies
  },
  buildUi: function () {
    //Override in child class and return the ui (HTML) for this strategy
  },
});

//Override in child class to change the name of the strategy
GuidanceStrategy.NAME = "Guidance Strategy";

export default GuidanceStrategy;
