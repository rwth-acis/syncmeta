define([
    'palette_widget/AbstractTool'
],/** @lends ObjectGuidanceTool */function(AbstractTool) {

    ObjectGuidanceTool.prototype = new AbstractTool();
    ObjectGuidanceTool.prototype.constructor = ObjectGuidanceTool;
    /**
     * ObjectGuidanceTool
     * @class palette_widget.ObjectGuidanceTool
     * @memberof palette_widget
     * @extends palette_widget.AbstractTool
     * @constructor
     */
    function ObjectGuidanceTool(toolName,toolLabel,toolDescription,toolIcon){
        AbstractTool.call(
            this,
            toolName||"Object Guidance",
            toolLabel||"Object Guidance",
            toolDescription||"Click on an empty part of the canvas to add a object guidance node",
            toolIcon||"class.png"
        );
    }

    return ObjectGuidanceTool;

});
