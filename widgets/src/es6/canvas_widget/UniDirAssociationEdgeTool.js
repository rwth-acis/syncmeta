import { UniDirAssociationEdge } from "./Manager";
import EdgeTool from "./EdgeTool";


/**
 * BiDirAssociationEdgeTool
 * @class canvas_widget.UniDirAssociationEdgeTool
 * @extends canvas_widget.EdgeTool
 * @memberof canvas_widget
 * @constructor
 */
class UniDirAssociationEdgeTool extends EdgeTool {
  constructor() {
    super(UniDirAssociationEdge.TYPE, UniDirAssociationEdge.RELATIONS);
  }
}

export default UniDirAssociationEdgeTool;
