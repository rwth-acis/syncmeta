define([
    'require',
    'jqueryui',
    'jsplumb',
    'lodash',
    'canvas_widget/Node',
    'text!templates/guidance_modeling/context_node.html'
],/** @lends ContextNode */function(require,$,jsPlumb,_,Node,contextNodeHtml) {
    function ContextNode(type){
        var $shape = $(_.template(contextNodeHtml,{type: type}));
        var anchors = [ "Perimeter", { shape:"Rectangle", anchorCount: 10} ];
        return Node(type, $shape, anchors, {});
    };

    return ContextNode;

});