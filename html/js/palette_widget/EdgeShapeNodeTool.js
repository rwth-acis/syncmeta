define([
    'palette_widget/AbstractTool'
],/** @lends EdgeShapeNodeTool */function(AbstractTool) {

    EdgeShapeNodeTool.prototype = new AbstractTool();
    EdgeShapeNodeTool.prototype.constructor = EdgeShapeNodeTool;
    /**
     * EdgeShapeNodeTool
     * @class palette_widget.EdgeShapeNodeTool
     * @memberof palette_widget
     * @extends palette_widget.AbstractTool
     * @constructor
     */
    function EdgeShapeNodeTool(toolName,toolLabel,toolDescription,toolIcon){
        AbstractTool.call(
            this,
            toolName||"Edge Shape",
            toolLabel||"Edge Shape",
            toolDescription||"Click on an empty part of the canvas to add a node",
            toolIcon||"class.png"
        );
    }

    return EdgeShapeNodeTool;

});
