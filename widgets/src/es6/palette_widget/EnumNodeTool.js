import AbstractTool from 'palette_widget/AbstractTool';

    EnumNodeTool.prototype = new AbstractTool();
    EnumNodeTool.prototype.constructor = EnumNodeTool;
    /**
     * EnumNodeTool
     * @class palette_widget.EnumNodeTool
     * @memberof palette_widget
     * @extends palette_widget.AbstractTool
     * @constructor
     */
    function EnumNodeTool(toolName,toolLabel,toolDescription,toolIcon){
        AbstractTool.call(
            this,
            toolName||"Enumeration",
            toolLabel||"Enum",
            toolDescription||"Click on an empty part of the canvas to add a node",
            toolIcon||"class.png"
        );
    }

    export default EnumNodeTool;


