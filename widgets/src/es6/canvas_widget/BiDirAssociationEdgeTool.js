import { BiDirAssociationEdge } from "./Manager";
import EdgeTool from "./EdgeTool";

BiDirAssociationEdgeTool.prototype = new EdgeTool();
/**
 * BiDirAssociationEdgeTool
 * @class canvas_widget.BiDirAssociationEdgeTool
 * @extends canvas_widget.EdgeTool
 * @memberof canvas_widget
 * @constructor
 */
class BiDirAssociationEdgeTool {
  constructor() {
    EdgeTool.call(
      this,
      BiDirAssociationEdge.TYPE,
      BiDirAssociationEdge.RELATIONS
    );
  }
}

export default BiDirAssociationEdgeTool;
