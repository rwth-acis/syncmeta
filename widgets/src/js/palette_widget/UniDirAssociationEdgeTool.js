define([
    'palette_widget/AbstractTool'
],/** @lends UniDirAssociationEdgeTool */function(AbstractTool) {

    UniDirAssociationEdgeTool.prototype = new AbstractTool();
    UniDirAssociationEdgeTool.prototype.constructor = UniDirAssociationEdgeTool;
    /**
     * UniDirAssociationEdgeTool
     * @class palette_widget.palette_widget.UniDirAssociationEdgeTool
     * @memberof palette_widget
     * @extends palette_widget.AbstractTool
     * @constructor
     */
    function UniDirAssociationEdgeTool(toolName,toolLabel,toolDescription,toolIcon){
        AbstractTool.call(
            this,
            toolName||"Uni-Dir-Association",
            toolLabel||"Uni-Dir-Assoc",
            toolDescription||"Click and hold on one Node and release on another node to add an edge between these two nodes.",
            toolIcon||"unidirassociation.png"
        );
    }

    return UniDirAssociationEdgeTool;

});
