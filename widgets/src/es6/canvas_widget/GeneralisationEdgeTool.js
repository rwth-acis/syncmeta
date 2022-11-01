import $ from 'jqueryui';
import jsPlumb from 'jsplumb';
import EdgeTool from 'canvas_widget/EdgeTool';
import AbstractClassNode from 'canvas_widget/AbstractClassNode';
import ObjectNode from 'canvas_widget/ObjectNode';
import RelationshipNode from 'canvas_widget/RelationshipNode';
import EnumNode from 'canvas_widget/EnumNode';
import GeneralisationEdge from 'canvas_widget/GeneralisationEdge';

    GeneralisationEdgeTool.prototype = new EdgeTool();
    GeneralisationEdgeTool.prototype.constructor = GeneralisationEdgeTool;
    /**
     * GeneralisationEdgeTool
     * @class canvas_widget.GeneralisationEdgeTool
     * @extends canvas_widget.EdgeTool
     * @memberof canvas_widget
     * @constructor
     */
    function GeneralisationEdgeTool(){
        EdgeTool.call(this,GeneralisationEdge.TYPE,GeneralisationEdge.RELATIONS);
    }

    export default GeneralisationEdgeTool;

