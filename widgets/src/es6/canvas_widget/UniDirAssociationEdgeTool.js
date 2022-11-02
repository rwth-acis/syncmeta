import EdgeTool from "./EdgeTool";
import UniDirAssociationEdge from "./UniDirAssociationEdge";

UniDirAssociationEdgeTool.prototype = new EdgeTool();
UniDirAssociationEdgeTool.prototype.constructor = UniDirAssociationEdgeTool;
/**
 * BiDirAssociationEdgeTool
 * @class canvas_widget.UniDirAssociationEdgeTool
 * @extends canvas_widget.EdgeTool
 * @memberof canvas_widget
 * @constructor
 */
function UniDirAssociationEdgeTool() {
  EdgeTool.call(
    this,
    UniDirAssociationEdge.TYPE,
    UniDirAssociationEdge.RELATIONS
  );
}

export default UniDirAssociationEdgeTool;
