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
        return Node(type, $shape, {}, {});
    };

    return ContextNode;

});