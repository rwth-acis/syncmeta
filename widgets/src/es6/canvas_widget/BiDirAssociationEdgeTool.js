import EdgeTool from "./EdgeTool";
import BiDirAssociationEdge from "./BiDirAssociationEdge";

BiDirAssociationEdgeTool.prototype = new EdgeTool();
BiDirAssociationEdgeTool.prototype.constructor = BiDirAssociationEdgeTool;
/**
 * BiDirAssociationEdgeTool
 * @class canvas_widget.BiDirAssociationEdgeTool
 * @extends canvas_widget.EdgeTool
 * @memberof canvas_widget
 * @constructor
 */
function BiDirAssociationEdgeTool() {
  EdgeTool.call(
    this,
    BiDirAssociationEdge.TYPE,
    BiDirAssociationEdge.RELATIONS
  );
}

export default BiDirAssociationEdgeTool;
