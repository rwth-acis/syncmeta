import AbstractTool from 'palette_widget/AbstractTool';

    GeneralisationEdgeTool.prototype = new AbstractTool();
    GeneralisationEdgeTool.prototype.constructor = GeneralisationEdgeTool;
    /**
     * GeneralisationEdgeTool
     * @class palette_widget.GeneralisationEdgeTool
     * @memberof palette_widget
     * @extends palette_widget.AbstractTool
     * @constructor
     */
    function GeneralisationEdgeTool(toolName,toolLabel,toolDescription,toolIcon){
        AbstractTool.call(
            this,
            toolName||"Generalisation",
            toolLabel||"Generalisation",
            toolDescription||"Click and hold on one Node and release on another node to add an edge between these two nodes.",
            toolIcon||"generalisation.png"
        );
    }

    export default GeneralisationEdgeTool;


