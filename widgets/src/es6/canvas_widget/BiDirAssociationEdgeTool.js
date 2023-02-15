import { BiDirAssociationEdge } from "./Manager";
import EdgeTool from "./EdgeTool";


/**
 * BiDirAssociationEdgeTool
 * @class canvas_widget.BiDirAssociationEdgeTool
 * @extends canvas_widget.EdgeTool
 * @memberof canvas_widget
 * @constructor
 */
class BiDirAssociationEdgeTool extends EdgeTool {
  constructor() {
    super(BiDirAssociationEdge.TYPE, BiDirAssociationEdge.RELATIONS);
  }
}

export default BiDirAssociationEdgeTool;
