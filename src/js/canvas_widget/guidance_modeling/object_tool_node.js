define([
    'require',
    'jqueryui',
    'jsplumb',
    'lodash',
    'canvas_widget/Node',
    'text!templates/guidance_modeling/object_tool_node.html'
],/** @lends ObjectToolNode */function(require,$,jsPlumb,_,Node,objectToolNodeHtml) {
    function ObjectToolNode(type){
        var $shape = $(_.template(objectToolNodeHtml,{type: type}));
        var anchors = [ "Perimeter", { shape:"Diamond", anchorCount: 10} ];
        return Node(type, $shape, anchors, {});
    };

    return ObjectToolNode;

});