import $ from 'jqueryui';
import jsPlumb from 'jsplumb';
import NodeTool from 'canvas_widget/NodeTool';
import ObjectNode from 'canvas_widget/ObjectNode';

    ObjectNodeTool.prototype = new NodeTool();
    ObjectNodeTool.prototype.constructor = ObjectNodeTool;
    /**
     * ObjectNodeTool
     * @class canvas_widget.ObjectNodeTool
     * @memberof canvas_widget
     * @constructor
     */
    function ObjectNodeTool(){
        NodeTool.call(this,ObjectNode.TYPE,null,null,null,ObjectNode.DEFAULT_WIDTH,ObjectNode.DEFAULT_HEIGHT);
    }

    export default ObjectNodeTool;


