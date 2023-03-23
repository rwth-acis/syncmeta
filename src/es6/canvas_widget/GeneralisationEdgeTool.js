import { GeneralisationEdge } from "./Manager";
import EdgeTool from "./EdgeTool";


/**
 * GeneralisationEdgeTool
 * @class canvas_widget.GeneralisationEdgeTool
 * @extends canvas_widget.EdgeTool
 * @memberof canvas_widget
 * @constructor
 */
class GeneralisationEdgeTool extends EdgeTool {
  constructor() {
    super(GeneralisationEdge.TYPE, GeneralisationEdge.RELATIONS);
  }
}

export default GeneralisationEdgeTool;
