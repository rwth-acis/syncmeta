import AbstractTool from 'palette_widget/AbstractTool';

    ViewObjectNodeTool.prototype = new AbstractTool();
    ViewObjectNodeTool.prototype.constructor = ViewObjectNodeTool;
    /**
     * ViewObjectNodeTool
     * @class palette_widget.ViewObjectNodeTool
     * @memberof palette_widget
     * @extends palette_widget.AbstractTool
     * @constructor
     */
    function ViewObjectNodeTool(toolName,toolLabel,toolDescription,toolIcon){
        AbstractTool.call(
            this,
            toolName||"ViewObject",
            toolLabel||"ViewObject",
            toolDescription||"Click on an empty part of the canvas to add a view type",
            toolIcon||"class.png"
        );
    }

    export default ViewObjectNodeTool;


