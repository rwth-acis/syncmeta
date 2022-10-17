import $ from 'jqueryui';
import jsPlumb from 'jsplumb';
import NodeTool from 'canvas_widget/NodeTool';
import EntityManager from 'canvas_widget/EntityManager';
import EnumNode from 'canvas_widget/EnumNode';

    EnumNodeTool.prototype = new NodeTool();
    EnumNodeTool.prototype.constructor = EnumNodeTool;
    /**
     * EnumNodeTool
     * @class canvas_widget.ClassNodeTool
     * @extends canvas_widget.NodeTool
     * @memberof canvas_widget
     * @constructor
     */
    function EnumNodeTool(){
        NodeTool.call(this,EnumNode.TYPE,null,null,null,EnumNode.DEFAULT_WIDTH,EnumNode.DEFAULT_HEIGHT);
    }

    export default EnumNodeTool;


