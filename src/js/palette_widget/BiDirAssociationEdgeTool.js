define([
    'palette_widget/AbstractTool'
],/** @lends BiDirAssociationEdgeTool */function(AbstractTool) {

    BiDirAssociationEdgeTool.prototype = new AbstractTool();
    BiDirAssociationEdgeTool.prototype.constructor = BiDirAssociationEdgeTool;
    /**
     * BiDirAssociationEdgeTool
     * @class palette_widget.palette_widget.BiDirAssociationEdgeTool
     * @memberof palette_widget
     * @extends palette_widget.AbstractTool
     * @constructor
     */
    function BiDirAssociationEdgeTool(toolName,toolLabel,toolDescription,toolIcon){
        AbstractTool.call(
            this,
            toolName||"Bi-Dir-Association",
            toolLabel||"Bi-Dir-Assoc",
            toolDescription||"Click and hold on one Node and release on another node to add an edge between these two nodes.",
            toolIcon||"bidirassociation.png"
        );
    }

    return BiDirAssociationEdgeTool;

});
