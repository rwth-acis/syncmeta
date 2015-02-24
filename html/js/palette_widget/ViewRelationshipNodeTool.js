define([
    'palette_widget/AbstractTool'
],/** @lends ViewRelationshipNodeTool */function(AbstractTool) {

    ViewRelationshipNodeTool.prototype = new AbstractTool();
    ViewRelationshipNodeTool.prototype.constructor = ViewRelationshipNodeTool;
    /**
     * ViewRelationshipNodeTool
     * @class palette_widget.ViewRelationshipNodeTool
     * @memberof palette_widget
     * @extends palette_widget.AbstractTool
     * @constructor
     */
    function ViewRelationshipNodeTool(toolName,toolLabel,toolDescription,toolIcon){
        AbstractTool.call(
            this,
            toolName||"ViewRelationship",
            toolLabel||"ViewRelationship",
            toolDescription||"Click on an empty part of the canvas to add a view type",
            toolIcon||"class.png"
        );
    }
    return ViewRelationshipNodeTool;
});
