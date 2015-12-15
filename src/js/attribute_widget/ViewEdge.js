define(function () {

    function makeViewEdge(attributes, edgeType){

        function ViewEdge(id, source, target){
            var viewEdge = new edgeType(id, source, target);
            viewEdge.applyAttributeRenaming(attributes);
            return viewEdge;
        }

        ViewEdge.getAttributes = function(){
            return attributes;
        };
        ViewEdge.getTargetEdgeType = function(){
            return edgeType;
        };

        return ViewEdge;
    }
    return makeViewEdge;
});