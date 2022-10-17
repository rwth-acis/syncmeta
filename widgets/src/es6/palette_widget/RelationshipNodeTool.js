import AbstractTool from 'palette_widget/AbstractTool';

    RelationshipNodeTool.prototype = new AbstractTool();
    RelationshipNodeTool.prototype.constructor = RelationshipNodeTool;
    /**
     * RelationshipNodeTool
     * @class palette_widget.RelationshipNodeTool
     * @memberof palette_widget
     * @extends palette_widget.AbstractTool
     * @constructor
     */
    function RelationshipNodeTool(toolName,toolLabel,toolDescription,toolIcon){
        AbstractTool.call(
            this,
            toolName||"Relationship",
            toolLabel||"Relationship",
            toolDescription||"Click on an empty part of the canvas to add a node",
            toolIcon||"class.png"
        );
    }

    export default RelationshipNodeTool;

