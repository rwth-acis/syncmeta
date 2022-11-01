import AbstractTool from 'palette_widget/AbstractTool';

    ObjectNodeTool.prototype = new AbstractTool();
    ObjectNodeTool.prototype.constructor = ObjectNodeTool;
    /**
     * ObjectNodeTool
     * @class palette_widget.ObjectNodeTool
     * @memberof palette_widget
     * @extends palette_widget.AbstractTool
     * @constructor
     */
    function ObjectNodeTool(toolName,toolLabel,toolDescription,toolIcon){
        AbstractTool.call(
            this,
            toolName||"Object",
            toolLabel||"Object",
            toolDescription||"Click on an empty part of the canvas to add a node",
            toolIcon||"class.png"
        );
    }

    export default ObjectNodeTool;


