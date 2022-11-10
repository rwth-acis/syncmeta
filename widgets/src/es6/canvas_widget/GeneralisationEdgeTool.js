import { GeneralisationEdge } from "./Manager";
import EdgeTool from "./EdgeTool";

GeneralisationEdgeTool.prototype = new EdgeTool();
GeneralisationEdgeTool.prototype.constructor = GeneralisationEdgeTool;
/**
 * GeneralisationEdgeTool
 * @class canvas_widget.GeneralisationEdgeTool
 * @extends canvas_widget.EdgeTool
 * @memberof canvas_widget
 * @constructor
 */
function GeneralisationEdgeTool() {
  EdgeTool.call(this, GeneralisationEdge.TYPE, GeneralisationEdge.RELATIONS);
}

export default GeneralisationEdgeTool;
