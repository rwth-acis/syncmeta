import { CONFIG } from "../config";
import IWCW from "../lib/IWCWrapper";
import ShowGuidanceBoxOperation from "../operations/non_ot/ShowGuidanceBoxOperation";
import "https://cdnjs.cloudflare.com/ajax/libs/graphlib/2.1.8/graphlib.min.js";

class GuidanceStrategy {
  static NAME = "Guidance Strategy"; //Override in child class to change the name of the strategy

  space;
  iwc;
  constructor(logicalGuidanceRepresentation, space) {
    if (logicalGuidanceRepresentation)
      this.logicalGuidanceRepresentation = graphlib.json.read(
        logicalGuidanceRepresentation
      );
    this.space = space;
    this.iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.GUIDANCE);
  }

  init() {
    if (logicalGuidanceRepresentation)
      this.logicalGuidanceRepresentation = graphlib.json.read(
        logicalGuidanceRepresentation
      );
    this.space = space;
    this.iwc = IWCW.getInstance(CONFIG.WIDGET.NAME.GUIDANCE);
  }

  showGuidanceBox(label, guidance, entityId) {
    var operation = new ShowGuidanceBoxOperation(label, guidance, entityId);
    this.iwc.sendLocalNonOTOperation(
      CONFIG.WIDGET.NAME.MAIN,
      operation.toNonOTOperation()
    );
  }
  sendGuidanceStrategyOperation(data) {
    //This function is set by the guidance widget
  }
  onValueChange(id, value, type, position) {
    //Override in child class to react to value change events
  }
  onEntitySelect(entityId, entityType) {
    //Override in child class to react to entity selection events
  }
  onNodeMove(id, offsetX, offsetY) {
    //Override in child class to react to node move events
  }
  onNodeMoveZ(id, offsetX, offsetY) {
    //Override in child class to react to node move z events
  }
  onNodeResize(id, offsetX, offsetY) {
    //Override in child class to react to node resize events
  }
  onNodeAdd(id, type) {
    //Override in child class to react to node add events
  }
  onEdgeAdd(id, type) {
    //Override in child class to react to edge add events
  }
  onNodeDelete(id, type) {
    //Override in child class to react to node delete events
  }
  onEdgeDelete(id, type) {
    //Override in child class to react to edge delete events
  }
  onGuidanceOperation(data) {
    //Override in chlid class to react to messages from guidance strategies
  }
  buildUi() {
    //Override in child class and return the ui (HTML) for this strategy
  }
}

export default GuidanceStrategy;
